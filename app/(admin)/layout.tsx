"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard, FileText, Users, Newspaper, FlaskConical,
  MessageSquare, LogOut, Calendar, Truck, MessageCircle,
} from "lucide-react"

const adminItems = [
  { label: "概览", href: "/admin", icon: LayoutDashboard },
  { label: "订单管理", href: "/admin/orders", icon: FileText },
  { label: "预约管理", href: "/admin/bookings", icon: Calendar },
  { label: "上门取样", href: "/admin/pickups", icon: Truck },
  { label: "用户管理", href: "/admin/users", icon: Users },
  { label: "检测分类", href: "/admin/services/categories", icon: FlaskConical },
  { label: "检测项目", href: "/admin/services", icon: FlaskConical },
  { label: "报告管理", href: "/admin/reports", icon: FlaskConical },
  { label: "咨询管理", href: "/admin/consultations", icon: MessageSquare },
  { label: "意见反馈", href: "/admin/feedback", icon: MessageCircle },
  { label: "新闻管理", href: "/admin/news", icon: Newspaper },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 flex flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 whitespace-nowrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">W</span>
            </div>
            <span className="font-bold">管理后台</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {adminItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />
        <div className="p-2">
          {user && (
            <div className="mb-2 px-3 py-2 text-sm">
              <p className="font-medium truncate">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground">管理员</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />退出登录
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  )
}