import { NextResponse } from 'next/server'
import { guardAPI } from '@/utils/roles'
import sdb from '@/db/surrealdb'

/**
 * API handler for defining the "example" table in SurrealDB.
 *
 * This endpoint connects to SurrealDB, defines the "example" table, and
 * returns a standardized JSON response for success or failure. It also
 * verifies that the user has admin privileges to execute this operation.
 *
 * @returns {Promise<NextResponse>} Standardized JSON API response.
 */

export async function POST() {
  // Check if the user has admin privileges
  const guardResponse = await guardAPI('admin')
  if (guardResponse) return guardResponse

  try {
    // Get the SurrealDB instance
    const db = await sdb()

    // Execute the SurrealQL query to define the "example" table
    await db.query(`DEFINE TABLE example;`)

    // Return a structured success response
    return NextResponse.json(
      {
        message: "The 'example' table was created successfully.",
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('Error creating the "example" table:', error)

    // Return a structured error response
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to create the "example" table.',
        },
      },
      {
        status: 500,
      }
    )
  }
}
