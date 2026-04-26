import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { orderId, method } = await req.json()
  if (!orderId || !method) return NextResponse.json({ error: "缺少参数" }, { status: 400 })

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: "PENDING_PAYMENT" },
  })
  if (!order) return NextResponse.json({ error: "订单不存在或状态不符" }, { status: 400 })

  const payment = await prisma.payment.create({
    data: {
      orderId, amount: order.finalAmount, method,
      status: "PENDING",
    },
  })

  return NextResponse.json(payment, { status: 201 })
}
