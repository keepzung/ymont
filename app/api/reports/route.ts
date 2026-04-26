import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    include: { order: { select: { orderNo: true, sampleName: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reports)
}
