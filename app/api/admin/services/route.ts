import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const services = await prisma.servicePrice.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  })

  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const body = await req.json()
  const { name, code, instrument, price, unit, turnaround, description, categoryId } = body

  if (!name || !code || !price || !categoryId) {
    return NextResponse.json({ error: "缺少必填项" }, { status: 400 })
  }

  const service = await prisma.servicePrice.create({
    data: { name, code, instrument, price, unit, turnaround, description, categoryId },
  })

  return NextResponse.json(service, { status: 201 })
}