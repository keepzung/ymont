"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/constants"
import { Download, FileText } from "lucide-react"
import Link from "next/link"

type Report = {
  id: string; title: string; fileUrl: string | null; status: string; createdAt: string
  order: { orderNo: string; sampleName: string }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => { setReports(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">检测报告</h1>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">暂无检测报告</p>
            <Link href="/dashboard/orders/new"><Button className="mt-4">新建检测订单</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.order.sampleName} · {report.order.orderNo} · {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={report.status === "READY" ? "default" : "secondary"}>
                    {report.status === "READY" ? "可下载" : report.status === "DELIVERED" ? "已下载" : "生成中"}
                  </Badge>
                  {report.fileUrl && report.status === "READY" && (
                    <Link href={report.fileUrl} target="_blank">
                      <Button size="sm"><Download className="mr-2 h-4 w-4" />下载</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
