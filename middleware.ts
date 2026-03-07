import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes that don't need auth
    const publicPaths = ["/landing", "/api/auth", "/api/trpc"];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    // Allow public routes and static assets
    if (isPublic || pathname.startsWith("/_next") || pathname.includes(".")) {
        return NextResponse.next();
    }

    // Check for session cookie (NextAuth sets this)
    const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");

    // Redirect unauthenticated users to landing
    if (!sessionToken && pathname !== "/landing") {
        return NextResponse.redirect(new URL("/landing", req.url));
    }

    // Redirect authenticated users away from landing
    if (sessionToken && pathname === "/landing") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
