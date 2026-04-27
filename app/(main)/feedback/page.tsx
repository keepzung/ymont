"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Send, CheckCircle, Loader2, MessageSquare } from "lucide-react"

export default function FeedbackPage() {
  const [form, setForm] = useState({
    type: "other",
    title: "",
    content: "",
    contact: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.content) return
    
    setSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      
      if (res.ok) {
        setSuccess(true)
        setForm({ type: "other", title: "", content: "", contact: "" })
      }
    } catch {}
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-green-600">提交成功</h2>
            <p className="mt-2 text-muted-foreground">感谢您的反馈，我们会尽快处理</p>
            <Button className="mt-4" onClick={() => setSuccess(false)}>再次提交</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">投诉建议</Badge>
        <h1 className="text-3xl font-bold">投诉与建议</h1>
        <p className="mt-2 text-muted-foreground">您的意见对我们很重要，期待您的反馈</p>
      </div>

      <Card>
        <CardHeader><CardTitle>提交反馈</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">反馈类型</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="complaint">投诉</SelectItem>
                  <SelectItem value="suggestion">建议</SelectItem>
                  <SelectItem value="bug">Bug反馈</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                placeholder="简要描述" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">详细内容</Label>
              <Textarea 
                id="content" 
                placeholder="请详细描述您的问题或建议" 
                className="min-h-[120px]"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">联系方式（选填）</Label>
              <Input 
                id="contact" 
                placeholder="手机号或邮箱，便于我们回复您" 
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })} 
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {submitting ? "提交中..." : "提交反馈"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader><CardTitle>其他联系方式</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">电话</p>
              <p className="text-sm text-muted-foreground">18600104701</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">邮箱</p>
              <p className="text-sm text-muted-foreground">info@ymont.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}