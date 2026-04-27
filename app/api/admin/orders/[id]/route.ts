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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, adminRemark } = body
  const adminId = session.user.id

  const updateData: any = {}
  if (status) {
    updateData.status = status
  }
  if (adminRemark !== undefined) {
    updateData.adminRemark = adminRemark
    updateData.adminUpdatedBy = adminId
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(order)
}