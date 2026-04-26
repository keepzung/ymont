"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Mail, Clock, Send } from "lucide-react"

export default function ConsultingPublicPage() {
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">在线咨询</Badge>
        <h1 className="text-3xl font-bold">在线咨询</h1>
        <p className="mt-2 text-muted-foreground">有任何问题？我们随时为您解答</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        {[
          { icon: Phone, title: "电话咨询", value: "18600104701", desc: "工作日 9:00-18:00" },
          { icon: Mail, title: "邮件咨询", value: "info@ymont.com", desc: "24小时内回复" },
          { icon: Clock, title: "在线留言", value: "即时提交", desc: "1个工作日内回复" },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="pt-6 text-center">
              <item.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 font-medium text-primary">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />留言咨询</CardTitle></CardHeader>
        <CardContent>
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">提交成功</h3>
              <p className="mt-2 text-muted-foreground">我们将在1个工作日内回复您</p>
              <Button className="mt-4" variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", contact: "", subject: "", message: "" }) }}>
                继续咨询
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">您的姓名</Label>
                  <Input id="name" placeholder="请输入姓名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">联系方式</Label>
                  <Input id="contact" placeholder="手机号或邮箱" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">咨询主题</Label>
                <Input id="subject" placeholder="简要描述您的问题" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">详细描述</Label>
                <Textarea id="message" placeholder="请详细描述您的问题" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />提交咨询
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
