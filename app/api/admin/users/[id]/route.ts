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
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      company: true, balance: true, memberLevel: true, createdAt: true,
      _count: { select: { orders: true } }
    },
  })

  if (!user) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(user)
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
  const body = await request.json()
  const { role, name, company, balance } = body

  const updateData: any = {}
  if (role) updateData.role = role
  if (name !== undefined) updateData.name = name
  if (company !== undefined) updateData.company = company
  if (balance !== undefined) updateData.balance = balance

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(user)
}