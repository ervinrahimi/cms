import { NextRequest, NextResponse } from 'next/server'
import sdb from '@/db/surrealdb'
import { CategorySchemaCreate } from '@/schemas/zod/blog'

/*
  Route: "api/blog/categories" [ POST - GET ]
 
 GET: API handler for fetching all categories from the "categories" table in SurrealDB.
 POST: API handler for creating a new category in the "categories" table in SurrealDB.
 
 */

// GET /api/blog/categories
export async function GET() {
  try {
    const db = await sdb()
    const result = await db.select('categories')
    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}

// POST /api/blog/categories
export async function POST(req: NextRequest) {
  try {
    const db = await sdb()
    const body = await req.json()
    const { title, description, slug } = body

    if (!title || !description || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validatedBody = CategorySchemaCreate.parse({ title, description, slug })

    const categoriesData = {
      title: validatedBody.title,
      description: validatedBody.description,
      slug: validatedBody.slug,
      created_at: new Date(),
      updated_at: new Date()
    }

    const createdCategory = await db.create('categories', categoriesData)

    return NextResponse.json(createdCategory, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'An error occurred', error: errorMessage }, { status: 500 })
  }
}
