import { NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { Patch, RecordId } from "surrealdb";
import { CategorySchemaUpdate } from "@/schemas/zod/blog";
import { checkExists } from "@/utils/api/checkExists";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { ZodError } from "zod";
import prepareUpdates from "@/utils/api/generateUpdates";
import tableNames from "@/utils/api/tableNames";

/*

  Route: "api/blog/categories/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific category from the "categories" table in SurrealDB.
  PUT: API handler for updating a specific category in the "categories" table in SurrealDB.
  DELETE: API handler for deleting a specific category from the "categories" table in SurrealDB.

 */

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const categoryCheck = await checkExists(
      tableNames.category,
      id,
      `category with ID ${id} not found.`
    );
    if (categoryCheck !== true) {
      return categoryCheck;
    }

    const category = await db.select(new RecordId(tableNames.category, id));

    return NextResponse.json(category, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch category", details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const body = await req.json();
    const { id } = await params;

    const categoryCheck = await checkExists(
      tableNames.category,
      id,
      `category with ID ${id} not found.`
    );
    if (categoryCheck !== true) {
      return categoryCheck;
    }

    const validatedBody = CategorySchemaUpdate.parse(body);
    const { title, description, slug } = validatedBody;

    const updates: Patch[] = [];
    const fields = [
      { path: "/title", value: title },
      { path: "/description", value: description },
      { path: "/slug", value: slug },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(tableNames.category, id);

    // Apply the patch
    const updatedCategory = await db.patch(recordId, updates);

    return NextResponse.json(updatedCategory, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to update category", details: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const categoryCheck = await checkExists(
      tableNames.category,
      id,
      `category with ID ${id} not found.`
    );
    if (categoryCheck !== true) {
      return categoryCheck;
    }

    // Delete the category
    await db.delete(new RecordId(tableNames.category, id));

    return NextResponse.json(
      { message: "categories deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete category.",
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
