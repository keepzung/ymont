import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ authenticated: false })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any)?.role,
      }
    })
  } catch (error) {
    console.error("Session API error:", error)
    return NextResponse.json({ error: "Error getting session" }, { status: 500 })
  }
}