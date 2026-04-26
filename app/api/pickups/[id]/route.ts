import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await params
  const pickup = await prisma.pickupRequest.findUnique({
    where: { id },
    include: { order: true, user: true },
  })

  if (!pickup) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(pickup)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { status } = body

  const pickup = await prisma.pickupRequest.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(pickup)
}