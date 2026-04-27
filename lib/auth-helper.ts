import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

let cachedUser: { id: string; email: string; phone?: string; name?: string; role: string } | null = null
let cacheTime = 0

export async function getUserFromRequest(req: NextRequest) {
  const now = Date.now()
  
  // Cache user for 30 seconds to avoid repeated DB queries
  if (cachedUser && now - cacheTime < 30000) {
    return cachedUser
  }
  
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) {
    cachedUser = null
    return null
  }
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    
    if (!userId) {
      cachedUser = null
      return null
    }
    
    // Use cache for user data (update every 30 seconds)
    cachedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    }) as any
    
    cacheTime = now
    return cachedUser
  } catch {
    cachedUser = null
    return null
  }
}

export function clearUserCache() {
  cachedUser = null
  cacheTime = 0
}

export function requireRole(allowedRoles: string[]) {
  return async function(req: NextRequest): Promise<{user: any, error: NextResponse | null}> {
    const user = await getUserFromRequest(req)
    
    if (!user) {
      return { 
        user: null, 
        error: NextResponse.json({ error: "请先登录" }, { status: 401 }) 
      }
    }
    
    if (!allowedRoles.includes(user.role)) {
      return { 
        user: null, 
        error: NextResponse.json({ error: "无权限访问" }, { status: 403 }) 
      }
    }
    
    return { user, error: null }
  }
}

export function requireAdmin(req: NextRequest) {
  return requireRole(["ADMIN", "SUPER_ADMIN"])(req)
}

export function requireAuth(req: NextRequest) {
  return async function(): Promise<{user: any, error: NextResponse | null}> {
    const user = await getUserFromRequest(req)
    
    if (!user) {
      return { 
        user: null, 
        error: NextResponse.json({ error: "请先登录" }, { status: 401 }) 
      }
    }
    
    return { user, error: null }
  }
}