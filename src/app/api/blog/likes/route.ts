import sdb from "@/db/surrealdb";
import { likesSchemaCreate } from "@/schemas/zod/blog";
import tableNames from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextResponse } from "next/server";
import { RecordId } from "surrealdb";
import { ZodError } from "zod";

/*
  Route: "api/blog/likes" [ POST - GET ]
 
  GET: API handler for fetching all likes from the "likes" table in SurrealDB.
  POST: API handler for creating a new like in the "likes" table in SurrealDB.
 */

export async function GET() {
  try {
    const db = await sdb();
    const likes = await db.select(tableNames.like);

    return NextResponse.json(likes, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = likesSchemaCreate.parse(body);
    const { user_ref, post_ref } = validatedBody;

    // Convert user_ref, post_ref to RecordId objects
    const userId = new RecordId(tableNames.user, user_ref);
    const postId = new RecordId(tableNames.post, post_ref);

    const likeData = {
      user_ref: userId,
      post_ref: postId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLike = await db.create(tableNames.like, likeData);

    return NextResponse.json(createdLike, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create like", details: err.message },
      {
        status: 500,
      }
    );
  }
}
