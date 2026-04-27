"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ORDER_STATUS_MAP, ORDER_STATUS_FLOW, formatCurrency, formatDateTime } from "@/lib/constants"
import { ArrowLeft, Download, CheckCircle, Circle, Loader } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"

type OrderDetail = {
  id: string; orderNo: string; status: string; sampleName: string
  sampleType: string | null; sampleWeight: string | null; sampleSize: string | null
  sampleDesc: string | null; remark: string | null; trackingNo: string | null
  totalAmount: number; discountAmount: number; finalAmount: number
  createdAt: string; reportedAt: string | null; completedAt: string | null
  orderItems: { id: string; price: number; subtotal: number; service: { name: string; instrument: string } }[]
  payments: { id: string; method: string; status: string; amount: number; paidAt: string | null }[]
  reports: { id: string; title: string; fileUrl: string | null; status: string }[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="py-12 text-center text-muted-foreground">加载中...</div>
  if (!order) return <div className="py-12 text-center text-muted-foreground">订单不存在</div>

  const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "text-gray-600" }
  const currentIndex = ORDER_STATUS_FLOW.findIndex(s => s.key === order.status)
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回
        </Button>
        <h1 className="text-2xl font-bold">订单详情</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>{order.orderNo}</CardTitle>
              <Badge variant="outline" className={statusInfo.color}>{statusInfo.label}</Badge>
            </div>
            <span className="text-sm text-muted-foreground">创建于 {formatDateTime(order.createdAt)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCancelled && (
            <div>
              <h3 className="mb-4 font-semibold">检测进度</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
                <div className="space-y-6">
                  {ORDER_STATUS_FLOW.map((step, index) => {
                    const isCompleted = index < currentIndex
                    const isCurrent = index === currentIndex
                    const isCancelled = false
                    return (
                      <div key={step.key} className="relative flex items-start gap-4 pl-2">
                        <div className="relative z-10">
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : isCurrent ? (
                            <Loader className="h-6 w-6 animate-spin text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className={`flex-1 ${isCurrent ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-40"}`}>
                          <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{step.label}</p>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              此订单已取消/退款
            </div>
          )}

          <Separator />

          <div>
            <h3 className="mb-3 font-semibold">样品信息</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><span className="text-sm text-muted-foreground">样品名称：</span>{order.sampleName}</div>
              {order.sampleType && <div><span className="text-sm text-muted-foreground">样品类型：</span>{order.sampleType}</div>}
              {order.sampleWeight && <div><span className="text-sm text-muted-foreground">样品重量：</span>{order.sampleWeight}</div>}
              {order.sampleSize && <div><span className="text-sm text-muted-foreground">粒度：</span>{order.sampleSize}</div>}
              {order.sampleDesc && <div><span className="text-sm text-muted-foreground">样品描述：</span>{order.sampleDesc}</div>}
              {order.trackingNo && <div><span className="text-sm text-muted-foreground">快递单号：</span>{order.trackingNo}</div>}
              {order.remark && <div><span className="text-sm text-muted-foreground">备注：</span>{order.remark}</div>}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 font-semibold">检测项目</h3>
            <div className="space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="font-medium">{item.service.name}</p>
                    <p className="text-sm text-muted-foreground">{item.service.instrument}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {isAdmin && (
          <div>
            <h3 className="mb-3 font-semibold">费用明细</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span>检测费用</span><span>{formatCurrency(order.totalAmount)}</span></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600"><span>优惠金额</span><span>-{formatCurrency(order.discountAmount)}</span></div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>应付金额</span><span>{formatCurrency(order.finalAmount)}</span></div>
            </div>
          </div>
          )}

          {order.payments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">支付记录</h3>
                {order.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">{p.method === "ALIPAY" ? "支付宝" : p.method === "WECHAT" ? "微信支付" : p.method}</p>
                      {p.paidAt && <p className="text-sm text-muted-foreground">{formatDateTime(p.paidAt)}</p>}
                    </div>
                    <Badge variant={p.status === "PAID" ? "default" : "secondary"}>{p.status === "PAID" ? "已支付" : p.status}</Badge>
                  </div>
                ))}
              </div>
            </>
          )}

          {order.reports.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">检测报告</h3>
                {order.reports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <Badge variant="outline" className="mt-1">{r.status === "READY" ? "可下载" : "生成中"}</Badge>
                    </div>
                    {r.fileUrl && r.status === "READY" && (
                      <Link href={r.fileUrl} target="_blank">
                        <Button size="sm"><Download className="mr-2 h-4 w-4" />下载报告</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}