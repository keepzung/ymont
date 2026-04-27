import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

let userCache: { id: string; email: string; phone?: string; name?: string; role: string } | null = null
let cacheTime = 0
const CACHE_DURATION = 10000 // 10 seconds - reduced for data freshness

export async function getUserFromRequest(req: NextRequest) {
  const now = Date.now()
  
  if (userCache && now - cacheTime < CACHE_DURATION) {
    return userCache
  }
  
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) {
    userCache = null
    return null
  }
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    
    if (!userId) {
      userCache = null
      return null
    }
    
    userCache = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    }) as any
    
    cacheTime = now
    return userCache
  } catch {
    userCache = null
    return null
  }
}

export function clearUserCache() {
  userCache = null
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