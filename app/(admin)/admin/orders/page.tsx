"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ORDER_STATUS_MAP, formatDate, formatCurrency } from "@/lib/constants"
import { FileText, Search, Upload, CheckCircle } from "lucide-react"

type Order = {
  id: string; orderNo: string; status: string; sampleName: string
  totalAmount: number; finalAmount: number; createdAt: string
  user: { name: string | null; phone: string | null }
  orderItems: { service: { name: string } }[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [updateDialog, setUpdateDialog] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false
    if (search && !o.orderNo.includes(search) && !o.sampleName.includes(search)) return false
    return true
  })

  async function handleUpdateStatus() {
    if (!updateDialog || !newStatus) return
    try {
      await fetch(`/api/admin/orders/${updateDialog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      setOrders(prev => prev.map(o => o.id === updateDialog.id ? { ...o, status: newStatus } : o))
      setUpdateDialog(null)
      setNewStatus("")
    } catch (e) {
      alert("更新失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">订单管理</h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索订单号或样品..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select 
          className="rounded-lg border bg-card px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          {Object.entries(ORDER_STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">暂无订单</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const statusInfo = ORDER_STATUS_MAP[o.status] || { label: o.status, color: "text-gray-600" }
            return (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{o.orderNo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {o.user.name || "用户"} · {o.user.phone || "无电话"} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><span className="text-sm text-muted-foreground">样品名称：</span>{o.sampleName}</div>
                      <div><span className="text-sm text-muted-foreground">检测项目：</span>
                        {o.orderItems.map(oi => oi.service.name).join("、")}
                      </div>
                      <div><span className="text-sm text-muted-foreground">订单金额：</span>{formatCurrency(o.finalAmount)}</div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Dialog open={!!updateDialog} onOpenChange={setUpdateDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setUpdateDialog(o)}>
                            <FileText className="mr-2 h-4 w-4" />更新状态
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>更新订单状态 - {updateDialog?.orderNo}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">新状态</label>
                              <select 
                                className="w-full rounded-lg border bg-card px-3 py-2"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                              >
                                <option value="">选择状态</option>
                                {Object.entries(ORDER_STATUS_MAP).map(([k, v]) => (
                                  <option key={k} value={k}>{v.label}</option>
                                ))}
                              </select>
                            </div>
                            <Button className="w-full" onClick={handleUpdateStatus}>
                              <CheckCircle className="mr-2 h-4 w-4" />确认更新
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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