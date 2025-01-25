import sdb from '@/db/surrealdb';
import { CommentSchemaCreate } from '@/schemas/zod/blog';
import { checkExists } from '@/utils/api/checkExists';
import buildQuery from '@/utils/api/queryBuilder';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/blog/comments" [ POST - GET ]
 
 GET: API handler for fetching all comments from the "comments" table in SurrealDB.
 POST: API handler for creating a new comment in the "comments" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, tableNames.comment, ['created_at']);
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
    const validatedBody = CommentSchemaCreate.parse(body);
    const { post_ref, user_ref, content, parent_id } = validatedBody;

    const postCheck = await checkExists(
      tableNames.post,
      post_ref,
      `Post with ID ${post_ref} not found.`
    );
    if (postCheck !== true) {
      return postCheck;
    }

    const userCheck = await checkExists(
      tableNames.user,
      user_ref,
      `user with ID ${user_ref} not found.`
    );
    if (userCheck !== true) {
      return userCheck;
    }

    if (parent_id) {
      const postCheck = await checkExists(
        tableNames.comment,
        parent_id,
        `Post with ID ${parent_id} not found.`
      );
      if (postCheck !== true) {
        return postCheck;
      }
    }

    // Convert post_ref and user_ref to RecordId objects
    const postId = new RecordId(tableNames.post, post_ref);
    const userId = new RecordId(tableNames.user, user_ref);
    const commentData = {
      parent_comment_ref: parent_id ? new RecordId(tableNames.category, parent_id) : undefined,
      post_ref: postId,
      user_ref: userId,
      content: content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdComment = await db.create(tableNames.comment, commentData);

    if (createdComment?.length > 0) {
      const commentId = createdComment[0]?.id.id;
      if (commentId) {
        await db.query(
          `UPDATE ${tableNames.post} SET comments += $comment_id WHERE id = $post_id`,
          {
            comment_id: new RecordId(tableNames.comment, commentId),
            post_id: postId,
          }
        );
      }
    }

    return NextResponse.json(createdComment, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create comment', details: err.message },
      {
        status: 500,
      }
    );
  }
}
