import sdb from '@/db/surrealdb'
import { NextResponse } from 'next/server'


/**
 * API Handler to define the example table in SurrealDB.
 *
 * This endpoint connects to SurrealDB, defines an example table,
 * and ensures a proper JSON response structure for success and error cases.
 *
 * @returns {Promise<NextResponse>} API response in standardized JSON format.
 */

export async function POST() {
  try {
    // Get the SurrealDB instance
    const db = await sdb()

    // Execute the SurrealQL query to define the example table
    await db.query(`DEFINE TABLE example;`)

    // Return a structured success response
    return NextResponse.json(
      {
        message: 'Example table created successfully.',
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('Error creating example table:', error)

    // Return a structured error response
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to create "example" table.',
        },
      },
      {
        status: 500,
      }
    )
  }
}