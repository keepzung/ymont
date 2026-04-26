"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { USER_ROLE_MAP } from "@/lib/constants"
import { Save } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    phone: "",
    company: "",
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        update()
      }
    } catch {}
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">个人信息</h1>

      <Card>
        <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>邮箱</Label>
              <Input value={session?.user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>用户类型</Label>
              <Input value={USER_ROLE_MAP[(session?.user as any)?.role] || "个人用户"} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">公司/机构</Label>
              <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />{saving ? "保存中..." : "保存修改"}
            </Button>
            {saved && <span className="text-sm text-green-600">保存成功</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>修改密码</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input id="currentPassword" type="password" placeholder="输入当前密码" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input id="newPassword" type="password" placeholder="输入新密码" />
            </div>
          </div>
          <Button variant="outline">更新密码</Button>
        </CardContent>
      </Card>
    </div>
  )
}
