import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/"

  // Get the token from cookies or authorization header
  const token = request.cookies.get("token")?.value || ""

  // Check for token in localStorage via a custom header (if available)
  const authHeader = request.headers.get("authorization")
  const hasAuthHeader = authHeader && authHeader.startsWith("Bearer ")

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isPublicPath && !token && !hasAuthHeader) {
    console.log("Middleware: No auth token found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login, redirect to dashboard
  if (path === "/login" && (token || hasAuthHeader)) {
    console.log("Middleware: Auth token found on login page, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}