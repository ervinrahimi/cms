<div align="center">
    <h1>Project Structure</h1>
    <p><em>A modular, scalable, and well-documented architecture for modern applications</em></p>
</div>

---

## Description

The **Project Structure** provides a foundational layout for developing scalable and maintainable web applications. It includes preconfigured routes, database connectivity, and example API structures, ensuring seamless development with TypeScript and Next.js.

---

## Features

- **Organized Structure**: Modular design for better scalability.
- **Database Integration**: Preconfigured SurrealDB connection.
- **Centralized Routes**: Streamlined and well-documented route management.
- **Global Styling**: Unified UI with global styles.
- **API Ready**: Easily extendable backend integrations.

---

## Quick Overview

| **Feature**          | **Status**                                    |
| -------------------- | --------------------------------------------- |
| **Folder Structure** | ✅ Defined                                    |
| **API Routes**       | ✅ Basic Examples<br>⬜ Advanced Logic        |
| **Database Setup**   | ✅ SurrealDB Connected<br>⬜ Multi-DB Support |
| **Routing**          | ✅ Predefined Routes<br>⬜ Dynamic Routing    |
| **Styling**          | ✅ Global CSS<br>⬜ Theme Support             |
| **Documentation**    | ⬜ Extended Guides<br>⬜ Additional Examples  |

---

## Folder and File Structure

The following is an overview of the project’s key folders and files:

### `app`

- **`layout.tsx`**: Defines the global layout, shared components, and page structure.
- **`page.tsx`**: The entry point for rendering the application’s main content.
- **`api/example/route.ts`**: Demonstrates an example API route using Next.js App Router.

### `constants/routes`

Contains centralized route definitions for easy management:

- **`admin.ts`**: Admin panel routes.
- **`api.ts`**: API endpoints.
- **`auth.ts`**: Authentication-related routes.
- **`index.ts`**: Combines and exports all route configurations.

### `db/surrealdb.ts`

Manages SurrealDB connections with environment variables for security and scalability. The connection is structured for reusability and efficient query handling.

### `styles`

- **`globals.css`**: Contains the global styles for the application, ensuring consistency across all pages and components.

### `Helpers`

Provides essential resources for developers to understand and work with the project:

| **Folder/File**                                                                                           | **Description**                                          |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **[Helpers/docs/api/blog.md](https://github.com/ervinrahimi/cms/blob/main/src/helpers/docs/api/blog.md)** | Information about APIs written for the blog.             |
| **[Helpers/docs/cms.md](https://github.com/ervinrahimi/cms/blob/main/src/helpers/docs/cms.md)**           | Descriptions about the CMS project and all its features. |
| **Coming Soon !**                                                                                         | Coming Soon !                                            |
| **Coming Soon !**                                                                                         | Coming Soon !                                            |

---

## Technologies Used

- **Next.js**: Modern React framework for server-side rendering (SSR) and static generation. [Documentation](https://nextjs.org/docs)
- **TypeScript**: A superset of JavaScript for strong typing and better code quality. [Documentation](https://www.typescriptlang.org/docs/)
- **SurrealDB**: A scalable and flexible database. [SurrealQL Documentation](https://surrealdb.com/docs/surrealql), [JavaScript SDK Documentation](https://surrealdb.com/docs/sdk/javascript)
- **Clerk**: Authentication and user management solution. [Documentation](https://clerk.com/docs)

---

## Future Updates

- Advanced API documentation.
- Theme customization support.
- Dynamic route handling.

---

<div align="center">
    <p>Powered by <strong>Future Wings</strong></p>
</div>
