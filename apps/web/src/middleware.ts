import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/server";
import { canAccess } from "@/lib/auth/permissions";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/organizer",
  "/profile",
];

// Routes that require authentication but aren't strictly starting with the prefixes above
// e.g. /trips/[slug]/book
const isDynamicProtectedRoute = (pathname: string) => {
  return pathname.startsWith("/trips/") && pathname.endsWith("/book");
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) || isDynamicProtectedRoute(pathname);
  
  // Also, protect the auth routes from logged-in users (e.g. don't show login page if already logged in)
  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtected || isAuthRoute) {
    const session = await getSession();

    // 1. Unauthenticated users trying to access protected routes
    if (!session && isProtected) {
      const redirectUrl = new URL("/auth", request.url);
      // Save the intended destination
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 2. Authenticated users trying to access login page
    if (session && isAuthRoute) {
      const redirectUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // 3. RBAC checks for authenticated users on protected routes
    if (session && isProtected) {
      const hasPermission = canAccess(session.user.role, pathname);
      if (!hasPermission) {
        // Redirect to dashboard or a 403 page
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all paths except api, _next/static, _next/image, favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
