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
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  
  // Admin can see all consultations
  if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
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
  if (user) {
    const consultations = await prisma.consultation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(consultations)
  }

  // Guest can submit but not view
  if (!user && req.method === "POST") {
    return POST(req)
  }
  
  return NextResponse.json({ error: "请先登录" }, { status: 401 })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  const body = await req.json()
  const { name, phone, email, subject, message, type } = body

  if (!subject || !message) {
    return NextResponse.json({ error: "主题和内容必填" }, { status: 400 })
  }

  const data: any = {
    name: name || null,
    phone: phone || null,
    email: email || null,
    subject,
    message,
    type: type || "consultation",
  }

  if (user) {
    data.userId = user.id
  }

  const consultation = await prisma.consultation.create({
    data,
  })

  return NextResponse.json(consultation, { status: 201 })
}