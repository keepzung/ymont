import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Users, Shield, TrendingUp, Headphones } from "lucide-react"
import Link from "next/link"

const benefits = [
  { icon: Shield, title: "权威资质", desc: "第三方检测实验室，全品类检测" },
  { icon: TrendingUp, title: "稳定底价", desc: "高效出报告、成本优势明显" },
  { icon: Users, title: "零门槛合作", desc: "全国空白区域火热招商" },
  { icon: Headphones, title: "全方位支持", desc: "售后全程服务保障" },
]

const agentLevels = [
  { name: "区域代理", desc: "省会城市独家代理权" },
  { name: "城市代理", desc: "地级市独家代理权" },
  { name: "项目代理", desc: "特定检测项目合作" },
]

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">加入我们</Badge>
        <h1 className="text-3xl font-bold">诚邀全国代理</h1>
        <p className="mt-2 text-muted-foreground">权威第三方检测实验室，全品类检测、高效出报告、稳定底价！</p>
      </div>

      <Card className="mb-12 bg-primary/5">
        <CardContent className="py-8 text-center">
          <h2 className="text-2xl font-bold">全国空白区域火热招商</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            零门槛合作、灵活合作模式、售后全方位支持
          </p>
          <p className="mt-2 text-muted-foreground">
            诚邀各地代理伙伴加盟，互利共赢，聚力发展！
          </p>
          <div className="mt-6">
            <Link href="/consulting">
              <Button size="lg">
                立即咨询 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-bold">代理优势</h2>
        <div className="grid gap-6 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title}>
                <CardContent className="pt-6 text-center">
                  <Icon className="mx-auto mb-3 h-10 w-10 text-primary" />
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-bold">合作模式</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {agentLevels.map((level) => (
            <Card key={level.name}>
              <CardHeader>
                <CardTitle className="text-center">{level.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{level.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>联系我们</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 text-muted-foreground">
            <p><span className="font-medium">电话：</span>18600104701</p>
            <p><span className="font-medium">邮箱：</span>info@ymont.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}