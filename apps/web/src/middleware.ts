import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getAdminSessionFromRequest } from "@/lib/auth/admin-session";
import { canAccess } from "@/lib/auth/permissions";

const studentProtectedRoutes = [
  "/dashboard",
  "/organizer",
  "/profile",
];

const isDynamicProtectedRoute = (pathname: string) => {
  return pathname.startsWith("/trips/") && pathname.endsWith("/book");
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin Routes ──────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // /admin/login is public
    if (pathname === "/admin/login") {
      // If already authenticated as admin, redirect to dashboard
      const cookieHeader = request.headers.get("cookie");
      const adminSession = await getAdminSessionFromRequest(cookieHeader);
      if (adminSession) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin routes need admin session
    const cookieHeader = request.headers.get("cookie");
    const adminSession = await getAdminSessionFromRequest(cookieHeader);

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Admin-management routes require SUPER_ADMIN
    if (pathname.startsWith("/admin/admins") && adminSession.admin.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // ─── Student Routes ────────────────────────────────────────
  const isStudentProtected =
    studentProtectedRoutes.some((route) => pathname.startsWith(route)) ||
    isDynamicProtectedRoute(pathname);

  const isAuthRoute = pathname.startsWith("/auth");

  if (isStudentProtected || isAuthRoute) {
    const session = await getSession();

    if (!session && isStudentProtected) {
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (session && isStudentProtected) {
      const hasPermission = canAccess(session.user.role, pathname);
      if (!hasPermission) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
