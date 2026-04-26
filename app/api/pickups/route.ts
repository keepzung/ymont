import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const where = session.user.role === "ADMIN" ? {} : { userId: session.user.id }

  const pickups = await prisma.pickupRequest.findMany({
    where,
    include: { order: true, user: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(pickups)
}