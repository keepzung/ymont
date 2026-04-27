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
  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      company: true, balance: true, memberLevel: true, createdAt: true,
      _count: { select: { orders: true } }
    },
  })

  if (!targetUser) return NextResponse.json({ error: "用户不存在" }, { status: 404 })

  return NextResponse.json(targetUser)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { role, name, company, balance } = body

  const updateData: any = {}
  if (role) updateData.role = role
  if (name !== undefined) updateData.name = name
  if (company !== undefined) updateData.company = company
  if (balance !== undefined) updateData.balance = balance

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(updated)
}