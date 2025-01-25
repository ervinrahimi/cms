import sdb from '@/db/surrealdb';
import { TagSchemaCreate } from '@/schemas/zod/blog';
import buildQuery from '@/utils/api/queryBuilder';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

/*

  Route: "api/blog/tags" [ POST - GET ]
 
  GET: API handler for fetching all tags from the "tags" table in SurrealDB.
  POST: API handler for creating a new tag in the "tags" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, tableNames.tag, ['created_at', 'name', 'slug']);
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
    const validatedBody = TagSchemaCreate.parse(body);
    const { name, slug } = validatedBody;

    const tagsData = {
      name: name,
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdTag = await db.create(tableNames.tag, tagsData);

    return NextResponse.json(createdTag, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update tag', details: err.message },
      {
        status: 500,
      }
    );
  }
}
