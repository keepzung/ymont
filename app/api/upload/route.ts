import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token, "base64").toString()
    const [userId] = decoded.split(":")
    
    if (!userId) return null
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true }
    })
    
    return user
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  
  // Only logged in users can upload
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return NextResponse.json({ error: "请选择文件" }, { status: 400 })
  }

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760")
  if (file.size > maxSize) {
    return NextResponse.json({ error: "文件过大" }, { status: 400 })
  }

  // Security: validate file type
  const allowedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".zip", ".rar"]
  const ext = path.extname(file.name).toLowerCase()
  if (!allowedTypes.includes(ext)) {
    return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 })
  }

  const uploadDir = process.env.UPLOAD_DIR || "./uploads"
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
  const filepath = path.join(uploadDir, filename)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(filepath, buffer)

  return NextResponse.json({ url: `/uploads/${filename}`, filename })
}