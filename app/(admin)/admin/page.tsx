import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, Users, Newspaper, FlaskConical, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">管理后台</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/bookings">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>预约管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">客户在线预约列表</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>订单管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">检测订单管理</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>客户管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">注册客户管理</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/consultations">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>咨询管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">客户咨询管理</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}