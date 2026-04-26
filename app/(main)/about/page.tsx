import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Globe, FlaskConical } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">关于我们</Badge>
        <h1 className="text-3xl font-bold">关于瓦茨实验室</h1>
        <p className="mt-2 text-muted-foreground">专业的矿石元素检测服务平台</p>
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />公司介绍</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>瓦茨实验室是一家专业的矿石元素检测服务平台，致力于为矿业企业、科研院所及个人用户提供一站式矿石检测分析服务。</p>
          <p>我们拥有先进的检测设备，包括X射线荧光光谱仪(XRF)、电感耦合等离子体质谱仪(ICP-MS)、X射线衍射仪(XRD)、电子探针(EPMA)等，可提供从常量到痕量的全元素分析服务。</p>
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {[
          { icon: Users, label: "服务客户", value: "500+" },
          { icon: FlaskConical, label: "检测项目", value: "50+" },
          { icon: Globe, label: "服务网点", value: "20+" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>联系方式</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p><span className="font-medium">服务热线：</span>18600104701</p>
            <p><span className="font-medium">邮箱：</span>info@ymont.com</p>
            <p><span className="font-medium">地址：</span>北京市海淀区中关村科技园区</p>
            <p><span className="font-medium">工作时间：</span>周一至周五 9:00-18:00</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}