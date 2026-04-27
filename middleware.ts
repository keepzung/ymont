import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const publicPaths = ["/", "/login", "/register", "/guide", "/pricing", "/services", "/about", "/consulting", "/faq", "/news", "/booking", "/_vercel", "/_next", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (isPublic) return NextResponse.next()

  // Allow all /api/* endpoints to pass through - they handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
      
      if (!token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      console.error("Middleware error:", error)
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}