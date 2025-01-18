//src/schemas/postSchemas.js
import { z } from "zod";

// Schema for creating a post
export const PostCreateSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  slug: z.string().nonempty({ message: "Slug is required." }),
  content: z.string().nonempty({ message: "Content is required." }),
  author: z.string().nonempty({ message: "Author is required." }),
});

// Schema for updating a post (all fields optional)
export const PostUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
});
