import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, password } = body

    if (!password || (!email && !phone)) {
      return NextResponse.json({ error: "请提供邮箱/手机号和密码" }, { status: 400 })
    }

    // Find user
    let user = null
    if (email) {
      user = await prisma.user.findUnique({ where: { email } })
    } else if (phone) {
      user = await prisma.user.findUnique({ where: { phone } })
    }

    if (!user || !user.password) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 })
    }

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}:${user.role}`).toString("base64")

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

    // Set session cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "登录失败" }, { status: 500 })
  }
}