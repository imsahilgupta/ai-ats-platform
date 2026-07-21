import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ONLY_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_PREFIX = "/dashboard";
const PROTECTED_ROUTES = [
  "/dashboard",
  "/mock-interview",
  "/resume-analyzer",
  "/career-report",
  "/reports",
  "/analytics",
  "/achievements",
  "/subscription",
  "/notifications",
  "/profile",
  "/settings",
  "/admin",
];

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthOnly = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && hasToken) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mock-interview/:path*",
    "/resume-analyzer/:path*",
    "/career-report/:path*",
    "/reports/:path*",
    "/analytics/:path*",
    "/achievements/:path*",
    "/subscription/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
