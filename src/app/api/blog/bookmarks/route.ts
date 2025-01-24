import sdb from '@/db/surrealdb';
import { bookmarksSchemaCreate } from '@/schemas/zod/blog';
import buildQuery from '@/utils/api/queryBuilder';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/blog/bookmarks" [ POST - GET ]
 
  GET: API handler for fetching all bookmarks from the "bookmarks" table in SurrealDB.
  POST: API handler for creating a new post in the "bookmarks" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, tableNames.bookmark, ['created_at'], 2, 0);
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
    const validatedBody = bookmarksSchemaCreate.parse(body);
    const { user_ref, post_ref } = validatedBody;

    // Convert user_ref, post_ref and comments to RecordId objects
    const userId = new RecordId(tableNames.user, user_ref);
    const postId = new RecordId(tableNames.post, post_ref);

    const bookmarksData = {
      user_ref: userId,
      post_ref: postId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdBookmarks = await db.create(tableNames.bookmark, bookmarksData);

    return NextResponse.json(createdBookmarks, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create bookmarks', details: err.message },
      {
        status: 500,
      }
    );
  }
}
