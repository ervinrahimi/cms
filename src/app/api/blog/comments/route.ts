// File: /app/api/blog/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { Comment } from '@/types/types'
import { RecordId } from 'surrealdb'

// GET /api/comments
export async function GET() {
  try {
    const db = await sdb()
    const result = await db.select('comments')
    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const db = await sdb()
    const body: Partial<Comment> = await req.json()
    const createdTag = await db.create('comments', {
      post_ref: body.post_ref ? new RecordId('posts', body.post_ref) : undefined,
      user_ref: body.user_ref ? new RecordId('users', body.user_ref) : undefined,
      content: body.content,
      created_at: new Date(),
    })

    return NextResponse.json(createdTag, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
