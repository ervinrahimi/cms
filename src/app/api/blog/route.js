//app/api/blog/route.js
import { NextResponse } from "next/server";
import sdb from "@/db/surealdb";
import { RecordId } from "surrealdb";
import { PostCreateSchema } from "@/schemas/zod/postSchemas";

/**
 * Handler to create a new post (POST).
 * Endpoint: POST /api/blog
 */
export async function POST(request) {
  try {
    // Connect to SurrealDB
    const db = await sdb();

    // Parse JSON body
    const body = await request.json();

    // Validate input using Zod schema
    const parsedData = PostCreateSchema.parse(body);

    // Extract fields after validation
    const { title, slug, content, author } = parsedData;

    // Extract author ID from "user:xyz"
    const authorId = author.replace("user:", "");
    if (!authorId) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Author ID is invalid or missing.",
          },
        },
        { status: 400 }
      );
    }

    // Check if the author exists
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

    // Prepare data for the new post
    const postData = {
      title,
      slug,
      content,
      authorId: new RecordId("user", authorId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new post into the database
    const [createdPost] = await db.insert("post", postData);

    // Return success response
    return NextResponse.json(
      { message: "Post created successfully.", data: createdPost },
      { status: 201 }
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
          code: "create_post_error",
          message: "Failed to create post.",
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Handler to get all posts or a specific post by ID (GET).
 * Endpoint: GET /api/blog (for all posts)
 *           GET /api/blog?id=xyz (for a single post)
 */
export async function GET(request) {
  try {
    const db = await sdb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let result;
    if (id) {
      result = await db.select(`post:${id}`);
      if (!result || result.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: "not_found",
              message: "Post not found.",
            },
          },
          { status: 404 }
        );
      }
    } else {
      result = await db.select("post");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to fetch posts.",
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
