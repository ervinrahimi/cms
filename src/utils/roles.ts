import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { Roles } from '@/types/globals'

// Check if the user has the required role
export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}

// Guard the API routes based on the user role
export const guardAPI = async (role: Roles) => {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata.role

  if (userRole === 'admin' || userRole === role) return

  return NextResponse.json(
    {
      error: {
        code: 'not_found',
        message: 'The requested resource was not found.',
      },
    },
    {
      status: 404,
    }
  )
}
