import { NextResponse } from "next/server";
import { RecordId } from "surrealdb";
import sdb from "@/db/surrealdb"; // Import SurrealDB connection

/*
  Route: "api/blog/bookmarks" [ POST - GET ]
 
 GET: API handler for fetching all bookmarks from the "bookmarks" table in SurrealDB.
 POST: API handler for creating a new post in the "bookmarks" table in SurrealDB.
 
 */

// GET /api/blog/bookmarks
export async function GET() {
  try {
    const db = await sdb();
    const bookmarks = await db.select("bookmarks");

    return NextResponse.json(bookmarks, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      {
        status: 500,
      }
    );
  }
}
// POST /api/blog/bookmarks
export async function POST(req: Request) {
  try {
    const db = await sdb();
    const body = await req.json();

    const { user_ref, post_ref } =
      body;

      if (!user_ref || !post_ref) {
        return NextResponse.json(
          { error: "Missing required fields" },
          {
            status: 400,
          }
        );
      }

    // Convert userref, postref and comments to RecordId objects
    const userref = new RecordId("users", user_ref);
    const postref = new RecordId("posts", post_ref);

    const bookmarksData = {
      user_ref: userref,
      post_ref: postref,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdBookmarks = await db.create("bookmarks", bookmarksData);

    return NextResponse.json(createdBookmarks, {
      status: 201,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create bookmarks", details: err.message },
      {
        status: 500,
      }
    );
  }
}
