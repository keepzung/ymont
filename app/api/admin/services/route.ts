import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const services = await prisma.servicePrice.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  })

  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
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