import { z } from 'zod';

const errorText = {
  author: 'Author cannot be empty',
  title: 'Title must be at least 3 characters long',
  content: 'Content must be at least 10 characters long',
  slug: 'Slug must be at least 3 characters long',
  description: 'Description must be at least 3 characters long',
  name: 'Name must be at least 3 characters long',
  post_ref: 'post ref cannot be empty',
  user_ref: 'user ref cannot be empty',
};

export const PostSchemaCreate = z.object({
  author: z.string().nonempty(errorText.author),
  categories: z.array(z.string()).nonempty(),
  tags: z.array(z.string()).optional(),
  likes: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
  title: z.string().min(3, errorText.title).nonempty(),
  content: z.string().min(10, errorText.content).nonempty(),
  slug: z.string().min(3, errorText.slug).nonempty(),
});

export const PostSchemaUpdate = z.object({
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  likes: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
  title: z.string().min(3, errorText.title).optional(),
  content: z.string().min(10, errorText.content).optional(),
  slug: z.string().min(3, errorText.slug).optional(),
});

export const CategorySchemaCreate = z.object({
  title: z.string().min(3, errorText.title).nonempty(),
  description: z.string().min(3, errorText.description).nonempty(),
  slug: z.string().min(3, errorText.slug).nonempty(),
});

export const CategorySchemaUpdate = z.object({
  title: z.string().min(3, errorText.title).optional(),
  description: z.string().min(3, errorText.description).optional(),
  slug: z.string().min(3, errorText.slug).optional(),
});

export const TagSchemaCreate = z.object({
  name: z.string().min(3, errorText.name).nonempty(),
  slug: z.string().min(3, errorText.slug).nonempty(),
});

export const TagSchemaUpdate = z.object({
  name: z.string().min(3, errorText.name).optional(),
  slug: z.string().min(3, errorText.slug).optional(),
});

export const CommentSchemaCreate = z.object({
  content: z.string().min(10, errorText.content).nonempty(),
  post_ref: z.string().nonempty(errorText.post_ref),
  user_ref: z.string().nonempty(errorText.user_ref),
});

export const CommentSchemaUpdate = z.object({
  content: z.string().min(10, errorText.content).optional(),
  post_ref: z.string().optional(),
  user_ref: z.string().optional(),
});

export const bookmarksSchemaCreate = z.object({
  post_ref: z.string().nonempty(errorText.post_ref),
  user_ref: z.string().nonempty(errorText.user_ref),
});

export const likesSchemaCreate = z.object({
  post_ref: z.string().nonempty(errorText.post_ref),
  user_ref: z.string().nonempty(errorText.user_ref),
});

export const BlogMediaSchemaCreate = z.object({
  post_ref: z.string().nonempty(errorText.post_ref),
  media_url: z.array(z.string()).nonempty(),
  media_type: z.array(z.string()).nonempty(),
});

export const BlogMediaSchemaUpdate = z.object({
  post_ref: z.string().optional(),
  media_url: z.array(z.string()).optional(),
  media_type: z.array(z.string()).optional(),
});
