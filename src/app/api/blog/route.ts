import sdb from '@/db/surrealdb';
import { PostSchemaCreate } from '@/schemas/zod/blog';
import buildQuery from '@/utils/api/queryBuilder';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*
  Route: "api/blog" [ POST - GET ]
 
  GET: API handler for fetching all posts from the "posts" table in SurrealDB.
  POST: API handler for creating a new post in the "posts" table in SurrealDB.
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, tableNames.post, ['created_at', 'slug'], 'title');
    const posts = await db.query(query);

    return NextResponse.json(posts, {
      status: 200,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = PostSchemaCreate.parse(body);
    const { title, content, slug, author, categories, tags, likes, comments } = validatedBody;

    // Convert author, categories, tags, likes, and comments to RecordId objects
    const authorId = new RecordId(tableNames.user, author);
    const categoryIds = categories.map((cat: string) => new RecordId(tableNames.category, cat));
    const tagIds = tags?.map((tag: string) => new RecordId(tableNames.tag, tag));
    const likeIds = likes?.map((lik: string) => new RecordId(tableNames.like, lik));
    const commentIds = comments?.map((com: string) => new RecordId(tableNames.comment, com));

    // Create a record for the post

    const postData = {
      title,
      content,
      slug,
      author: authorId,
      categories: categoryIds,
      tags: tagIds,
      likes: likeIds,
      comments: commentIds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdPost = await db.create(tableNames.post, postData);

    return NextResponse.json(createdPost, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create posts', details: err.message },
      {
        status: 500,
      }
    );
  }
}
