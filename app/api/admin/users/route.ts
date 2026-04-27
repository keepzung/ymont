import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")
  const role = searchParams.get("role")

  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }
  
  if (role && role !== "all") {
    where.role = role
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, name: true, email: true, phone: true, role: true,
      company: true, balance: true, memberLevel: true, createdAt: true,
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(users)
}