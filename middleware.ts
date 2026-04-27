import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const publicPaths = ["/", "/login", "/register", "/guide", "/pricing", "/services", "/about", "/consulting", "/faq", "/news", "/booking", "/_vercel", "/_next"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths don't need auth
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (isPublic) return NextResponse.next()

  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      const session = await auth()
      
      if (!session?.user) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      console.error("Middleware auth error:", error)
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}