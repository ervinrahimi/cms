import { NextRequest, NextResponse } from "next/server";
import sdb from "@/db/surrealdb";
import { Like } from "@/types/types";
import { RecordId } from "surrealdb";

/*
  Route: "api/likes/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific like from the "likes" table in SurrealDB.
 PUT: API handler for updating a specific like in the "likes" table in SurrealDB.
 DELETE: API handler for deleting a specific like from the "likes" table in SurrealDB.
 */

// GET /api/likes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;
    const result = await db.query<Like[]>(
      `SELECT * FROM likes WHERE id = likes:${id}`
    );
    if (!result || result.length == 0) {
      return NextResponse.json(
        { message: "The requested tag was not found" },
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

// PUT /api/likes/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await context.params;
    const body: Partial<Like> = await req.json();

    const [exists] = await db.query<Like[]>(
      `SELECT * FROM likes WHERE id = "likes:${id}"`
    );
    if (!exists) {
      return NextResponse.json(
        { message: "The requested tag was not found for update" },
        { status: 404 }
      );
    }

    const updated = await db.patch(new RecordId("likes", id), [
      {
        op: "replace",
        path: "/post_ref",
        value: body.post_ref ? new RecordId("posts", body.post_ref) : undefined,
      },
      {
        op: "replace",
        path: "/user_ref",
        value: body.user_ref ? new RecordId("users", body.user_ref) : undefined,
      },
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

// DELETE /api/likes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;
    const deleted = await db.delete(new RecordId("likes", id));

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
