import { z } from "zod";

export const PostSchemaCreate = z.object({
  title: z.string().min(3).nonempty("Title cannot be empty"),
  content: z.string().min(10).nonempty("Content cannot be empty"),
  slug: z.string().min(3).nonempty("Slug cannot be empty"),
});

export const PostSchemaUpdate = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(50).optional(),
  slug: z.string().min(3).optional(),
});

export const CategorySchemaCreate = z.object({
  title: z.string().min(3).nonempty("Title cannot be empty"),
  description: z.string().min(3).nonempty("Description cannot be empty"),
  slug: z.string().min(3).nonempty("Slug cannot be empty"),
});

export const CategorySchemaUpdate = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
});

export const CommentSchema = z.object({
  content: z.string().min(1).nonempty("Content cannot be empty"),
});
