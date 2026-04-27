import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const category = await prisma.serviceCategory.findUnique({
    where: { id },
    include: { services: true },
  })

  if (!category) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(category)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  
  // Check if category has services
  const serviceCount = await prisma.servicePrice.count({ where: { categoryId: id } })
  if (serviceCount > 0) {
    return NextResponse.json({ error: "该分类下有检测项目，无法删除" }, { status: 400 })
  }

  await prisma.serviceCategory.delete({ where: { id } })

  return NextResponse.json({ success: true })
}