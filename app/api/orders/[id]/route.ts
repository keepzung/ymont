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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  
  // Admin can see all orders, regular users see only their own
  const where: any = { id }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    where.userId = user.id
  }

  const order = await prisma.order.findFirst({
    where,
    include: { orderItems: { include: { service: true } }, payments: true, reports: true },
  })

  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  // Regular users can only update their own orders
  const where: any = { id }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    where.userId = user.id
  }

  const order = await prisma.order.findFirst({ where })

  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 })

  // Users can only cancel pending orders
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "只有待支付的订单可以取消" }, { status: 403 })
    }
  }

  const updated = await prisma.order.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(updated)
}