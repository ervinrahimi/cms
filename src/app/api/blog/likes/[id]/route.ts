import sdb from '@/db/surrealdb';
import { checkExists } from '@/utils/api/checkExists';
import tableNames from '@/utils/api/tableNames';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

/*

  Route: "api/blog/likes/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific like from the "likes" table in SurrealDB.
  DELETE: API handler for deleting a specific like from the "likes" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const likeCheck = await checkExists(tableNames.like, id, `like with ID ${id} not found.`);
    if (likeCheck !== true) {
      return likeCheck;
    }

    const like = await db.select(new RecordId(tableNames.like, id));

    return NextResponse.json(like, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch likes', details: (error as Error).message },
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
    const likeCheck = await checkExists(tableNames.like, id, `like with ID ${id} not found.`);
    if (likeCheck !== true) {
      return likeCheck;
    }

    // Delete the like
    await db.delete(new RecordId(tableNames.like, id));

    return NextResponse.json({ message: 'like deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete like.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
