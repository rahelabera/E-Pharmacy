import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/";

  // Get the token from cookies or authorization header
  const token = request.cookies.get("token")?.value || "";
  const authHeader = request.headers.get("authorization");
  const hasAuthHeader = authHeader && authHeader.startsWith("Bearer ");

  // Validate token if it exists
  let isValidToken = false;
  if (token || hasAuthHeader) {
    try {
      const response = await axios.get(
        "https://e-pharmacybackend-production.up.railway.app/api/verify-token",
        {
          headers: {
            Authorization: `Bearer ${token || authHeader?.replace("Bearer ", "")}`,
          },
        }
      );
      isValidToken = response.data.success || response.status === 200;
    } catch (error) {
      console.error("Middleware: Token validation failed:", error);
      isValidToken = false;
    }
  }

  // If the user is not authenticated and the path is not public, redirect to login
  if (!isPublicPath && !isValidToken) {
    console.log("Middleware: No valid auth token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and trying to access login, redirect to dashboard
  if (path === "/login" && isValidToken) {
    console.log("Middleware: Valid auth token found on login page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};