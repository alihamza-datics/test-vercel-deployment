import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/companyProfile(.*)', '/chat(.*)', '/'])
const isPublicRoute = createRouteMatcher(['/login', '/signup',])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL(`${process.env.API_BASE_URL}/`, req.url));
  }
  if (isProtectedRoute(req)) auth().protect({
    unauthenticatedUrl: `${process.env.API_BASE_URL}/login`
  })
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
