import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(booking)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status } = body

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(booking)
}