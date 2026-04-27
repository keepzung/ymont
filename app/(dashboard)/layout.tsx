"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import {
  LayoutDashboard, FileText, FlaskConical, User, MessageSquare,
  LogOut, ChevronLeft, ChevronRight, Calendar, Truck,
} from "lucide-react"
import { useState } from "react"

const sidebarItems = [
  { label: "概览", href: "/dashboard", icon: LayoutDashboard },
  { label: "我的订单", href: "/dashboard/orders", icon: FileText },
  { label: "预约管理", href: "/dashboard/bookings", icon: Calendar },
  { label: "上门取样", href: "/dashboard/pickups", icon: Truck },
  { label: "检测报告", href: "/dashboard/reports", icon: FlaskConical },
  { label: "在线咨询", href: "/dashboard/consulting", icon: MessageSquare },
  { label: "个人信息", href: "/dashboard/profile", icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    router.push("/admin")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  async function handleLogout() {
    await logout()
  }

  return (
    <div className="flex min-h-screen">
      <aside className={`${collapsed ? "w-16" : "w-60"} flex flex-col border-r border-border bg-card transition-all duration-200`}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">W</span>
              </div>
              <span className="font-bold">用户中心</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />
        <div className="p-2">
          {!collapsed && user && (
            <div className="mb-2 px-3 py-2 text-sm">
              <p className="font-medium truncate">{user.name || user.email}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            {!collapsed && "退出登录"}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  )
}