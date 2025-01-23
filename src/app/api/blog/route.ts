import sdb from '@/db/surrealdb';
import { PostSchemaCreate } from '@/schemas/zod/blog';
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
    const db = await sdb();
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Extract query parameters for search
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    const category = searchParams.get('category');

    // Extract query parameters for sorting
    const orderBy = searchParams.get('orderBy') || 'created_at'; // Default field for sorting
    const orderDirection = searchParams.get('orderDirection') || 'DESC'; // Default sorting direction

    // Validate orderBy to prevent SQL injection
    const validOrderByFields = ['created_at', 'title', 'slug'];
    const safeOrderBy = validOrderByFields.includes(orderBy) ? orderBy : 'created_at';

    // Build the query
    let query = `SELECT * FROM ${tableNames.post}`;
    const conditions: string[] = [];

    // Add conditions to the query dynamically based on query parameters
    if (title) {
      conditions.push(`title CONTAINS '${title}'`);
    }
    if (author) {
      conditions.push(`author = '${author}'`);
    }
    if (category) {
      conditions.push(`categories CONTAINS '${category}'`);
    }

    // Append WHERE clause if any conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY clause for sorting
    query += ` ORDER BY ${safeOrderBy} ${orderDirection}`;

    // Add LIMIT and OFFSET (optional, if needed)
    const limit = 2; // Fixed value for record limit
    const offset = 0; // Fixed value for starting point
    query += ` LIMIT ${limit} START ${offset}`;

    // Execute the query
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
