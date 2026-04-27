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
  const service = await prisma.servicePrice.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!service) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(service)
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
  const { name, code, instrument, price, unit, turnaround, description, categoryId, isActive } = body

  const service = await prisma.servicePrice.update({
    where: { id },
    data: { name, code, instrument, price, unit, turnaround, description, categoryId, isActive },
  })

  return NextResponse.json(service)
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
  await prisma.servicePrice.delete({ where: { id } })

  return NextResponse.json({ success: true })
}