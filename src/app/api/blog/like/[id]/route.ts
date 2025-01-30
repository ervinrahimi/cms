import sdb from '@/db/surrealdb';
import { checkExists } from '@/utils/api/checkExists';
import { blogTabels } from '@/utils/api/tableNames';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';

/*

  Route: "api/blog/like/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific like from the "BlogLike" table in SurrealDB.
  DELETE: API handler for deleting a specific like from the "BlogLike" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const likeCheck = await checkExists(blogTabels.like, id, `like with ID ${id} not found.`);
    if (likeCheck !== true) {
      return likeCheck;
    }

    const like = await db.select(new RecordId(blogTabels.like, id));

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
    const { id } = params;

    const likeCheck = await checkExists(blogTabels.like, id, `Like with ID ${id} not found.`);
    if (likeCheck !== true) {
      return likeCheck;
    }

    const like = await db.select(new RecordId(blogTabels.like, id));

    const post_id = like.post_ref as RecordId;

    await db.delete(new RecordId(blogTabels.like, id));

    await db.query(`UPDATE ${blogTabels.post} SET likes -= $like_id WHERE id = $post_id`, {
      like_id: new RecordId(blogTabels.like, id),
      post_id: post_id,
    });

    return NextResponse.json({ message: 'Like deleted successfully.' }, { status: 200 });
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
