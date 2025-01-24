import sdb from '@/db/surrealdb';
import { PostSchemaUpdate } from '@/schemas/zod/blog';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*
  Route: "api/blog/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific post from the "posts" table in SurrealDB.
  PUT: API handler for updating a specific post in the "posts" table in SurrealDB.
  DELETE: API handler for deleting a specific post from the "posts" table in SurrealDB.
 */

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const postCheck = await checkExists(tableNames.post, id, `Post with ID ${id} not found.`);
    if (postCheck !== true) {
      return postCheck;
    }

    const post = await db.select(new RecordId(tableNames.post, id));

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch post', details: (error as Error).message },
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
    const postCheck = await checkExists(tableNames.post, id, `Post with ID ${id} not found.`);
    if (postCheck !== true) {
      return postCheck;
    }
    const validatedBody = PostSchemaUpdate.parse(body);
    const { title, content, slug, author, categories, tags, likes, comments } = validatedBody;

    // Convert categories, tags, likes, and comments to RecordId objects
    const categoryIds = categories?.map((cat: string) => new RecordId(tableNames.category, cat));
    const tagIds = tags?.map((tag: string) => new RecordId(tableNames.tag, tag));
    const likeIds = likes?.map((lik: string) => new RecordId(tableNames.like, lik));
    const commentIds = comments?.map((com: string) => new RecordId(tableNames.comment, com));

    const updates: Patch[] = [];

    const fields = [
      { path: '/title', value: title },
      { path: '/content', value: content },
      { path: '/slug', value: slug },
      {
        path: '/author',
        value: author ? new RecordId(tableNames.user, author) : undefined,
      },
      { path: '/categories', value: categoryIds },
      { path: '/tags', value: tagIds },
      { path: '/likes', value: likeIds },
      { path: '/comments', value: commentIds },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(tableNames.post, id);

    // Apply the patch
    const updatedPost = await db.patch(recordId, updates);

    return NextResponse.json(updatedPost, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update post', details: err.message },
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
    const postCheck = await checkExists(tableNames.post, id, `Post with ID ${id} not found.`);
    if (postCheck !== true) {
      return postCheck;
    }

    // Delete the post
    await db.delete(new RecordId(tableNames.post, id));

    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete post.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
