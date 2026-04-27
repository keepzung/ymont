"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, ChevronDown, User, LogOut } from "lucide-react"

const navItems = [
  { label: "首页", href: "/" },
  {
    label: "元素检测",
    href: "/services",
    children: [
      { label: "XRF荧光光谱", href: "/services?cat=xrf" },
      { label: "ICP-MS质谱", href: "/services?cat=icp" },
      { label: "原子吸收光谱", href: "/services?cat=aas" },
      { label: "X射线衍射", href: "/services?cat=xrd" },
      { label: "查看全部检测项目", href: "/services" },
    ],
  },
  {
    label: "矿物分析",
    href: "/services",
    children: [
      { label: "矿物鉴定", href: "/services?cat=mineral" },
      { label: "品位分析", href: "/services?cat=grade" },
      { label: "物相分析", href: "/services?cat=phase" },
    ],
  },
  { label: "送检指南", href: "/guide" },
  { label: "定价下单", href: "/pricing" },
  {
    label: "一站式服务",
    href: "/services",
    children: [
      { label: "立即下单", href: "/booking" },
      { label: "立即预约", href: "/booking" },
      { label: "一站式矿业技术", href: "/services" },
    ],
  },
  { label: "关于我们", href: "/about" },
  {
    label: "加入我们",
    href: "/careers",
    children: [
      { label: "诚邀代理", href: "/careers" },
      { label: "招聘信息", href: "/careers" },
    ],
  },
  { label: "在线咨询", href: "/consulting" },
  { label: "新闻动态", href: "/news" },
  { label: "常见问题", href: "/faq" },
  { label: "矿业服务", href: "/mining" },
  { label: "意见反馈", href: "/feedback" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  async function handleLogout() {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">W</span>
            </div>
            <span className="text-xl font-bold text-foreground">瓦茨实验室</span>
          </Link>

          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                    pathname === item.href ? "text-foreground bg-muted" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-border bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a href="tel:18600104701" className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <Phone className="h-4 w-4 text-primary" />
              18600104701
            </a>
            
            {loading ? (
              <Button variant="outline" size="sm" disabled>加载中...</Button>
            ) : user ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-4 w-4" />
                  {user.name || user.email}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card py-2 shadow-lg">
                    <Link 
                      href={isAdmin ? "/admin" : "/dashboard"} 
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {isAdmin ? "管理后台" : "我的订单"}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">登录</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="打开菜单"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-muted hover:text-foreground ${
                    pathname === item.href ? "text-foreground bg-muted" : "text-foreground/80"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/60 hover:bg-muted hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="flex-1 rounded-md border px-3 py-2 text-center"
                >
                  退出登录
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">登录</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button size="sm" className="w-full">注册</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}