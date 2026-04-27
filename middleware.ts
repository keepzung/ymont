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

  // Check auth token
  const token = request.cookies.get("auth-token")?.value
  let userRole = null
  
  if (token) {
    try {
      const decoded = Buffer.from(token, "base64").toString()
      const [, role] = decoded.split(":")
      userRole = role
    } catch {
      userRole = null
    }
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // User dashboard routes protection
  if (pathname.startsWith("/dashboard")) {
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    // Admins should go to admin, not dashboard
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}