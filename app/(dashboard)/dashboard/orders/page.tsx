"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ORDER_STATUS_MAP, formatCurrency, formatDate } from "@/lib/constants"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/components/auth-context"

type Order = {
  id: string; orderNo: string; status: string; sampleName: string
  totalAmount: number; discountAmount: number; finalAmount: number
  createdAt: string; orderItems: { service: { name: string } }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false
    if (search && !o.orderNo.toLowerCase().includes(search.toLowerCase()) && !o.sampleName.includes(search)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的订单</h1>
        <Link href="/dashboard/orders/new">
          <Button><Plus className="mr-2 h-4 w-4" />新建订单</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索订单号或样品名称" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            {Object.entries(ORDER_STATUS_MAP).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">暂无订单</p>
            <Link href="/dashboard/orders/new"><Button className="mt-4">新建检测订单</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "text-gray-600" }
            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{order.orderNo}</CardTitle>
                    <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{order.sampleName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderItems.map((oi) => oi.service.name).join("、")}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(order.finalAmount)}</p>
                        {order.discountAmount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">{formatCurrency(order.totalAmount)}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Button variant="outline" size="sm">查看详情</Button>
                    </Link>
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
