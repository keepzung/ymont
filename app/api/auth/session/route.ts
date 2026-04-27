import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId, role] = decoded.split(":")
    
    if (!userId) {
      return NextResponse.json({ user: null })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ user: null })
  }
}