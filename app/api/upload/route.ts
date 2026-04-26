import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "未登录" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "请选择文件" }, { status: 400 })

  const maxSize = parseInt(process.env.MAX_FILE_SIZE || "10485760")
  if (file.size > maxSize) return NextResponse.json({ error: "文件过大" }, { status: 400 })

  const uploadDir = process.env.UPLOAD_DIR || "./uploads"
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name)
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
  const filepath = path.join(uploadDir, filename)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(filepath, buffer)

  return NextResponse.json({ url: `/uploads/${filename}`, filename })
}
