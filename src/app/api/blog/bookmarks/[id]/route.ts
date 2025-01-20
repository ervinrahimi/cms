import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { RecordId } from 'surrealdb'
/*
  Route: "api/blog/bookmarks/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific bookmark from the "bookmarks" table in SurrealDB.
 PUT: API handler for updating a specific bookmark in the "bookmarks" table in SurrealDB.
 DELETE: API handler for deleting a specific bookmark from the "bookmarks" table in SurrealDB.
 */

// GET /api/blog/bookmarks/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    CheckPostExists(id)

    const bookmark = await db.select(new RecordId('bookmarks', id))

    return NextResponse.json(bookmark, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}

// DELETE /api/blog/bookmarks/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params

    CheckPostExists(id)

    // Delete the bookmark
    await db.delete(new RecordId('bookmarks', id))

    return NextResponse.json({ message: 'bookmarks deleted successfully.' }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete bookmark.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    )
  }
}

// Helper function to check if a bookmark exists
async function CheckPostExists(id: string) {
  const db = await sdb()
  const postExists = await db.select(new RecordId('bookmarks', id))
  if (!postExists || postExists.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: `bookmarks with ID bookmark:${id} does not exist.`,
        },
      },
      { status: 404 }
    )
  }
}
