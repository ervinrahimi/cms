import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(3).nonempty("Title cannot be empty"),
  content: z.string().min(50).nonempty("Content cannot be empty"),
  slug: z.string().min(3).nonempty("Slug cannot be empty"),
});

export const CategorySchema = z.object({
  title: z.string().min(3).nonempty("Title cannot be empty"),
  description: z.string().min(10).nonempty("Description cannot be empty"),
  slug: z.string().min(3).nonempty("Slug cannot be empty"),
});

export const CommentSchema = z.object({
  content: z.string().min(1).nonempty("Content cannot be empty"),
});
