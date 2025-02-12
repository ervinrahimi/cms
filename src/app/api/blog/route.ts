import sdb from "@/db/surrealdb";
import { PostSchemaCreate } from "@/schemas/zod/blog";
import buildQuery from "@/utils/api/blog/queryBuilder";
import { checkExists } from "@/utils/api/checkExists";
import { blogTabels } from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextResponse } from "next/server";
import { RecordId } from "surrealdb";
import { ZodError } from "zod";

/*
  Route: "api/blog" [ POST - GET ]
 
  GET: API handler for fetching all posts from the "BlogPost" table in SurrealDB.
  POST: API handler for creating a new post in the "BlogPost" table in SurrealDB.
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(
      searchParams,
      blogTabels.post,
      ["created_at", "slug"],
      "title"
    );
    const posts = await db.query(query);

    return NextResponse.json(posts, {
      status: 200,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: (error as Error).message },
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
    const validatedBody = PostSchemaCreate.parse(body);
    const { title, content, slug, author, categories, tags, likes, comments } =
      validatedBody;

    // Convert author, categories, tags, likes, and comments to RecordId objects
    const authorCheck = await checkExists(
      blogTabels.user,
      author,
      `Author with ID ${author} not found.`
    );
    if (authorCheck !== true) {
      return authorCheck;
    }
  

    const categoryIds = [];
    for (const cat of categories) {
      const categoryCheck = await checkExists(
        blogTabels.category,
        cat,
        `Category with ID ${cat} not found.`
      );
      if (categoryCheck !== true) {
        return categoryCheck;
      }
      categoryIds.push(new RecordId(blogTabels.category, cat));
    }

    const tagIds = [];
    if (tags) {
      for (const tag of tags) {
        const tagCheck = await checkExists(
          blogTabels.tag,
          tag,
          `Tag with ID ${tag} not found.`
        );
        if (tagCheck !== true) {
          return tagCheck;
        }
        tagIds.push(new RecordId(blogTabels.tag, tag));
      }
    }

    const likeIds = [];
    if (likes) {
      for (const lik of likes) {
        const likeCheck = await checkExists(
          blogTabels.like,
          lik,
          `Like with ID ${lik} not found.`
        );
        if (likeCheck !== true) {
          return likeCheck;
        }
        likeIds.push(new RecordId(blogTabels.like, lik));
      }
    }

    const commentIds = [];
    if (comments) {
      for (const com of comments) {
        const commentCheck = await checkExists(
          blogTabels.comment,
          com,
          `Comment with ID ${com} not found.`
        );
        if (commentCheck !== true) {
          return commentCheck;
        }
        commentIds.push(new RecordId(blogTabels.comment, com));
      }
    }
    const authorId = new RecordId(blogTabels.user, author);
    // Create a record for the post

    const postData = {
      title,
      content,
      slug,
      author: authorId,
      categories: categoryIds,
      tags: tagIds,
      likes: likeIds,
      comments: commentIds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdPost = await db.create(blogTabels.post, postData);

    return NextResponse.json(createdPost, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create posts", details: err.message },
      {
        status: 500,
      }
    );
  }
}
