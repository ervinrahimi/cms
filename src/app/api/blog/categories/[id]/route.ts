import { NextRequest, NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { Category } from "@/types/types";
import { RecordId } from "surrealdb";
import { CategorySchema } from "@/schemas/zod/blog";
/*
  Route: "api/categories/[id]" [ GET - PUT - DELETE ]
 
 GET: API handler for fetching a specific category from the "categories" table in SurrealDB.
 PUT: API handler for updating a specific category in the "categories" table in SurrealDB.
 DELETE: API handler for deleting a specific category from the "categories" table in SurrealDB.

 */

// GET /api/categories/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;
    const result = await db.query<Category[]>(
      `SELECT * FROM categories WHERE id = categories:${id}`
    );
    if (!result || result.length == 0) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result[0], { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await context.params;
    const body: Partial<Category> = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { message: "The title field is required." },
        { status: 400 }
      );
    }

    const [exists] = await db.query<Category[]>(
      `SELECT * FROM categories WHERE id = "categories:${id}"`
    );
    if (!exists) {
      return NextResponse.json(
        { message: "The category to update was not found" },
        { status: 404 }
      );
    }
    const validatedBody = CategorySchema.parse({
      title: body.title,
      description: body.description,
      slug: body.slug,
    });
    const updated = await db.patch(new RecordId("categories", id), [
      { op: "replace", path: "/title", value: validatedBody.title },
      { op: "replace", path: "/description", value: validatedBody.description },
      { op: "replace", path: "/slug", value: validatedBody.slug },
      { op: "replace", path: "/updatedAt", value: new Date().toISOString() },
    ]);

    if (!updated) {
      return NextResponse.json(
        { message: "An issue occurred while updating the record" },
        { status: 400 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const deleted = await db.delete(new RecordId("categories", id));

    if (!deleted) {
      return NextResponse.json(
        { message: "An issue occurred while deleting the record" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Record successfully deleted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}
