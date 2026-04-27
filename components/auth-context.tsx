"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  id: string
  email: string
  phone?: string
  name?: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>
  loginWithPhone: (phone: string, password: string) => Promise<{success: boolean, error?: string}>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      }
    } catch (e) {
      console.error("Session check failed", e)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    
    if (data.success) {
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error || "登录失败" }
  }

  async function loginWithPhone(phone: string, password: string) {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    })
    const data = await res.json()
    
    if (data.success) {
      setUser(data.user)
      return { success: true }
    }
    return { success: false, error: data.error || "登录失败" }
  }

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" })
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithPhone, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}