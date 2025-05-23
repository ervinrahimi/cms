import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Admin routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]) 

// Public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/api(.*)',
  '/chat(.*)',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',

])

export default clerkMiddleware(async (auth, req) => {
  // Redirect non-admin users from admin routes
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  } 

  // Protect all routes except public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
