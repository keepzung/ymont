import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { orderSchema } from "@/lib/validations"
import { generateOrderNo } from "@/lib/constants"

export async function GET(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

  // Admin can see all orders, regular users see only their own
  const where = (userRole === "ADMIN" || userRole === "SUPER_ADMIN") 
    ? {} 
    : { userId: session.user.id }

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
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "请先登录" }, { status: 401 })

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
      orderNo, userId: session.user.id,
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