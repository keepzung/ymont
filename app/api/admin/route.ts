import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return null
  }
  return session
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: "无权限" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  if (type === "stats") {
    const [orders, users, consultations, pickups] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.consultation.count({ where: { status: "OPEN" } }),
      prisma.pickupRequest.count({ where: { status: "PENDING" } }),
    ])
    return NextResponse.json({ orders, users, consultations, pickups })
  }

  if (type === "orders") {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true, phone: true } }, orderItems: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return NextResponse.json(orders)
  }

  if (type === "users") {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return NextResponse.json(users)
  }

  if (type === "consultations") {
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return NextResponse.json(consultations)
  }

  if (type === "pickups") {
    const pickups = await prisma.pickupRequest.findMany({
      include: { order: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return NextResponse.json(pickups)
  }

  return NextResponse.json({ error: "未知类型" }, { status: 400 })
}

export async function PATCH(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: "无权限" }, { status: 403 })

  const body = await req.json()
  const { action, id, data } = body

  if (action === "updateOrderStatus") {
    const order = await prisma.order.update({ where: { id }, data: { status: data.status } })
    return NextResponse.json(order)
  }

  if (action === "replyConsultation") {
    const consultation = await prisma.consultation.update({
      where: { id }, data: { reply: data.reply, status: "REPLIED" },
    })
    return NextResponse.json(consultation)
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 })
}