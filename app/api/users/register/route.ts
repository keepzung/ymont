import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const errorMessages = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      return NextResponse.json({ error: errorMessages || "填写信息有误" }, { status: 400 })
    }

    const { email, phone, password, name, role, company } = parsed.data

    if (!email && !phone) {
      return NextResponse.json({ error: "请输入邮箱或手机号" }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [
        email ? { email } : undefined,
        phone ? { phone } : undefined
      ].filter(Boolean) },
    })
    
    if (existing) {
      return NextResponse.json({ error: "邮箱或手机号已注册" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { 
        email: email || null, 
        phone: phone || null, 
        password: hashedPassword, 
        name, 
        role, 
        company: company || null 
      },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 })
  }
}
