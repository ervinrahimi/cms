// Import the SurrealDB library
import { Surreal } from 'surrealdb'

// Environment variables for SurrealDB connection
const DB_URL = process.env.DB_URL
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_NAME = process.env.DB_NAME
const DB_NAMESPACE = process.env.DB_NAMESPACE

// Ensure all required environment variables are provided
if (!DB_URL || !DB_USER || !DB_PASS || !DB_NAME || !DB_NAMESPACE) {
  throw new Error('Environment variables are required.')
}

// Singleton instance to cache the database connection
let dbInstance = null

/**
 * Get or initialize a SurrealDB connection.
 *
 * This function establishes a connection to SurrealDB if it hasn't been initialized yet.
 * If the connection already exists, it returns the cached instance.
 *
 * @returns {Promise<Surreal>} The SurrealDB instance.
 * @throws Will throw an error if the connection or authentication fails.
 */

export async function sdb() {
  if (dbInstance) {
    return dbInstance // Return existing instance if already connected
  }

  const db = new Surreal()
  try {
    // Connect to SurrealDB using the provided URL
    await db.connect(DB_URL)

    // Authenticate using the username and password
    await db.signin({
      username: DB_USER,
      password: DB_PASS,
    })

    // Select the namespace and database
    await db.use({
      namespace: DB_NAMESPACE,
      database: DB_NAME,
    })

    // Cache the instance for future use
    dbInstance = db
    return db
  } catch (error) {
    console.error('Failed to connect to SurrealDB:', error)
    throw error
  }
}

export default sdb
