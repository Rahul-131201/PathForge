import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes - no auth required
  const publicRoutes = [
    "/",
    "/explore",
    "/login",
    "/signup",
    "/api/auth",
    "/pricing",
    "/docs",
  ];

  // Check if path is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/api/auth") {
      return pathname.startsWith("/api/auth");
    }
    return pathname === route;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/roadmap", "/settings", "/onboarding"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
