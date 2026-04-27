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

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const where = (user.role === "ADMIN" || user.role === "SUPER_ADMIN") ? {} : { userId: user.id }

  const pickups = await prisma.pickupRequest.findMany({
    where,
    include: { order: true, user: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(pickups)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const body = await req.json()
  const { orderId, address, pickupDate, remarks } = body

  if (!orderId || !address) {
    return NextResponse.json({ error: "缺少必填项" }, { status: 400 })
  }

  // Verify order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id }
  })
  if (!order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 })
  }

  const pickup = await prisma.pickupRequest.create({
    data: {
      orderId, userId: user.id,
      address, pickupDate: new Date(pickupDate),
      remarks, status: "PENDING"
    },
  })

  return NextResponse.json(pickup, { status: 201 })
}