import { NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { RecordId } from "surrealdb";
import { checkExists } from "@/utils/api/checkExists";
import tableNames from "@/utils/api/tableNames";

/*
  Route: "api/blog/bookmarks/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific bookmark from the "bookmarks" table in SurrealDB.
  PUT: API handler for updating a specific bookmark in the "bookmarks" table in SurrealDB.
  DELETE: API handler for deleting a specific bookmark from the "bookmarks" table in SurrealDB.
 */

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const bookmarkCheck = await checkExists(
      tableNames.bookmark,
      id,
      `bookmark with ID ${id} not found.`
    );
    if (bookmarkCheck !== true) {
      return bookmarkCheck;
    }

    const bookmark = await db.select(new RecordId(tableNames.bookmark, id));

    return NextResponse.json(bookmark, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks", details: (error as Error).message },
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

    const bookmarkCheck = await checkExists(
      tableNames.bookmark,
      id,
      `bookmark with ID ${id} not found.`
    );
    if (bookmarkCheck !== true) {
      return bookmarkCheck;
    }

    // Delete the bookmark
    await db.delete(new RecordId(tableNames.bookmark, id));

    return NextResponse.json(
      { message: "bookmarks deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete bookmark.",
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
