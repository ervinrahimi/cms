import sdb from "@/db/surrealdb";
import { CommentSchemaCreate } from "@/schemas/zod/blog";
import tableNames from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextRequest, NextResponse } from "next/server";
import { RecordId } from "surrealdb";
import { ZodError } from "zod";

/*
  Route: "api/blog/comments" [ POST - GET ]
 
 GET: API handler for fetching all comments from the "comments" table in SurrealDB.
 POST: API handler for creating a new comment in the "comments" table in SurrealDB.
 */

// GET /api/blog/comments
export async function GET() {
  try {
    const db = await sdb();
    const result = await db.select(tableNames.comment);
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

// POST /api/blog/comments
export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = CommentSchemaCreate.parse(body);
    const { post_ref, user_ref, content } = validatedBody;
    // Convert post_ref and user_ref to RecordId objects
    const postId = new RecordId(tableNames.post, post_ref);
    const userId = new RecordId(tableNames.user, user_ref);
    const commentData = {
      post_ref: postId,
      user_ref: userId,
      content: content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdComment = await db.create(tableNames.comment, commentData);

    return NextResponse.json(createdComment, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create comment", details: err.message },
      {
        status: 500,
      }
    );
  }
}
