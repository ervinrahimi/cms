import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { Patch, RecordId } from 'surrealdb'
import { CategorySchemaUpdate } from '@/schemas/zod/blog'
/*
  Route: "api/blog/categories/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific category from the "categories" table in SurrealDB.
 PUT: API handler for updating a specific category in the "categories" table in SurrealDB.
 DELETE: API handler for deleting a specific category from the "categories" table in SurrealDB.
 */

// GET /api/blog/categories/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    CheckPostExists(id)

    const category = await db.select(new RecordId('categories', id))

    return NextResponse.json(category, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch category', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}

// PUT /api/blog/categories/[id]
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

    const { title, description, slug } = body
    const validatedBody = CategorySchemaUpdate.parse({ title, description, slug })
    const updates: Patch[] = []
    if (title)
      updates.push({
        op: 'replace',
        path: '/title',
        value: validatedBody.title,
      })
    if (description)
      updates.push({
        op: 'replace',
        path: '/description',
        value: validatedBody.description,
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

    const recordId = new RecordId('categories', id)

    // Apply the patch
    const updatedCategory = await db.patch(recordId, updates)

    return NextResponse.json(updatedCategory, {
      status: 200,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update category', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}
// DELETE /api/blog/categories/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params

    CheckPostExists(id)

    // Delete the category
    await db.delete(new RecordId('categories', id))

    return NextResponse.json({ message: 'categories deleted successfully.' }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete category.',
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
  const postExists = await db.select(new RecordId('categories', id))
  if (!postExists || postExists.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'not_found',
          message: `categories with ID comment:${id} does not exist.`,
        },
      },
      { status: 404 }
    )
  }
}
