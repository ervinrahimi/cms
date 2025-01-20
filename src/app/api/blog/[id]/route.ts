import { NextResponse } from "next/server";
import sdb from "@/db/surrealdb"; // Import SurrealDB connection
import { Patch, RecordId } from "surrealdb";
import { PostSchemaUpdate } from "@/schemas/zod/blog";
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
    if (!id || typeof id !== "string") {
      console.error("Invalid ID:", id);
      throw new Error("Invalid ID");
    }
    CheckPostExists(id);

    const { title, content, slug, author, categories, tags, likes, comments } =
      body;
    const validatedBody = PostSchemaUpdate.parse({ title, content, slug });
    const updates: Patch[] = [];

    if (title)
      updates.push({
        op: "replace",
        path: "/title",
        value: validatedBody.title,
      });
    if (content)
      updates.push({
        op: "replace",
        path: "/content",
        value: validatedBody.content,
      });
    if (slug)
      updates.push({
        op: "replace",
        path: "/slug",
        value: validatedBody.slug,
      });
    if (author)
      updates.push({
        op: "replace",
        path: "/author",
        value: new RecordId("users", author),
      });
    if (categories)
      updates.push({
        op: "replace",
        path: "/categories",
        value: categories.map((cat: string) => new RecordId("categories", cat)),
      });
    if (tags)
      updates.push({
        op: "replace",
        path: "/tags",
        value: tags.map((tag: string) => new RecordId("tags", tag)),
      });

    if (likes)
      updates.push({
        op: "replace",
        path: "/likes",
        value: likes.map((like: string) => new RecordId("likes", like)),
      });

    if (comments)
      updates.push({
        op: "replace",
        path: "/tags",
        value: comments.map((com: string) => new RecordId("comments", com)),
      });

    updates.push({
      op: "replace",
      path: "/updated_at",
      value: new Date(),
    });

    const recordId = new RecordId("posts", id);

    // Apply the patch
    const updatedPost = await db.patch(recordId, updates);

    return NextResponse.json(updatedPost, {
      status: 200,
    });
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
