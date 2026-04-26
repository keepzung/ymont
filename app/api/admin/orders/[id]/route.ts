import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { 
      user: true, 
      orderItems: { include: { service: true } },
      payments: true,
      reports: true,
    },
  })

  if (!order) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(order)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, fileUrl, title } = body

  if (status) {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(order)
  }

  if (fileUrl && title) {
    const report = await prisma.report.create({
      data: {
        orderId: id,
        userId: (await prisma.order.findUnique({ where: { id } }))!.userId,
        title,
        fileUrl,
        status: "READY",
      },
    })
    return NextResponse.json(report)
  }

  return NextResponse.json({ error: "无效请求" }, { status: 400 })
}