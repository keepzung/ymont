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
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const category = await prisma.serviceCategory.findUnique({
    where: { id },
    include: { services: true },
  })

  if (!category) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(category)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { name, slug, description, icon, sortOrder, isActive } = body

  const category = await prisma.serviceCategory.update({
    where: { id },
    data: { name, slug, description, icon, sortOrder, isActive },
  })

  return NextResponse.json(category)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  
  const serviceCount = await prisma.servicePrice.count({ where: { categoryId: id } })
  if (serviceCount > 0) {
    return NextResponse.json({ error: "该分类下有检测项目，无法删除" }, { status: 400 })
  }

  await prisma.serviceCategory.delete({ where: { id } })

  return NextResponse.json({ success: true })
}