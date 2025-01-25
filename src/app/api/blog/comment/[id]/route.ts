import sdb from '@/db/surrealdb';
import { CommentSchemaUpdate } from '@/schemas/zod/blog';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/blog/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific comment from the "comments" table in SurrealDB.
  PUT: API handler for updating a specific comment in the "comments" table in SurrealDB.
  DELETE: API handler for deleting a specific comment from the "comments" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const commentCheck = await checkExists(
      tableNames.comment,
      id,
      `comment with ID ${id} not found.`
    );
    if (commentCheck !== true) {
      return commentCheck;
    }

    const comment = await db.select(new RecordId(tableNames.comment, id));

    return NextResponse.json(comment, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch comment', details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const body = await req.json();
    const { id } = await params;

    // Check if the ID is valid
    const commentCheck = await checkExists(
      tableNames.comment,
      id,
      `comment with ID ${id} not found.`
    );
    if (commentCheck !== true) {
      return commentCheck;
    }

    const validatedBody = CommentSchemaUpdate.parse(body);
    const { post_ref, content, user_ref, parent_id } = validatedBody;

    if (post_ref) {
      const postCheck = await checkExists(
        tableNames.post,
        post_ref,
        `Post with ID ${post_ref} not found.`
      );
      if (postCheck !== true) {
        return postCheck;
      }
    }

    if (user_ref) {
      const userCheck = await checkExists(
        tableNames.user,
        user_ref,
        `user with ID ${user_ref} not found.`
      );
      if (userCheck !== true) {
        return userCheck;
      }
    }

    if (parent_id) {
      const commentCheck = await checkExists(
        tableNames.comment,
        parent_id,
        `comment with ID ${parent_id} not found.`
      );
      if (commentCheck !== true) {
        return commentCheck;
      }
    }

    const updates: Patch[] = [];

    const fields = [
      { path: '/content', value: content },
      {
        path: '/post_ref',
        value: post_ref ? new RecordId(tableNames.post, post_ref) : undefined,
      },
      {
        path: '/user_ref',
        value: user_ref ? new RecordId(tableNames.user, user_ref) : undefined,
      },
      {
        path: '/parent_comment_ref',
        value: parent_id ? new RecordId(tableNames.category, parent_id) : undefined,
      },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(tableNames.comment, id);

    // Apply the patch
    const updatedComment = await db.patch(recordId, updates);

    return NextResponse.json(updatedComment, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update comment', details: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const commentCheck = await checkExists(
      tableNames.comment,
      id,
      `comment with ID ${id} not found.`
    );
    if (commentCheck !== true) {
      return commentCheck;
    }
    const like = await db.select(new RecordId(tableNames.like, id));

    const post_id = like.post_ref as RecordId;

    await db.delete(new RecordId(tableNames.comment, id));
    await db.query(`UPDATE ${tableNames.post} SET comments -= $comment_id WHERE id = $post_id`, {
      comment_id: new RecordId(tableNames.comment, id),
      post_id: post_id,
    });

    return NextResponse.json({ message: 'Comments deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete comment.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
