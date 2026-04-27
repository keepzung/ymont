import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const body = await req.json()
  const { name, slug, description, icon, sortOrder } = body

  if (!name) {
    return NextResponse.json({ error: "分类名称必填" }, { status: 400 })
  }

  const category = await prisma.serviceCategory.create({
    data: { 
      name, 
      slug: slug || name, 
      description, 
      icon, 
      sortOrder: sortOrder || 0 
    },
  })

  return NextResponse.json(category, { status: 201 })
}