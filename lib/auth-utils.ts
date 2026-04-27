import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

let userCache: { id: string; email: string; phone?: string; name?: string; role: string } | null = null
let cacheTime = 0

export async function getUserFromRequest(req: NextRequest) {
  const now = Date.now()
  
  // Cache user for 30 seconds to avoid repeated DB queries
  if (userCache && now - cacheTime < 30000) {
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