import { NextResponse } from 'next/server'
import sdb from '@/db/surrealdb' // Import SurrealDB connection
import { RecordId, Patch } from 'surrealdb'

// Handle PUT requests to update a specific blog post
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const body = await req.json()
    const { id } = await params

    const { title, content, slug, author, categories, tags } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing post ID' },
        {
          status: 400,
        }
      )
    }

    // Convert author, categories, and tags to RecordId if provided
    const updates: Patch[] = []

    if (title)
      updates.push({
        op: 'replace',
        path: '/title',
        value: title,
      })
    if (content)
      updates.push({
        op: 'replace',
        path: '/content',
        value: content,
      })
    if (slug)
      updates.push({
        op: 'replace',
        path: '/slug',
        value: slug,
      })
    if (author)
      updates.push({
        op: 'replace',
        path: '/author',
        value: new RecordId('users', author),
      })
    if (categories)
      updates.push({
        op: 'replace',
        path: '/categories',
        value: categories.map((cat: string) => new RecordId('categories', cat)),
      })
    if (tags)
      updates.push({
        op: 'replace',
        path: '/tags',
        value: tags.map((tag: string) => new RecordId('tags', tag)),
      })

    updates.push({
      op: 'replace',
      path: '/updated_at',
      value: new Date(),
    })

    const recordId = new RecordId('posts', id)

    // Apply the patch
    const updatedPost = await db.patch(recordId, updates)

    return NextResponse.json(updatedPost, {
      status: 200,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to update post', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params

    const postExists = await db.select(new RecordId('posts', id))
    if (!postExists || postExists.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'not_found',
            message: `Post with ID post:${id} does not exist.`,
          },
        },
        { status: 404 }
      )
    }

    // Delete the post
    await db.delete(new RecordId('posts', id))

    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete post.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    )
  }
}

// get the spacial post

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb()
    const { id } = await params
    const post = await db.select(new RecordId('posts', id))

    return NextResponse.json(post, {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post', details: (error as Error).message },
      {
        status: 500,
      }
    )
  }
}
