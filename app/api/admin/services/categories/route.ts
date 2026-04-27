import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId, role] = decoded.split(":")
    
    if (!userId) return null
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })
    
    return user
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
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