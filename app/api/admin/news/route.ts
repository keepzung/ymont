import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(news)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
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