// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/pets", "/visits"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 1. Użytkownik nie jest zalogowany i próbuje wejść na chronioną trasę -> redirect do login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 2. Użytkownik jest zalogowany i próbuje wejść na login/register -> redirect do dashboard
  if (isPublicRoute && session?.userId && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};