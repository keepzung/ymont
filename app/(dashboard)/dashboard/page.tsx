"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FlaskConical, MessageSquare, Plus } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">欢迎回来，{user?.name || "用户"}</h1>
          <p className="text-muted-foreground">管理您的检测订单和报告</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button><Plus className="mr-2 h-4 w-4" />新建订单</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">进行中的订单</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">暂无进行中的订单</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">检测报告</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">暂无报告</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">咨询记录</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">暂无咨询</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/orders/new">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span>新建检测订单</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span>检测服务</span>
            </Button>
          </Link>
          <Link href="/guide">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <FlaskConical className="h-5 w-5" />
              <span>送检指南</span>
            </Button>
          </Link>
          <Link href="/dashboard/consulting">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>在线咨询</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}