"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, login, loginWithPhone, loading: authLoading } = useAuth()
  
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, authLoading, router])

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    if (!email || !password) {
      setErrorMsg("请输入邮箱和密码")
      setLoading(false)
      return
    }

    setSuccessMsg("正在登录...")
    const result = await login(email, password)

    if (!result.success) {
      setErrorMsg(result.error || "邮箱或密码错误")
      setSuccessMsg("")
      setLoading(false)
    } else {
      const target = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"
      setSuccessMsg("登录成功...")
      router.push(target)
    }
  }

  async function handlePhoneLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    if (!phone || !password) {
      setErrorMsg("请输入手机号和密码")
      setLoading(false)
      return
    }

    setSuccessMsg("正在登录...")
    const result = await loginWithPhone(phone, password)

    if (!result.success) {
      setErrorMsg(result.error || "手机号或密码错误")
      setSuccessMsg("")
      setLoading(false)
    } else {
      const target = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"
      setSuccessMsg("登录成功...")
      router.push(target)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-2 flex items-center gap-2 whitespace-nowrap">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">W</span>
            </div>
            <span className="text-xl font-bold">瓦茨实验室</span>
          </Link>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>登录您的账户管理订单和报告</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {successMsg}
            </div>
          )}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">邮箱登录</TabsTrigger>
              <TabsTrigger value="phone">手机号登录</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input id="email" type="email" placeholder="请输入邮箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input id="phone" type="tel" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-password">密码</Label>
                  <div className="relative">
                    <Input id="phone-password" type={showPassword ? "text" : "password"} placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            还没有账户？{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}