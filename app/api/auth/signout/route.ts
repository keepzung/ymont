import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST() {
  try {
    await signOut()
    return NextResponse.json({ success: true, message: "Signed out" })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ error: "Error signing out" }, { status: 500 })
  }
}