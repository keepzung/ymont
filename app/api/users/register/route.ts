import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log("Registration attempt:", { name: body.name, email: body.email, phone: body.phone, role: body.role })
    
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const errorMessages = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      console.log("Validation error:", errorMessages)
      return NextResponse.json({ error: errorMessages || "填写信息有误，请检查格式" }, { status: 400 })
    }

    const { email, phone, password, name, role, company } = parsed.data

    if (!email && !phone) {
      return NextResponse.json({ error: "请填写邮箱或手机号，至少填写一个" }, { status: 400 })
    }

    // Check for existing user
    const existingConditions = []
    if (email) existingConditions.push({ email })
    if (phone) existingConditions.push({ phone })
    
    const existing = await prisma.user.findFirst({
      where: { OR: existingConditions },
    })
    
    if (existing) {
      if (existing.email === email && existing.phone === phone) {
        return NextResponse.json({ error: "该邮箱和手机号已注册，请直接登录" }, { status: 409 })
      } else if (existing.email === email) {
        return NextResponse.json({ error: "该邮箱已注册，请更换邮箱或直接登录" }, { status: 409 })
      } else if (existing.phone === phone) {
        return NextResponse.json({ error: "该手机号已注册，请更换手机号或直接登录" }, { status: 409 })
      }
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

    console.log("User created successfully:", user.id)
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    // Check for specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "该邮箱或手机号已被注册" }, { status: 409 })
    }
    if (error.code === 'P1001') {
      return NextResponse.json({ error: "数据库连接失败，请稍后重试" }, { status: 503 })
    }
    
    return NextResponse.json({ error: "注册失败：" + (error.message || "未知错误") }, { status: 500 })
  }
}
