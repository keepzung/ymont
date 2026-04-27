import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const publicPaths = ["/", "/login", "/register", "/guide", "/pricing", "/services", "/about", "/consulting", "/faq", "/news", "/booking", "/api/auth", "/_vercel", "/_next"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (isPublic) return NextResponse.next()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      // 只检查 token 是否存在，不检查角色
      const token = await getToken({ req: request, secret: process.env.AUTH_SECRET, absolute: false })
      
      console.log("Path:", pathname, "Token exists:", !!token, "Role:", token?.role)
      
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}