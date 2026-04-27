"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/constants"
import { Calendar, Search } from "lucide-react"

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的预约</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-4 h-12 w-12" />
            <p>暂无预约记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const statusInfo = STATUS_MAP[b.status] || { label: b.status, color: "bg-gray-500" }
            return (
              <Card key={b.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{b.name}</CardTitle>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><span className="text-sm text-muted-foreground">电话：</span>{b.phone}</div>
                    {b.company && <div><span className="text-sm text-muted-foreground">公司：</span>{b.company}</div>}
                    <div><span className="text-sm text-muted-foreground">检测项目：</span>{b.serviceType}</div>
                    {b.sampleName && <div><span className="text-sm text-muted-foreground">样品：</span>{b.sampleName}</div>}
                    {b.quantity && <div><span className="text-sm text-muted-foreground">数量：</span>{b.quantity}</div>}
                    <div><span className="text-sm text-muted-foreground">预约时间：</span>{formatDateTime(b.createdAt)}</div>
                  </div>
                  {b.remark && (
                    <div className="mt-3 rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">备注：{b.remark}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}