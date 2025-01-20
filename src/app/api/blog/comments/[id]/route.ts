import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { Patch, RecordId } from 'surrealdb'
import { CommentSchemaUpdate } from '@/schemas/zod/blog'
/*
  Route: "api/blog/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific comment from the "comments" table in SurrealDB.
 PUT: API handler for updating a specific comment in the "comments" table in SurrealDB.
 DELETE: API handler for deleting a specific comment from the "comments" table in SurrealDB.
 */

// GET /api/blog/comments/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    CheckPostExists(id)

    const comment = await db.select(new RecordId('comments', id))

    return NextResponse.json(comment, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch comment', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}

// PUT /api/blog/comments/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const body = await req.json()
    const { id } = await params
    // Check if the ID is valid
    if (!id || typeof id !== 'string') {
      console.error('Invalid ID:', id)
      throw new Error('Invalid ID')
    }
    CheckPostExists(id)

    const { post_ref, content, user_ref } = body
    const validatedBody = CommentSchemaUpdate.parse({ content })
    const updates: Patch[] = []
    if (content)
      updates.push({
        op: 'replace',
        path: '/content',
        value: validatedBody.content,
      })
    if (post_ref)
      updates.push({
        op: 'replace',
        path: '/post_ref',
        value: new RecordId('posts', post_ref),
      })
    if (user_ref)
      updates.push({
        op: 'replace',
        path: '/user_ref',
        value: new RecordId('users', user_ref),
      })
    updates.push({
      op: 'replace',
      path: '/updated_at',
      value: new Date(),
    })

    const recordId = new RecordId('comments', id)

    // Apply the patch
    const updatedComment = await db.patch(recordId, updates)

    return NextResponse.json(updatedComment, {
      status: 200,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update comment', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}
// DELETE /api/blog/comments/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params

    CheckPostExists(id)

    // Delete the comment
    await db.delete(new RecordId('comments', id))

    return NextResponse.json({ message: 'Comments deleted successfully.' }, { status: 200 })
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
    )
  }
}

// Helper function to check if a post exists
async function CheckPostExists(id: string) {
  const db = await sdb()
  const postExists = await db.select(new RecordId('comments', id))
  if (!postExists || postExists.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: `Comments with ID comment:${id} does not exist.`,
        },
      },
      { status: 404 }
    )
  }
}
