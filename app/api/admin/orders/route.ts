import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId, role] = decoded.split(":")
    
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
  
  // Check admin role
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")
  const status = searchParams.get("status")

  const where: any = {}
  
  if (search) {
    where.OR = [
      { orderNo: { contains: search } },
      { sampleName: { contains: search } },
      { user: { email: { contains: search } } },
    ]
  }
  
  if (status && status !== "all") {
    where.status = status
  }

  const orders = await prisma.order.findMany({
    where,
    include: { 
      user: { select: { id: true, name: true, email: true, phone: true, company: true } }, 
      orderItems: { include: { service: true } } 
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(orders)
}