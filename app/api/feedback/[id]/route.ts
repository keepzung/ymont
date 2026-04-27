import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, clearUserCache } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params
  
  const where: any = { id }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    where.userId = user.id
  }

  const feedback = await prisma.feedback.findFirst({
    where,
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  })

  if (!feedback) {
    return NextResponse.json({ error: "反馈不存在" }, { status: 404 })
  }

  return NextResponse.json(feedback)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { reply, status } = body

  const updateData: any = {}
  if (reply) {
    updateData.reply = reply
    updateData.repliedAt = new Date()
    updateData.replyBy = user.id
  }
  if (status) {
    updateData.status = status
  }

  const feedback = await prisma.feedback.update({
    where: { id },
    data: updateData,
  })

  clearUserCache()

  return NextResponse.json(feedback)
}