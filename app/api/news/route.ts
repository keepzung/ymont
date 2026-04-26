import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  })
  return NextResponse.json(news)
}
