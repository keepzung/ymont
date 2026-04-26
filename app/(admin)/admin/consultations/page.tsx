"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/constants"
import { MessageSquare, Search, Reply, Check } from "lucide-react"

type Consultation = {
  id: string; subject: string; message: string; reply: string | null
  status: string; name: string | null; phone: string | null; email: string | null
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  OPEN: { label: "待处理", color: "bg-yellow-500" },
  REPLIED: { label: "已回复", color: "bg-green-500" },
  CLOSED: { label: "已关闭", color: "bg-gray-500" },
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [replyDialog, setReplyDialog] = useState<Consultation | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    fetch("/api/consultations")
      .then(r => r.json())
      .then(data => { setConsultations(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = consultations.filter(c =>
    c.subject.includes(search) || c.message.includes(search) || (c.name && c.name.includes(search))
  )

  async function handleReply() {
    if (!replyDialog || !replyContent.trim()) return
    try {
      await fetch(`/api/consultations/${replyDialog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyContent }),
      })
      setConsultations(prev => prev.map(c => 
        c.id === replyDialog.id ? { ...c, reply: replyContent, status: "REPLIED" } : c
      ))
      setReplyDialog(null)
      setReplyContent("")
    } catch (e) {
      alert("回复失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">咨询管理</h1>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索咨询..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">暂无咨询</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const statusInfo = STATUS_MAP[c.status] || { label: c.status, color: "bg-gray-500" }
            return (
              <Card key={c.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{c.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {c.name || "匿名用户"} · {c.phone || "无电话"} · {formatDateTime(c.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm">{c.message}</p>
                    </div>
                    {c.reply && (
                      <div className="rounded-lg bg-primary/5 p-4">
                        <p className="text-sm font-medium">回复：</p>
                        <p className="text-sm text-muted-foreground mt-1">{c.reply}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {c.status === "OPEN" && (
                        <Dialog open={!!replyDialog} onOpenChange={setReplyDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setReplyDialog(c)}>
                              <Reply className="mr-2 h-4 w-4" />回复
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>回复咨询</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="rounded-lg bg-muted/50 p-4">
                                <p className="text-sm">{c.message}</p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">回复内容</label>
                                <Textarea 
                                  value={replyContent} 
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="请输入回复内容..."
                                  className="min-h-[120px]"
                                />
                              </div>
                              <Button className="w-full" onClick={handleReply}>
                                <Check className="mr-2 h-4 w-4" />发送回复
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}