import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/companyProfile(.*)', '/chat(.*)', '/'])

export default clerkMiddleware((auth, req) => {
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
