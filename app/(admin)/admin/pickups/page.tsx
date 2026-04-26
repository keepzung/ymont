"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/constants"
import { Truck, Search, MapPin } from "lucide-react"

type Pickup = {
  id: string; name: string; phone: string; address: string | null
  province: string | null; city: string | null; district: string | null
  pickupDate: string | null; pickupTime: string | null; remark: string | null
  status: string; orderId: string; createdAt: string
  order: { orderNo: string; sampleName: string }
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待确认", color: "bg-yellow-500" },
  CONFIRMED: { label: "已确认", color: "bg-blue-500" },
  COLLECTING: { label: "取样中", color: "bg-purple-500" },
  COLLECTED: { label: "已取样", color: "bg-green-500" },
  CANCELLED: { label: "已取消", color: "bg-gray-500" },
}

export default function AdminPickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("ALL")

  useEffect(() => {
    fetch("/api/pickups")
      .then(r => r.json())
      .then(data => { setPickups(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = pickups.filter(p => {
    if (filter !== "ALL" && p.status !== filter) {
      return false
    }
    if (search && !p.order.orderNo.includes(search)) {
      return false
    }
    return true
  })

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/pickups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setPickups(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    } catch (e) {
      alert("更新失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">取样管理</h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索订单号..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select 
          className="rounded-lg border bg-card px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待确认</option>
          <option value="CONFIRMED">已确认</option>
          <option value="COLLECTING">取样中</option>
          <option value="COLLECTED">已取样</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">暂无取样请求</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => {
            const statusInfo = STATUS_MAP[p.status] || { label: p.status, color: "bg-gray-500" }
            return (
              <Card key={p.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">订单 {p.order.orderNo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      样品：{p.order.sampleName} · {formatDateTime(p.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><span className="text-sm text-muted-foreground">联系人：</span>{p.name}</div>
                      <div><span className="text-sm text-muted-foreground">电话：</span>{p.phone}</div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{[p.province, p.city, p.district, p.address].filter(Boolean).join(" ")}</span>
                      </div>
                      {p.pickupDate && (
                        <div><span className="text-sm text-muted-foreground">预约日期：</span>{p.pickupDate} {p.pickupTime}</div>
                      )}
                    </div>
                    {p.remark && (
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm text-muted-foreground">备注：{p.remark}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {p.status === "PENDING" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, "CONFIRMED")}>确认</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "CANCELLED")}>拒绝</Button>
                        </>
                      )}
                      {p.status === "CONFIRMED" && (
                        <Button size="sm" onClick={() => updateStatus(p.id, "COLLECTING")}>开始取样</Button>
                      )}
                      {p.status === "COLLECTING" && (
                        <Button size="sm" onClick={() => updateStatus(p.id, "COLLECTED")}>确认取样</Button>
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