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
  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  })

  if (!consultation) return NextResponse.json({ error: "不存在" }, { status: 404 })

  // Only admin or the consultation owner can view details
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && consultation.userId !== user.id) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  return NextResponse.json(consultation)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { reply, status } = body

  const consultation = await prisma.consultation.findUnique({ where: { id } })
  if (!consultation) return NextResponse.json({ error: "不存在" }, { status: 404 })

  // Admin can reply and change status
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
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
  if (consultation.userId === user.id && status === "CLOSED") {
    const updated = await prisma.consultation.update({
      where: { id },
      data: { status: "CLOSED" },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "无权限" }, { status: 403 })
}