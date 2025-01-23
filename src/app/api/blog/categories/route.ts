import sdb from '@/db/surrealdb';
import { CategorySchemaCreate } from '@/schemas/zod/blog';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

/*

  Route: "api/blog/categories" [ POST - GET ]
 
  GET: API handler for fetching all categories from the "categories" table in SurrealDB.
  POST: API handler for creating a new category in the "categories" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Extract query parameters for search
    const title = searchParams.get('title');

    // Extract query parameters for sorting
    const orderBy = searchParams.get('orderBy') || 'created_at'; // Default field for sorting
    const orderDirection = searchParams.get('orderDirection') || 'DESC'; // Default sorting direction

    // Validate orderBy to prevent SQL injection
    const validOrderByFields = ['created_at', 'title'];
    const safeOrderBy = validOrderByFields.includes(orderBy) ? orderBy : 'created_at';

    const limit = 2; // Fixed value for record limit
    const offset = 0; // Fixed value for starting point

    const db = await sdb();

    // Build the base query
    let query = `SELECT * FROM ${tableNames.post}`;

    // Add condition for title search if provided
    if (title) {
      query += ` WHERE title CONTAINS '${title}'`;
    }

    // Add ORDER BY clause for sorting
    query += ` ORDER BY ${safeOrderBy} ${orderDirection}`;

    // Add LIMIT and OFFSET
    query += ` LIMIT ${limit} START ${offset}`;

    // Execute the query
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
    const { title, description, slug } = validatedBody;

    const categoriesData = {
      title: title,
      description: description,
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCategory = await db.create(tableNames.category, categoriesData);

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
