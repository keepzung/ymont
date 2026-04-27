"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/constants"
import { Truck, MapPin, Calendar } from "lucide-react"

type Pickup = {
  id: string
  name: string
  phone: string
  address: string | null
  province: string | null
  city: string | null
  district: string | null
  pickupDate: string | null
  pickupTime: string | null
  remark: string | null
  status: string
  createdAt: string
  order: { orderNo: string; sampleName: string | null }
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待处理", color: "bg-yellow-500" },
  CONFIRMED: { label: "已确认", color: "bg-blue-500" },
  COMPLETED: { label: "已完成", color: "bg-green-500" },
  CANCELLED: { label: "已取消", color: "bg-gray-500" },
}

export default function PickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pickups")
      .then(r => r.json())
      .then(data => { setPickups(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">上门取样</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : pickups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Truck className="mx-auto mb-4 h-12 w-12" />
            <p>暂无上门取样记录</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pickups.map((p) => {
            const statusInfo = STATUS_MAP[p.status] || { label: p.status, color: "bg-gray-500" }
            const fullAddress = [p.province, p.city, p.district, p.address].filter(Boolean).join("")
            return (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">订单号：{p.order?.orderNo}</CardTitle>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><span className="text-sm text-muted-foreground">联系人：</span>{p.name}</div>
                    <div><span className="text-sm text-muted-foreground">电话：</span>{p.phone}</div>
                    {fullAddress && (
                      <div className="sm:col-span-2">
                        <span className="text-sm text-muted-foreground">取样地址：</span>
                        <span className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {fullAddress}
                        </span>
                      </div>
                    )}
                    {p.pickupDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{p.pickupDate} {p.pickupTime}</span>
                      </div>
                    )}
                    <div><span className="text-sm text-muted-foreground">预约时间：</span>{formatDateTime(p.createdAt)}</div>
                  </div>
                  {p.remark && (
                    <div className="mt-3 rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">备注：{p.remark}</p>
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