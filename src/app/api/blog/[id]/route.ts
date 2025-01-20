import { NextResponse } from "next/server";
import { Patch, RecordId } from "surrealdb";

import sdb from "@/db/surrealdb"; // Import SurrealDB connection
import { PostSchema } from "@/schemas/zod/blog";

/*
  Route: "api/blog/[id]" [ PUT - GET - DELETE ]
 
 GET: API handler for fetching a specific post from the "posts" table in SurrealDB.
 PUT: API handler for updating a specific post in the "posts" table in SurrealDB.
 DELETE: API handler for deleting a specific post from the "posts" table in SurrealDB.
 */

// GET /api/blog/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;
    CheckPostExists(id);

    const post = await db.select(new RecordId("posts", id));

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch post", details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

// PUT /api/blog/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const body = await req.json();
    const { id } = await params;
    // Check if the ID is valid

    CheckPostExists(id);

    const { title, content, slug, author, categories, tags, likes, comments } =
      body;
    // Convert author, categories, tags, likes, and comments to RecordId objects
    const authorId = new RecordId("users", author);
    const categoryIds = categories.map(
      (cat: string) => new RecordId("categories", cat)
    );
    const tagIds = tags.map((tag: string) => new RecordId("tags", tag));
    const likeIds = likes.map((lik: string) => new RecordId("likes", lik));
    const commentIds = comments.map(
      (com: string) => new RecordId("comments", com)
    );

    // Validate the request body
    const validatedBody = PostSchema.parse({ title, content, slug });
    // Update the post
    console.log("Updating post with ID:", id);
    const fieldsToUpdate = {
      title: validatedBody.title,
      content: validatedBody.content,
      slug: validatedBody.slug,
      updated_at: new Date(),
      author: author && authorId,
      categories: categories && categoryIds,
      tags: tags && tagIds,
      likes: likes && likeIds,
      comments: comments && commentIds,
    };

    const operations: Patch[] = Object.entries(fieldsToUpdate)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({ op: "replace", path: `/${key}`, value }));

    const updated = await db.patch(new RecordId("posts", id), operations);

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to update post", details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

// DELETE /api/blog/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    CheckPostExists(id);

    // Delete the post
    await db.delete(new RecordId("posts", id));

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete post.",
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}

// Helper function to check if a post exists
async function CheckPostExists(id: string) {
  const db = await sdb();
  const postExists = await db.select(new RecordId("posts", id));
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
}
