import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth-helper"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { result, error } = await requireAdmin(req)
  if (error) return error

  const { id } = await params
  const news = await prisma.news.findUnique({
    where: { id },
  })

  if (!news) return NextResponse.json({ error: "新闻不存在" }, { status: 404 })
  return NextResponse.json(news)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { result, error } = await requireAdmin(req)
  if (error) return error

  const { id } = await params
  const body = await req.json()

  const news = await prisma.news.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(news)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { result, error } = await requireAdmin(req)
  if (error) return error

  const { id } = await params
  await prisma.news.delete({ where: { id } })

  return NextResponse.json({ success: true })
}