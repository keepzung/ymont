import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  const userRole = (session?.user as any)?.role
  
  // Admin can see all consultations
  if (session?.user && (userRole === "ADMIN" || userRole === "SUPER_ADMIN")) {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    
    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }

    const consultations = await prisma.consultation.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(consultations)
  }

  // Regular users see only their own consultations
  if (session?.user) {
    const consultations = await prisma.consultation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(consultations)
  }

  // Guest users can't view
  return NextResponse.json({ error: "请先登录" }, { status: 401 })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  
  const body = await req.json()
  const { name, phone, email, subject, message, type } = body

  if (!subject || !message) {
    return NextResponse.json({ error: "主题和内容必填" }, { status: 400 })
  }

  // If logged in, link to user
  const data: any = {
    name: name || null,
    phone: phone || null,
    email: email || null,
    subject,
    message,
    type: type || "consultation",
  }

  if (session?.user) {
    data.userId = session.user.id
  }

  const consultation = await prisma.consultation.create({
    data,
  })

  return NextResponse.json(consultation, { status: 201 })
}