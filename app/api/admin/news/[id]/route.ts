import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const news = await prisma.news.findUnique({ where: { id } })

  if (!news) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(news)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, slug, summary, content, isPublished, isFeatured, publishedAt } = body

  const news = await prisma.news.update({
    where: { id },
    data: { 
      title, slug, summary, content, 
      isPublished, isFeatured, 
      publishedAt: isPublished && publishedAt ? publishedAt : (isPublished ? new Date() : null)
    },
  })

  return NextResponse.json(news)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  if (!session?.user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "无权限" }, { status: 403 })
  }

  const { id } = await params
  await prisma.news.delete({ where: { id } })

  return NextResponse.json({ success: true })
}