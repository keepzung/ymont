import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const publicPaths = ["/", "/login", "/register", "/guide", "/pricing", "/services", "/about", "/consulting", "/faq", "/news", "/booking", "/api/auth", "/_vercel"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const searchParams = request.nextUrl.searchParams
  const callbackUrl = searchParams.get("callbackUrl")

  // Allow callback URLs from login
  if (pathname === "/login" && callbackUrl) {
    return NextResponse.next()
  }

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  if (isPublic) return NextResponse.next()

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
      
      if (!token) {
        console.log("No token found, redirecting to login")
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (pathname.startsWith("/admin")) {
        const userRole = token.role
        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
          console.log("User role not admin:", userRole)
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    } catch (error) {
      console.error("Middleware error:", error)
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|uploads).*)"],
}