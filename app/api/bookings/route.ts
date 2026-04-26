import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, company, phone, email, serviceType, sampleName, quantity, remark } = body

  const booking = await prisma.booking.create({
    data: {
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