// File: /app/api/posts/route.ts

import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { RecordId } from 'surrealdb'

// Handle GET requests to fetch all posts
export async function GET() {
  try {
    const db = await sdb()
    const posts = await db.select('posts')

    return NextResponse.json(posts, {
      status: 200,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      {
        status: 500,
      }
    )
  }
}

// Handle POST requests to create a new post
export async function POST(req: Request) {
  try {
    const db = await sdb()
    const body = await req.json()

    const { title, content, slug, author, categories, tags } = body

    if (!title || !content || !slug || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        {
          status: 400,
        }
      )
    }

    // Convert author, categories, and tags to RecordId
    const authorId = new RecordId('users', author)
    const categoryIds = categories.map((cat: string) => new RecordId('categories', cat))
    const tagIds = tags.map((tag: string) => new RecordId('tags', tag))

    // Create a record for the post
    const postData = {
      title,
      content,
      slug,
      author: authorId,
      categories: categoryIds,
      tags: tagIds,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const createdPost = await db.create('posts', postData)

    return NextResponse.json(createdPost, {
      status: 201,
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json(
      { error: 'Failed to create post', details: err.message },
      {
        status: 500,
      }
    )
  }
}
