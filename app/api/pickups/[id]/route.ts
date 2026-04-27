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
  const pickup = await prisma.pickupRequest.findUnique({
    where: { id },
    include: { order: true, user: true },
  })

  if (!pickup) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(pickup)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status } = body

  const pickup = await prisma.pickupRequest.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(pickup)
}