import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import "@/lib/auth-env";
import { APP_PATHS } from "@/lib/app-urls";
import {
  ADMIN_SESSION_COOKIE,
  clearSharedAuthCookies,
  isValidAdminToken,
} from "@/lib/auth-cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: request.nextUrl.protocol === "https:",
    cookieName: ADMIN_SESSION_COOKIE,
  });

  const isLoggedIn = isValidAdminToken(token);
  const isLogin = pathname.startsWith(APP_PATHS.adminLogin);

  if (isLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(APP_PATHS.adminDashboard, request.url));
    }

    const response = NextResponse.next();
    clearSharedAuthCookies(response);
    return response;
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(APP_PATHS.adminLogin, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
