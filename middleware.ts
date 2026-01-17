// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/pets", "/visits"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  // 1. Sprawdzamy czy ciastko istnieje
  const cookie = req.cookies.get("session")?.value;

  // 2. Próbujemy je odszyfrować
  const session = await decrypt(cookie);

  // --- DEBUGGING (Patrz w terminal!) ---
  console.log(`[Middleware] Path: ${path}`);
  console.log(`[Middleware] Cookie found: ${!!cookie}`);
  console.log(`[Middleware] Decrypted UserID:`, session?.userId);
  // -------------------------------------

  if (isProtectedRoute && !session?.userId) {
    console.log("Redirecting to login..."); // Debug
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
