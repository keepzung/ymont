import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ authenticated: false })
  }

  try {
    const [userId] = Buffer.from(token, "base64").toString().split(":")
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}