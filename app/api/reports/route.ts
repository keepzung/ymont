import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

async function getUserFromRequest(req: NextRequest) {
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

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const where = (user.role === "ADMIN" || user.role === "SUPER_ADMIN") ? {} : { userId: user.id }

  const reports = await prisma.report.findMany({
    where,
    include: { order: { select: { orderNo: true, sampleName: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reports)
}