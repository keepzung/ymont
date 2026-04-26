import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { orderItems: { include: { service: true } }, payments: true, reports: true },
  })

  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 })
  return NextResponse.json(order)
}
