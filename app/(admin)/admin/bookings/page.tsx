"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/constants"
import { Calendar, Search, CheckCircle, XCircle } from "lucide-react"

type Booking = {
  id: string
  name: string
  company: string | null
  phone: string
  email: string | null
  serviceType: string
  sampleName: string | null
  quantity: string | null
  remark: string | null
  status: string
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待处理", color: "bg-yellow-500" },
  CONFIRMED: { label: "已确认", color: "bg-blue-500" },
  COMPLETED: { label: "已完成", color: "bg-green-500" },
  CANCELLED: { label: "已取消", color: "bg-gray-500" },
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    if (filter !== "ALL" && b.status !== filter) return false
    if (search && !b.name.includes(search) && !b.phone.includes(search) && !b.serviceType.includes(search)) return false
    return true
  })

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (e) {
      alert("更新失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">预约管理</h1>
        <span className="text-sm text-muted-foreground">共 {bookings.length} 条预约</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索姓名、手机、项目..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select 
          className="rounded-lg border bg-card px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待处理</option>
          <option value="CONFIRMED">已确认</option>
          <option value="COMPLETED">已完成</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">暂无预约</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const statusInfo = STATUS_MAP[b.status] || { label: b.status, color: "bg-gray-500" }
            return (
              <Card key={b.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{b.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {b.company || "个人"} · {b.phone} · {formatDateTime(b.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><span className="text-sm text-muted-foreground">检测项目：</span>{b.serviceType}</div>
                      {b.sampleName && <div><span className="text-sm text-muted-foreground">样品：</span>{b.sampleName}</div>}
                      {b.quantity && <div><span className="text-sm text-muted-foreground">数量：</span>{b.quantity}</div>}
                      {b.email && <div><span className="text-sm text-muted-foreground">邮箱：</span>{b.email}</div>}
                    </div>
                    {b.remark && (
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm text-muted-foreground">备注：{b.remark}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {b.status === "PENDING" && (
                        <>
                          <Button size="sm" onClick={() => updateStatus(b.id, "CONFIRMED")}>
                            <CheckCircle className="mr-2 h-4 w-4" />确认
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "CANCELLED")}>
                            <XCircle className="mr-2 h-4 w-4" />取消
                          </Button>
                        </>
                      )}
                      {b.status === "CONFIRMED" && (
                        <Button size="sm" onClick={() => updateStatus(b.id, "COMPLETED")}>
                          完成
                        </Button>
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