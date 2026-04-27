import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest, clearUserCache } from "@/lib/auth-helper"
import { prisma } from "@/lib/db"
import { Feedback } from "@prisma/client"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  const where: any = {}
  
  if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    where.userId = user.id
  }
  
  if (status && status !== "all") {
    where.status = status
  }
  if (type && type !== "all") {
    where.type = type
  }

  const feedbacks = await prisma.feedback.findMany({
    where,
    include: { 
      user: { 
        select: { id: true, name: true, email: true, phone: true } 
      } 
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(feedbacks)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  const body = await req.json()
  const { type, title, content, contact } = body

  if (!title || !content) {
    return NextResponse.json({ error: "标题和内容必填" }, { status: 400 })
  }

  const feedback = await prisma.feedback.create({
    data: {
      type: type || "other",
      title,
      content,
      contact,
      userId: user?.id || null,
    },
  })

  if (user) {
    clearUserCache()
  }

  return NextResponse.json(feedback, { status: 201 })
}