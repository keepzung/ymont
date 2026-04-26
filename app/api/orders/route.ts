import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { orderSchema } from "@/lib/validations"
import { generateOrderNo, formatCurrency } from "@/lib/constants"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { orderItems: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const body = await req.json()
  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { serviceIds, sampleName, sampleType, sampleWeight, sampleSize, sampleDesc, remark, couponCode } = parsed.data

  const services = await prisma.servicePrice.findMany({ where: { id: { in: serviceIds } } })
  if (services.length === 0) return NextResponse.json({ error: "未找到检测项目" }, { status: 400 })

  const totalAmount = services.reduce((sum, s) => sum + s.price, 0)
  let discountAmount = 0

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
    if (coupon && coupon.isActive && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
      if (coupon.type === "FIXED") discountAmount = coupon.value
      else discountAmount = totalAmount * (coupon.value / 100)
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      discountAmount = Math.min(discountAmount, totalAmount)
    }
  }

  const finalAmount = totalAmount - discountAmount
  const orderNo = generateOrderNo()

  const order = await prisma.order.create({
    data: {
      orderNo, userId: session.user.id,
      status: "PENDING_PAYMENT",
      totalAmount, discountAmount, finalAmount,
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
