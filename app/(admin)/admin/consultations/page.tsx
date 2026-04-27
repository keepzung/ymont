"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ORDER_STATUS_MAP, formatDate } from "@/lib/constants"
import { MessageSquare, Search, Loader2, Send } from "lucide-react"

type Consultation = {
  id: string
  subject: string
  message: string
  reply: string | null
  status: string
  type: string
  createdAt: string
  name: string | null
  email: string | null
  phone: string | null
  user: { name: string | null; email: string | null } | null
}

const statusMap: Record<string, { label: string; color: string }> = {
  OPEN: { label: "待处理", color: "bg-yellow-500" },
  REPLIED: { label: "已回复", color: "bg-green-500" },
  CLOSED: { label: "已关闭", color: "bg-gray-500" },
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [detailDialog, setDetailDialog] = useState<Consultation | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchData()
  }, [search, statusFilter])

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      
      const res = await fetch(`/api/consultations?${params}`)
      const data = await res.json()
      setConsultations(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleReply(id: string) {
    if (!replyText.trim()) return
    setSending(true)
    try {
      await fetch(`/api/consultations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      })
      setReplyText("")
      setDetailDialog(null)
      fetchData()
    } catch (e) { console.error(e) }
    finally { setSending(false) }
  }

  const filtered = consultations.filter(c => {
    if (search && !c.subject.includes(search) && !c.message.includes(search)) return false
    if (statusFilter !== "all" && c.status !== statusFilter) return false
    return true
  })

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">咨询管理</h1>
          <p className="text-muted-foreground">管理用户咨询和回复</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索咨询..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select 
          className="rounded-lg border bg-card px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">全部状态</option>
          <option value="OPEN">待处理</option>
          <option value="REPLIED">已回复</option>
          <option value="CLOSED">已关闭</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              暂无咨询
            </CardContent>
          </Card>
        ) : (
          filtered.map(c => (
            <Card key={c.id} className="cursor-pointer" onClick={() => setDetailDialog(c)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{c.subject}</CardTitle>
                  <Badge className={statusMap[c.status]?.color}>{statusMap[c.status]?.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{c.message}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.name || c.user?.name || "匿名用户"}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!detailDialog} onOpenChange={(open) => { if (!open) setDetailDialog(null) }}>
        <DialogContent className="max-w-2xl">
          {detailDialog && (
            <>
              <DialogHeader>
                <DialogTitle>{detailDialog.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">用户留言</p>
                  <p className="mt-2 text-sm">{detailDialog.message}</p>
                  <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                    <span>姓名: {detailDialog.name || detailDialog.user?.name || "-"}</span>
                    <span>邮箱: {detailDialog.email || detailDialog.user?.email || "-"}</span>
                    <span>电话: {detailDialog.phone || "-"}</span>
                  </div>
                </div>

                {detailDialog.reply && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-700">官方回复</p>
                    <p className="mt-2 text-sm">{detailDialog.reply}</p>
                  </div>
                )}

                {detailDialog.status !== "REPLIED" && detailDialog.status !== "CLOSED" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">回复内容</label>
                    <textarea 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="请输入回复内容..."
                    />
                    <Button onClick={() => handleReply(detailDialog.id)} disabled={sending || !replyText.trim()}>
                      {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      发送��复
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}