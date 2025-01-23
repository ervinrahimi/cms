import sdb from '@/db/surrealdb';
import { likesSchemaCreate } from '@/schemas/zod/blog';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/blog/likes" [ POST - GET ]
 
  GET: API handler for fetching all likes from the "likes" table in SurrealDB.
  POST: API handler for creating a new like in the "likes" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderBy = url.searchParams.get('orderBy') || 'created_at'; // Default field for sorting
    const orderDirection = url.searchParams.get('orderDirection') || 'DESC'; // Default sorting direction

    const limit = 2; // Fixed value for record limit
    const offset = 0; // Fixed value for starting point

    const db = await sdb();
    const query = `SELECT * FROM ${tableNames.like} ORDER BY ${orderBy} ${orderDirection} LIMIT ${limit} START ${offset}`;

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

export async function POST(req: Request) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = likesSchemaCreate.parse(body);
    const { user_ref, post_ref } = validatedBody;

    // Convert user_ref, post_ref to RecordId objects
    const userId = new RecordId(tableNames.user, user_ref);
    const postId = new RecordId(tableNames.post, post_ref);

    const likeData = {
      user_ref: userId,
      post_ref: postId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLike = await db.create(tableNames.like, likeData);

    return NextResponse.json(createdLike, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create like', details: err.message },
      {
        status: 500,
      }
    );
  }
}
