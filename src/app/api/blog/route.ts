import { NextResponse } from "next/server";

import sdb from "@/db/surrealdb"; // Import SurrealDB connection
import { RecordId } from "surrealdb";
import { PostSchema } from "@/schemas/zod/blog";

/*
  Route: "api/blog" [ POST - GET ]
 
 GET: API handler for fetching all posts from the "posts" table in SurrealDB.
 POST: API handler for creating a new post in the "posts" table in SurrealDB.
 
 */

// GET /api/blog
export async function GET() {
  try {
    const db = await sdb();
    const posts = await db.select("posts");

    return NextResponse.json(posts, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      {
        status: 500,
      }
    );
  }
}
// POST /api/blog
export async function POST(req: Request) {
  try {
    const db = await sdb();
    const body = await req.json();

    const { title, content, slug, author, categories, tags, likes, comments } =
      body;

    if (!title || !content || !slug || !author) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
        }
      );
    }

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
    // Create a record for the post
    const postData = {
      title: validatedBody.title,
      content: validatedBody.content,
      slug: validatedBody.slug,
      author: authorId,
      categories: categoryIds,
      tags: tagIds,
      likes: likeIds,
      comments: commentIds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdPost = await db.create("posts", postData);

    return NextResponse.json(createdPost, {
      status: 201,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create post", details: err.message },
      {
        status: 500,
      }
    );
  }
}
