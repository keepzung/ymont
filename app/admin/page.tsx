"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  FileText, Search, Eye, CheckCircle, XCircle, MessageSquare, Loader2 
} from "lucide-react"
import Link from "next/link"

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "待支付", color: "bg-yellow-500" },
  PENDING_SAMPLE: { label: "待送样", color: "bg-orange-500" },
  SAMPLE_RECEIVED: { label: "已收样", color: "bg-blue-500" },
  TESTING: { label: "检测中", color: "bg-purple-500" },
  DATA_ANALYSIS: { label: "数据分析", color: "bg-indigo-500" },
  REPORT_READY: { label: "报告待取", color: "bg-cyan-500" },
  COMPLETED: { label: "已完成", color: "bg-green-500" },
  CANCELLED: { label: "已取消", color: "bg-red-500" },
  REFUNDED: { label: "已退款", color: "bg-gray-500" },
}

export default function AdminPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [search, statusFilter])

  async function fetchOrders() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="text-muted-foreground">超级管理员后台</p>
        </div>
        <div className="text-sm text-muted-foreground">
          当前用户：{session?.user?.name || session?.user?.email}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索订单号、样��名称..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(statusMap).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>样品名称</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>下单时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    暂无订单
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                    <TableCell>
                      <div className="text-sm">{order.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    </TableCell>
                    <TableCell>{order.sampleName}</TableCell>
                    <TableCell>¥{order.finalAmount}</TableCell>
                    <TableCell>
                      <Badge className={statusMap[order.status]?.color}>
                        {statusMap[order.status]?.label || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Select 
                          value={order.status} 
                          onValueChange={(v) => updateStatus(order.id, v)}
                          disabled={updating === order.id}
                        >
                          <SelectTrigger className="w-32" disabled={updating === order.id}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(statusMap).map((key) => (
                              <SelectItem key={key} value={key}>
                                {statusMap[key].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}