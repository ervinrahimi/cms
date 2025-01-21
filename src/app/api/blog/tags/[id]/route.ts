import sdb from "@/db/surrealdb";
import { TagSchemaUpdate } from "@/schemas/zod/blog";
import { checkExists } from "@/utils/api/checkExists";
import prepareUpdates from "@/utils/api/generateUpdates";
import tableNames from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextResponse } from "next/server";
import { Patch, RecordId } from "surrealdb";
import { ZodError } from "zod";

/*
  Route: "api/blog/tags/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific tag from the "tags" table in SurrealDB.
  PUT: API handler for updating a specific tag in the "tags" table in SurrealDB.
  DELETE: API handler for deleting a specific tag from the "tags" table in SurrealDB.
 */

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const tagCheck = await checkExists(
      tableNames.tag,
      id,
      `tag with ID ${id} not found.`
    );
    if (tagCheck !== true) {
      return tagCheck;
    }

    const tag = await db.select(new RecordId(tableNames.tag, id));

    return NextResponse.json(tag, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch tag", details: (error as Error).message },
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

    // Check if the ID is valid
    const tagCheck = await checkExists(
      tableNames.tag,
      id,
      `tag with ID ${id} not found.`
    );
    if (tagCheck !== true) {
      return tagCheck;
    }

    const validatedBody = TagSchemaUpdate.parse(body);
    const { name, slug } = validatedBody;

    const updates: Patch[] = [];
    const fields = [
      { path: "/name", value: name },
      { path: "/slug", value: slug },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(tableNames.tag, id);

    // Apply the patch
    const updatedTag = await db.patch(recordId, updates);

    return NextResponse.json(updatedTag, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to update tag", details: err.message },
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

    // Check if the ID is valid
    const tagCheck = await checkExists(
      tableNames.tag,
      id,
      `tag with ID ${id} not found.`
    );
    if (tagCheck !== true) {
      return tagCheck;
    }

    // Delete the tag
    await db.delete(new RecordId(tableNames.tag, id));

    return NextResponse.json(
      { message: "tags deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete tags.",
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
