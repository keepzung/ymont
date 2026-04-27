"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/constants"
import { Send, MessageSquare } from "lucide-react"

type Consultation = {
  id: string; subject: string; message: string; reply: string | null
  status: string; createdAt: string
}

export default function ConsultingPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [form, setForm] = useState({ subject: "", message: "" })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((data) => { setConsultations(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setConsultations([data, ...consultations])
        setForm({ subject: "", message: "" })
      }
    } catch {}
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">在线咨询</h1>

      <Card>
        <CardHeader><CardTitle>提交咨询</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">咨询主题</Label>
              <Input id="subject" placeholder="简要描述您的问题" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">详细描述</Label>
              <Textarea id="message" placeholder="请详细描述您的问题，至少10个字符" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" disabled={submitting}>
              <Send className="mr-2 h-4 w-4" />{submitting ? "提交中..." : "提交咨询"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">历史咨询</h2>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">加载中...</div>
        ) : consultations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">暂无咨询记录</p>
            </CardContent>
          </Card>
        ) : (
          consultations.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{c.subject}</h3>
                  <Badge variant={c.status === "OPEN" ? "secondary" : "default"}>
                    {c.status === "OPEN" ? "待回复" : c.status === "REPLIED" ? "已回复" : "已关闭"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{c.message}</p>
                <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                {c.reply && (
                  <div className="mt-3 rounded-lg bg-primary/5 p-3">
                    <p className="text-sm font-medium text-primary">回复：</p>
                    <p className="text-sm">{c.reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}