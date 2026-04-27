import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    
    if (!userId) return null
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })
    
    return user
  } catch {
    return null
  }
}

export async function requireAdmin(req: NextRequest): Promise<{user: any, error: NextResponse | null}> {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return { 
      user: null, 
      error: NextResponse.json({ error: "无权限访问" }, { status: 403 }) 
    }
  }
  
  return { user, error: null }
}