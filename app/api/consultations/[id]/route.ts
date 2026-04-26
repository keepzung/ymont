import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await params
  const consultation = await prisma.consultation.findUnique({
    where: { id },
  })

  if (!consultation) return NextResponse.json({ error: "不存在" }, { status: 404 })

  return NextResponse.json(consultation)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { reply } = body

  const consultation = await prisma.consultation.update({
    where: { id },
    data: { reply, status: reply ? "REPLIED" : undefined },
  })

  return NextResponse.json(consultation)
}