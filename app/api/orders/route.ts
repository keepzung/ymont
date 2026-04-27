import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { orderSchema } from "@/lib/validations"
import { generateOrderNo } from "@/lib/constants"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    
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

  // Admin can see all orders, regular users see only their own
  const where = (user.role === "ADMIN" || user.role === "SUPER_ADMIN") 
    ? {} 
    : { userId: user.id }

  const orders = await prisma.order.findMany({
    where,
    include: { 
      user: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: { include: { service: true } } 
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  const body = await req.json()
  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { serviceIds, sampleName, sampleType, sampleWeight, sampleSize, sampleDesc, remark } = parsed.data

  const services = await prisma.servicePrice.findMany({ where: { id: { in: serviceIds } } })
  if (services.length === 0) return NextResponse.json({ error: "未找到检测项目" }, { status: 400 })

  const totalAmount = services.reduce((sum, s) => sum + s.price, 0)
  const finalAmount = totalAmount
  const orderNo = generateOrderNo()

  const order = await prisma.order.create({
    data: {
      orderNo, userId: user.id,
      status: "PENDING_PAYMENT",
      totalAmount, discountAmount: 0, finalAmount,
      sampleName, sampleType, sampleWeight, sampleSize, sampleDesc, remark,
      orderItems: {
        create: services.map((s) => ({
          serviceId: s.id, quantity: 1, price: s.price, subtotal: s.price,
        })),
      },
    },
    include: { orderItems: { include: { service: true } } },
  })

  return NextResponse.json(order, { status: 201 })
}