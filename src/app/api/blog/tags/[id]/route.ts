import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { Patch, RecordId } from 'surrealdb'
import { TagSchemaUpdate } from '@/schemas/zod/blog'
/*
  Route: "api/blog/tags/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific tag from the "tags" table in SurrealDB.
 PUT: API handler for updating a specific tag in the "tags" table in SurrealDB.
 DELETE: API handler for deleting a specific tag from the "tags" table in SurrealDB.
 */

// GET /api/blog/tag/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    CheckPostExists(id)

    const tag = await db.select(new RecordId('tags', id))

    return NextResponse.json(tag, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch tag', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}

// PUT /api/blog/tag/[id]
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

    const { name, slug } = body
    const validatedBody = TagSchemaUpdate.parse({ name, slug })
    const updates: Patch[] = []
    if (name)
      updates.push({
        op: 'replace',
        path: '/name',
        value: validatedBody.name,
      })
    if (slug)
      updates.push({
        op: 'replace',
        path: '/slug',
        value: validatedBody.slug,
      })
    updates.push({
      op: 'replace',
      path: '/updated_at',
      value: new Date(),
    })

    const recordId = new RecordId('tags', id)

    // Apply the patch
    const updatedTag = await db.patch(recordId, updates)

    return NextResponse.json(updatedTag, {
      status: 200,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update tag', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}
// DELETE /api/blog/tags/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params

    CheckPostExists(id)

    // Delete the tag
    await db.delete(new RecordId('tags', id))

    return NextResponse.json({ message: 'tags deleted successfully.' }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete tags.',
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
  const postExists = await db.select(new RecordId('tags', id))
  if (!postExists || postExists.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: `tags with ID tag:${id} does not exist.`,
        },
      },
      { status: 404 }
    )
  }
}
