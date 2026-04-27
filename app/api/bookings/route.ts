import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  // If logged in, show user's bookings, otherwise show all (for admin)
  const where = user ? { userId: user.id } : {}

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
  
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  const body = await req.json()
  const { name, company, phone, email, serviceType, sampleName, quantity, remark } = body

  if (!name || !phone || !serviceType) {
    return NextResponse.json({ error: "缺少必填项" }, { status: 400 })
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user?.id || null,
      name,
      company,
      phone,
      email,
      serviceType,
      sampleName,
      quantity,
      remark,
    },
  })

  return NextResponse.json(booking, { status: 201 })
}