// File: /app/api/blog/tags/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { Tag } from '@/models/types'
import { RecordId } from 'surrealdb'

// GET /api/tags/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    const result = await db.query<Tag[]>(`SELECT * FROM tags WHERE id = tags:${id}`)
    if (!result || result.length == 0) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 })
    }
    return NextResponse.json(result[0], { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// PUT /api/tags/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await context.params
    const body: Partial<Tag> = await req.json()

    const [exists] = await db.query<Tag[]>(`SELECT * FROM tags WHERE id = "tags:${id}"`)
    if (!exists) {
      return NextResponse.json({ message: 'Tag not found for update' }, { status: 404 })
    }
    const updated = await db.patch(new RecordId('tags', id), [
      { op: 'replace', path: '/name', value: body.name },
      { op: 'replace', path: '/slug', value: body.slug },
      { op: 'replace', path: '/updatedAt', value: new Date().toISOString() },
    ])
    if (!updated) {
      return NextResponse.json({ message: 'An issue occurred while updating the record' }, { status: 400 })
    }
    return NextResponse.json(updated, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// DELETE /api/tags/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    const deleted = await db.delete(new RecordId('tags', id))

    if (!deleted) {
      return NextResponse.json({ message: 'An issue occurred while deleting the record' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Record successfully deleted' }, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
