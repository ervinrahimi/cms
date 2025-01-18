// File: /app/api/blog/likes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { Like } from '@/models/types'
import { RecordId } from 'surrealdb'

// GET /api/likes
export async function GET() {
  try {
    const db = await sdb()
    const result = await db.select('likes')

    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// POST /api/likes
export async function POST(req: NextRequest) {
  try {
    const db = await sdb()
    const body: Partial<Like> = await req.json()
    const createdTag = await db.create('likes', {
      post_ref: body.post_ref ? new RecordId('posts', body.post_ref) : undefined,
      user_ref: body.user_ref ? new RecordId('users', body.user_ref) : undefined,
      created_at: new Date(),
    })

    return NextResponse.json(createdTag, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
