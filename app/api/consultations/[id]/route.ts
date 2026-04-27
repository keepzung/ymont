import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  })

  if (!consultation) return NextResponse.json({ error: "不存在" }, { status: 404 })

  // Only admin or the consultation owner can view details
  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN" && consultation.userId !== session.user.id) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  return NextResponse.json(consultation)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { reply, status } = body

  // Check if consultation exists
  const consultation = await prisma.consultation.findUnique({ where: { id } })
  if (!consultation) return NextResponse.json({ error: "不存在" }, { status: 404 })

  // Admin can reply and change status
  if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
    const updateData: any = {}
    if (reply) {
      updateData.reply = reply
      updateData.status = "REPLIED"
    }
    if (status) {
      updateData.status = status
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json(updated)
  }

  // Regular user can only close their consultation
  if (consultation.userId === session.user.id && status === "CLOSED") {
    const updated = await prisma.consultation.update({
      where: { id },
      data: { status: "CLOSED" },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "无权限" }, { status: 403 })
}