"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: "INDIVIDUAL" as string, company: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    if (!form.name) {
      setErrorMsg("请填写姓名")
      return
    }
    if (!form.email && !form.phone) {
      setErrorMsg("请填写邮箱或手机号，至少填写一个")
      return
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("两次输入的密码不一致")
      return
    }
    if (form.password.length < 6) {
      setErrorMsg("密码至少需要6位")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      console.log("Register response:", res.status, data)

      if (!res.ok) {
        setErrorMsg(data.error || "注册失败，请检查信息是否填写正确")
        return
      }

      alert("注册成功！请登录")
      router.push("/login")
    } catch (err) {
      console.error("Register error:", err)
      setErrorMsg("网络错误，请检查网络后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">W</span>
          </div>
          <span className="text-xl font-bold">瓦茨实验室</span>
        </Link>
        <CardTitle className="text-2xl">注册</CardTitle>
        <CardDescription>创建账户开始使用检测服务</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">用户类型</Label>
            <Select value={form.role} onValueChange={(v) => updateForm("role", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIVIDUAL">个人用户</SelectItem>
                <SelectItem value="ENTERPRISE">企业用户</SelectItem>
                <SelectItem value="RESEARCH">科研机构</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="请输入姓名" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
          </div>
          {(form.role === "ENTERPRISE" || form.role === "RESEARCH") && (
            <div className="space-y-2">
              <Label htmlFor="company">{form.role === "ENTERPRISE" ? "公司名称" : "机构名称"}</Label>
              <Input id="company" placeholder={`请输入${form.role === "ENTERPRISE" ? "公司" : "机构"}名称`} value={form.company} onChange={(e) => updateForm("company", e.target.value)} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="请输入邮箱" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">手机号</Label>
            <Input id="phone" type="tel" placeholder="请输入手机号" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="至少6位" value={form.password} onChange={(e) => updateForm("password", e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input id="confirmPassword" type="password" placeholder="再次输入密码" value={form.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "注册中..." : "注册"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          已有账户？{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">立即登录</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
