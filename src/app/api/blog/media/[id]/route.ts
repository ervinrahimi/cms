import sdb from '@/db/surrealdb';
import { BlogMediaSchemaUpdate } from '@/schemas/zod/blog';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import tableNames from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*
  Route: "api/blog-media/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific media record from the "BlogMedia" table in SurrealDB.
  PUT: API handler for updating a specific media record in the "BlogMedia" table in SurrealDB.
  DELETE: API handler for deleting a specific media record from the "BlogMedia" table in SurrealDB.
 */

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const mediaCheck = await checkExists(tableNames.media, id, `Media with ID ${id} not found.`);
    if (mediaCheck !== true) {
      return mediaCheck;
    }

    const media = await db.select(new RecordId(tableNames.media, id));

    return NextResponse.json(media, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch media record', details: (error as Error).message },
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
    const mediaCheck = await checkExists(tableNames.media, id, `Media with ID ${id} not found.`);
    if (mediaCheck !== true) {
      return mediaCheck;
    }

    const validatedBody = BlogMediaSchemaUpdate.parse(body);
    const { post_ref, media_url, media_type } = validatedBody;

    const updates: Patch[] = [];

    const fields = [
      {
        path: '/post_ref',
        value: post_ref ? new RecordId(tableNames.post, post_ref) : undefined,
      },
      { path: '/media_url', value: media_url },
      { path: '/media_type', value: media_type },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(tableNames.media, id);

    // Apply the patch
    const updatedMedia = await db.patch(recordId, updates);

    return NextResponse.json(updatedMedia, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update media record', details: err.message },
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
    const mediaCheck = await checkExists(tableNames.media, id, `Media with ID ${id} not found.`);
    if (mediaCheck !== true) {
      return mediaCheck;
    }

    // Delete the media record
    await db.delete(new RecordId(tableNames.media, id));

    return NextResponse.json({ message: 'Media record deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete media record.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
