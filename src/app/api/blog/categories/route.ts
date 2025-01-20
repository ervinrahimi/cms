import { NextRequest, NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { Category } from "@/types/types";
import { CategorySchemaCreate } from "@/schemas/zod/blog";

/*
  Route: "api/categories" [ POST - GET ]
 
 GET: API handler for fetching all categories from the "categories" table in SurrealDB.
 POST: API handler for creating a new category in the "categories" table in SurrealDB.
 
 */

// GET /api/categories
export async function GET() {
  try {
    const db = await sdb();
    const result = await db.select("categories");

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body: Partial<Category> = await req.json();

    const validatedBody = CategorySchemaCreate.parse({
      title: body.title,
      description: body.description,
      slug: body.slug,
    });

    const createdTag = await db.create("categories", {
      title: validatedBody.title,
      description: validatedBody.description,
      slug: validatedBody.slug,
      created_at: new Date(),
      update_at: new Date(),
    });

    return NextResponse.json(createdTag, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}
