import { NextRequest, NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { CategorySchemaCreate } from "@/schemas/zod/blog";
import { ZodError } from "zod";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import tableNames from "@/utils/api/tableNames";

/*

  Route: "api/blog/categories" [ POST - GET ]
 
  GET: API handler for fetching all categories from the "categories" table in SurrealDB.
  POST: API handler for creating a new category in the "categories" table in SurrealDB.
 
 */

export async function GET() {
  try {
    const db = await sdb();
    const result = await db.select(tableNames.category);
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

export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = CategorySchemaCreate.parse(body);
    const { title, description, slug } = validatedBody;

    const categoriesData = {
      title: title,
      description: description,
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCategory = await db.create(
      tableNames.category,
      categoriesData
    );

    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create category", details: err.message },
      {
        status: 500,
      }
    );
  }
}
