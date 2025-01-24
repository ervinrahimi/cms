import sdb from '@/db/surrealdb';
import { BlogMediaSchemaCreate } from '@/schemas/zod/blog';
import buildQuery from '@/utils/api/queryBuilder';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*
  Route: "api/blog-media" [ POST - GET ]

  GET: API handler for fetching all media records from the "BlogMedia" table in SurrealDB.
  POST: API handler for creating a new media record in the "BlogMedia" table in SurrealDB.
*/

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, tableNames.media, ['created_at', 'media_type']);
    const mediaRecords = await db.query(query);

    return NextResponse.json(mediaRecords, {
      status: 200,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch media records', details: (error as Error).message },
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
    const validatedBody = BlogMediaSchemaCreate.parse(body);
    const { post_ref, media_url, media_type } = validatedBody;

    // Convert post_ref to RecordId object
    const postRefId = new RecordId(tableNames.post, post_ref);

    // Create a record for the media
    const mediaData = {
      post_ref: postRefId,
      media_url,
      media_type,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdMedia = await db.create(tableNames.media, mediaData);

    return NextResponse.json(createdMedia, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create media record', details: err.message },
      {
        status: 500,
      }
    );
  }
}
