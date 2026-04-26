import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const where = session.user.role === "ADMIN" ? {} : { userId: session.user.id }

  const consultations = await prisma.consultation.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(consultations)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const body = await req.json()
  const { name, phone, email, subject, message } = body

  const consultation = await prisma.consultation.create({
    data: {
      userId: session.user.id,
      name,
      phone,
      email,
      subject,
      message,
    },
  })

  return NextResponse.json(consultation, { status: 201 })
}