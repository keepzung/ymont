import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = [
  "/", "/login", "/register", "/guide", "/pricing", "/services", 
  "/about", "/consulting", "/faq", "/news", "/booking", "/partners",
  "/careers", "/mining", "/feedback", "/_vercel", "/_next", "/favicon.ico"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths
  const isPublic = publicPaths.some((p) => 
    pathname === p || pathname.startsWith(p + "/")
  )
  if (isPublic) return NextResponse.next()

  // API routes - handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Protected pages - just let them through, they'll check auth themselves
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}