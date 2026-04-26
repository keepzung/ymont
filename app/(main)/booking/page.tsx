"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle } from "lucide-react"

const serviceTypes = [
  "XRF荧光光谱分析",
  "ICP-MS质谱分析",
  "X射线衍射XRD",
  "原子吸收光谱AAS",
  "稀土元素分析",
  "矿物鉴定",
  "其他检测项目",
]

export default function BookingPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    serviceType: "",
    sampleName: "",
    quantity: "",
    remark: "",
  })

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.serviceType) {
      alert("请填写姓名、手机和检测项目")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert("提交失败，请稍后重试")
      }
    } catch {
      alert("网络错误")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">预约提交成功</h2>
            <p className="mt-2 text-muted-foreground">
              感谢您的预约，客服将尽快与您联系确认
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              联系电话：18600104701
            </p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <Badge className="mb-4">在线预约</Badge>
        <h1 className="text-3xl font-bold">预约检测服务</h1>
        <p className="mt-2 text-muted-foreground">填写以下信息，客服将第一时间与您联系确认</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>预约信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                placeholder="您的姓名"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">公司/单位</Label>
              <Input
                id="company"
                placeholder="公司名称（可选）"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号码 *</Label>
              <Input
                id="phone"
                placeholder="您的手机号"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="邮箱（可选）"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">检测项目 *</Label>
            <select
              id="serviceType"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              required
            >
              <option value="">请选择检测项目</option>
              {serviceTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sampleName">样品名称</Label>
              <Input
                id="sampleName"
                placeholder="如：铁矿石"
                value={form.sampleName}
                onChange={(e) => setForm({ ...form, sampleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">样品数量</Label>
              <Input
                id="quantity"
                placeholder="如：5个"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              placeholder="其他需要说明的事项"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "提交中..." : "提交预约"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>联系方式</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>电话：18600104701</p>
          <p>邮箱：info@ymont.com</p>
          <p>工作时间：周一至周五 9:00-18:00</p>
        </CardContent>
      </Card>
    </div>
  )
}