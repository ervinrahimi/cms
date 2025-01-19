<div align="center">
    <h1>Blog Module</h1>
    <p><em>A modular, scalable, and well-documented architecture for modern applications</em></p>
</div>

---

## Description

The **Blog Module** provides the core functionality for managing blog posts, likes, comments, tags, and categories. This module leverages **Next.js**, **SurrealDB**, and **TypeScript** to offer a scalable, modular, and maintainable solution for blog management. The API endpoints are designed to facilitate creating, reading, updating, and deleting blog content with seamless database integration.

---

## Features

- **Post Management**: Ability to create, read, update, and delete blog posts.
- **Like System**: Allows users to like or unlike blog posts.
- **Comment System**: Manage comments for blog posts.
- **Tag Management**: Allows posts to be tagged for easier categorization.
- **Category Management**: Organize posts into different categories.
- **RESTful API**: Standardized API routes for all resources.
- **Modular Architecture**: Easy to scale and extend.

---

## Quick Overview

| **Feature**         | **Status**               |
| ------------------- | ------------------------ |
| **Post Routes**     | ✅ CRUD operations       |
| **Like Routes**     | ✅ Like and unlike posts |
| **Comment Routes**  | ✅ Add and view comments |
| **Tag Routes**      | ✅ Add and manage tags   |
| **Category Routes** | ✅ Manage categories     |
| **Database Setup**  | ✅ SurrealDB Integration |
| **Routing**         | ✅ Predefined Routes     |
| **Documentation**   | ⬜ Extended README       |

---

## Key Files and Examples

### **Posts API**

#### Fetching All Posts

**GET** `/api/posts`

```typescript
const db = await sdb()
const posts = await db.select('posts')
return NextResponse.json(posts, { status: 200 })
```

- **Explanation**: Retrieves all posts from the `posts` table.

#### Creating a New Post

**POST** `/api/posts`

```typescript
const postData = { title, content, slug, author, categories, tags, created_at: new Date() }
const createdPost = await db.create('posts', postData)
return NextResponse.json(createdPost, { status: 201 })
```

- **Explanation**: Creates a new post record in the `posts` table.

---

### **Categories API**

#### Fetching All Categories

**GET** `/api/categories`

```typescript
const db = await sdb()
const categories = await db.select('categories')
return NextResponse.json(categories, { status: 200 })
```

- **Explanation**: Fetches all categories from the `categories` table.

#### Creating a New Category

**POST** `/api/categories`

```typescript
const categoryData = { title, description, slug, created_at: new Date() }
const createdCategory = await db.create('categories', categoryData)
return NextResponse.json(createdCategory, { status: 201 })
```

- **Explanation**: Adds a new category to the `categories` table.

---

### **Comments API**

#### Fetching All Comments

**GET** `/api/comments`

```typescript
const db = await sdb()
const comments = await db.select('comments')
return NextResponse.json(comments, { status: 200 })
```

- **Explanation**: Retrieves all comments associated with posts.

#### Adding a Comment

**POST** `/api/comments`

```typescript
const commentData = { post_ref, user_ref, content, created_at: new Date() }
const createdComment = await db.create('comments', commentData)
return NextResponse.json(createdComment, { status: 201 })
```

- **Explanation**: Adds a new comment to the `comments` table.

---

### **Likes API**

#### Fetching All Likes

**GET** `/api/likes`

```typescript
const db = await sdb()
const likes = await db.select('likes')
return NextResponse.json(likes, { status: 200 })
```

- **Explanation**: Fetches all likes for posts.

#### Adding a Like

**POST** `/api/likes`

```typescript
const likeData = { post_ref, user_ref, created_at: new Date() }
const createdLike = await db.create('likes', likeData)
return NextResponse.json(createdLike, { status: 201 })
```

- **Explanation**: Registers a like in the `likes` table.

---

### **Tags API**

#### Fetching All Tags

**GET** `/api/tags`

```typescript
const db = await sdb()
const tags = await db.select('tags')
return NextResponse.json(tags, { status: 200 })
```

- **Explanation**: Fetches all tags available in the system.

#### Creating a New Tag

**POST** `/api/tags`

```typescript
const tagData = { name, slug, created_at: new Date() }
const createdTag = await db.create('tags', tagData)
return NextResponse.json(createdTag, { status: 201 })
```

- **Explanation**: Adds a new tag to the `tags` table.

---

## Technologies Used

- **Next.js**: Modern React framework for server-side rendering (SSR) and static generation. [Documentation](https://nextjs.org/docs)
- **TypeScript**: A superset of JavaScript for strong typing and better code quality. [Documentation](https://www.typescriptlang.org/docs/)
- **SurrealDB**: A scalable and flexible database. [SurrealQL Documentation](https://surrealdb.com/docs/surrealql), [JavaScript SDK Documentation](https://surrealdb.com/docs/sdk/javascript)
- **Clerk**: Authentication and user management solution. [Documentation](https://clerk.com/docs)

---

## Future Updates

- **Authentication**: Implement user authentication for post management.
- **Pagination**: Add pagination for large sets of posts or comments.
- **SEO**: Improve SEO features for posts and slugs.

---

<div align="center">
    <p>Powered by <strong>Future Wings</strong></p>
</div>
