import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
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

  if (!order) return NextResponse.json({ error: "订单不存在" }, { status: 404 })

  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, adminRemark } = body

  const updateData: any = {}
  if (status) updateData.status = status
  if (adminRemark !== undefined) {
    updateData.adminRemark = adminRemark
    updateData.adminUpdatedBy = user.id
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(order)
}