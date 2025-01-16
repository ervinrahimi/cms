//app/api/blog/[id]/route.js
import { NextResponse } from "next/server";
import sdb from "@/db/surealdb";
import { RecordId } from "surrealdb";
import { PostUpdateSchema } from "@/schemas/zod/postSchemas";

/**
 * Handler to update a specific post (PUT).
 * Endpoint: PUT /api/blog/[id]
 */
export async function PUT(request, context) {
  try {
    // Connect to SurrealDB
    const db = await sdb();

    // Extract id from the dynamic route parameter
    const { id } = context.params;
    if (!id) {
      return NextResponse.json(
        {
          error: { code: "validation_error", message: "Post ID is required." },
        },
        { status: 400 }
      );
    }

    // Parse JSON body
    const body = await request.json();

    // Validate input with Zod (Partial update)
    const parsedData = PostUpdateSchema.parse(body);

    // Check if the post exists before updating
    const postExists = await db.select(new RecordId("post", id));
    if (!postExists || postExists.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "not_found",
            message: `Post with ID post:${id} does not exist.`,
          },
        },
        { status: 404 }
      );
    }

    // If 'author' is provided, validate the author record
    if (parsedData.author) {
      const authorId = parsedData.author.replace("user:", "");
      const authorExists = await db.select(new RecordId("user", authorId));

      if (!authorExists || authorExists.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: "author_not_found",
              message: `Author with ID user:${authorId} does not exist.`,
            },
          },
          { status: 404 }
        );
      }

      // We'll store the real relationship field in `authorId`
      parsedData.authorId = new RecordId("user", authorId);
      delete parsedData.author;
    }

    // Build patch data for SurrealDB
    const patchData = [
      { op: "replace", path: "/updatedAt", value: new Date() },
    ];

    for (const [key, value] of Object.entries(parsedData)) {
      patchData.push({ op: "replace", path: `/${key}`, value });
    }

    // Apply patch to the post record
    const updatedPost = await db.patch(new RecordId("post", id), patchData);

    return NextResponse.json(
      { message: "Post updated successfully.", data: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    // If it's a Zod error, it will have 'issues'
    if (error.issues) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Failed Zod validation.",
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    // Handle other errors

    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to update post.",
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Handler to delete a specific post (DELETE).
 * Endpoint: DELETE /api/blog/[id]
 */
export async function DELETE(request, context) {
  try {
    const db = await sdb();
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: { code: "validation_error", message: "Post ID is required." },
        },
        { status: 400 }
      );
    }

    // Check if the post exists before deleting
    const postExists = await db.select(new RecordId("post", id));
    if (!postExists || postExists.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "not_found",
            message: `Post with ID post:${id} does not exist.`,
          },
        },
        { status: 404 }
      );
    }

    // Delete the post
    await db.delete(new RecordId("post", id));

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete post.",
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
