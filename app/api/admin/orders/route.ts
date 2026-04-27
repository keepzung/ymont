import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
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