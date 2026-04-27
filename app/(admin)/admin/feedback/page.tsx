"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDateTime } from "@/lib/constants"
import { Search, MessageSquare, Send, CheckCircle } from "lucide-react"

type Feedback = {
  id: string
  type: string
  title: string
  content: string
  contact: string | null
  status: string
  reply: string | null
  createdAt: string
  user: { name: string | null; email: string | null } | null
}

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  complaint: { label: "投诉", color: "bg-red-500" },
  suggestion: { label: "建议", color: "bg-blue-500" },
  bug: { label: "Bug反馈", color: "bg-orange-500" },
  other: { label: "其他", color: "bg-gray-500" },
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待处理", color: "bg-yellow-500" },
  READ: { label: "已读", color: "bg-blue-500" },
  REPLIED: { label: "已回复", color: "bg-green-500" },
  RESOLVED: { label: "已解决", color: "bg-gray-500" },
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/feedback?status=${filter}`)
      .then(r => r.json())
      .then(data => { setFeedbacks(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter])

  async function handleReply(id: string) {
    if (!replyContent.trim()) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyContent, status: "REPLIED" }),
      })
      
      if (res.ok) {
        const updated = await res.json()
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, reply: updated.reply, status: "REPLIED" } : f))
        setSelectedFeedback({ ...selectedFeedback!, reply: updated.reply, status: "REPLIED" })
        setReplyContent("")
      }
    } catch {}
    setSubmitting(false)
  }

  async function handleMarkResolved(id: string) {
    await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESOLVED" }),
    })
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: "RESOLVED" } : f))
    if (selectedFeedback?.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status: "RESOLVED" })
    }
  }

  const filtered = feedbacks.filter(f => {
    if (search && !f.title.includes(search) && !f.content.includes(search)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">意见反馈管理</h1>
        <span className="text-sm text-muted-foreground">共 {feedbacks.length} 条反馈</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索反馈标题/内容" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            <SelectItem value="PENDING">待处理</SelectItem>
            <SelectItem value="READ">已读</SelectItem>
            <SelectItem value="REPLIED">已回复</SelectItem>
            <SelectItem value="RESOLVED">已解决</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">暂无反馈</CardContent></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            {filtered.map(f => {
              const typeInfo = TYPE_MAP[f.type] || { label: f.type, color: "bg-gray-500" }
              const statusInfo = STATUS_MAP[f.status] || { label: f.status, color: "bg-gray-500" }
              return (
                <Card key={f.id} className={`cursor-pointer transition-all ${selectedFeedback?.id === f.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedFeedback(f)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                        <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(f.createdAt)}</span>
                    </div>
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{f.content}</p>
                    {f.user && <p className="mt-2 text-xs text-muted-foreground">来自：{f.user.name || f.user.email}</p>}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div>
            {selectedFeedback ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedFeedback.title}</CardTitle>
                    {selectedFeedback.status !== "RESOLVED" && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkResolved(selectedFeedback.id)}>
                        <CheckCircle className="mr-1 h-4 w-4" />标记解决
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">反馈内容</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedFeedback.content}</p>
                  </div>
                  
                  {selectedFeedback.contact && (
                    <div>
                      <p className="text-sm font-medium">联系方式</p>
                      <p className="mt-1 text-sm">{selectedFeedback.contact}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">状态</p>
                    <Badge className="mt-1">{STATUS_MAP[selectedFeedback.status]?.label}</Badge>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium">回复反馈</p>
                    <Textarea 
                      className="mt-2" 
                      rows={4} 
                      placeholder="输入回复内容..." 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button 
                      className="mt-2" 
                      onClick={() => handleReply(selectedFeedback.id)}
                      disabled={submitting || !replyContent.trim()}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {submitting ? "提交中..." : "提交回复"}
                    </Button>
                  </div>

                  {selectedFeedback.reply && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium">回复内容</p>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedFeedback.reply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12" />
                  <p>选择一个反馈查看详情</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}