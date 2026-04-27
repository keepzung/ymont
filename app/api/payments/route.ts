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

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const body = await req.json()
  const { orderId, method } = body

  if (!orderId || !method) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 })
  }

  // Users can only pay their own orders
  const order = await prisma.order.findFirst({
    where: { 
      id: orderId, 
      userId: user.id, 
      status: "PENDING_PAYMENT" 
    },
  })
  if (!order) {
    return NextResponse.json({ error: "订单不存在或状态不符" }, { status: 400 })
  }

  const payment = await prisma.payment.create({
    data: {
      orderId, amount: order.finalAmount, method,
      status: "PENDING",
    },
  })

  return NextResponse.json(payment, { status: 201 })
}