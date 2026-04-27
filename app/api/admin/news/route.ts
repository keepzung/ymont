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

  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(news)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限访问" }, { status: 403 })
  }

  const body = await req.json()
  const { title, slug, summary, content, isPublished, isFeatured, publishedAt } = body

  if (!title || !content) {
    return NextResponse.json({ error: "标题和内容必填" }, { status: 400 })
  }

  const news = await prisma.news.create({
    data: { 
      title, 
      slug: slug || title, 
      summary, 
      content, 
      isPublished: isPublished || false, 
      isFeatured: isFeatured || false,
      publishedAt: isPublished ? (publishedAt || new Date()) : null,
    },
  })

  return NextResponse.json(news, { status: 201 })
}