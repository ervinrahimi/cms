import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { RecordId } from 'surrealdb'
import { CommentSchemaCreate } from '@/schemas/zod/blog'

/*
  Route: "api/blog/comments" [ POST - GET ]
 
 GET: API handler for fetching all comments from the "comments" table in SurrealDB.
 POST: API handler for creating a new comment in the "comments" table in SurrealDB.
 
 */

// GET /api/blog/comments
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

// POST /api/blog/comments
export async function POST(req: NextRequest) {
  try {
    const db = await sdb()
    const body = await req.json()
    const { post_ref, user_ref, content } = body

    if (!post_ref || !user_ref || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validatedBody = CommentSchemaCreate.parse({ content })

    // Convert post_ref and user_ref to RecordId objects
    const postId = new RecordId('posts', post_ref)
    const userId = new RecordId('users', user_ref)
    const commentData = {
      post_ref: postId,
      user_ref: userId,
      content: validatedBody.content,
      created_at: new Date(),
      updated_at: new Date()
    }

    const createdComment = await db.create('comments', commentData)

    return NextResponse.json(createdComment, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
