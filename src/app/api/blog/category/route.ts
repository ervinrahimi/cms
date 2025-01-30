import sdb from '@/db/surrealdb';
import { CategorySchemaCreate } from '@/schemas/zod/blog';
import { checkExists } from '@/utils/api/checkExists';
import buildQuery from '@/utils/api/blog/queryBuilder';
import { blogTabels } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/blog/category" [ POST - GET ]
 
  GET: API handler for fetching all categories from the "BlogCategory" table in SurrealDB.
  POST: API handler for creating a new category in the "BlogCategory" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, blogTabels.category, ['created_at', 'slug'], 'title');
    const result = await db.query(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'An error occurred', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = CategorySchemaCreate.parse(body);
    const { title, description, slug, parent_id } = validatedBody;

    if (parent_id) {
      const categoryCheck = await checkExists(
        blogTabels.category,
        parent_id,
        `category with ID ${parent_id} not found.`
      );
      if (categoryCheck !== true) {
        return categoryCheck;
      }
    }

    const categoriesData = {
      parent_id: parent_id ? new RecordId(blogTabels.category, parent_id) : undefined,
      title: title,
      description: description,
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCategory = await db.create(blogTabels.category, categoriesData);

    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create category', details: err.message },
      {
        status: 500,
      }
    );
  }
}
