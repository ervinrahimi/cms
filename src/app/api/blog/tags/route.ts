// File: /app/api/blog/tags/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { Tag } from '@/models/types'

// GET /api/tags
export async function GET() {
  try {
    const db = await sdb()
    const result = await db.select('tags')

    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// POST /api/tags
export async function POST(req: NextRequest) {
  try {
    const db = await sdb()
    const body: Partial<Tag> = await req.json()
    if (!body.name) {
      return NextResponse.json({ message: 'The name field is required.' }, { status: 400 })
    }
    const createdTag = await db.create('tags', {
      name: body.name,
      slug: body.slug,
      created_at: new Date(),
    })

    return NextResponse.json(createdTag, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
