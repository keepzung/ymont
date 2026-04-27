import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helper"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const service = await prisma.servicePrice.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!service) return NextResponse.json({ error: "服务不存在" }, { status: 404 })
  return NextResponse.json(service)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const service = await prisma.servicePrice.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(service)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  await prisma.servicePrice.delete({ where: { id } })

  return NextResponse.json({ success: true })
}