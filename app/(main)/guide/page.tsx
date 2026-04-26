import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Package, Clock, Shield, AlertTriangle, CheckCircle } from "lucide-react"

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">送检指南</Badge>
        <h1 className="text-3xl font-bold">样品送检指南</h1>
        <p className="mt-2 text-muted-foreground">了解送检流程、样品要求和注意事项</p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-4">
        {[
          { icon: FlaskConical, title: "1. 在线下单", desc: "选择检测项目，填写样品信息" },
          { icon: Package, title: "2. 样品准备", desc: "按要求准备样品" },
          { icon: Clock, title: "3. 实验室检测", desc: "专业团队进行检测分析" },
          { icon: Shield, title: "4. 报告交付", desc: "在线查看并下载检测报告" },
        ].map((step) => (
          <Card key={step.title}>
            <CardContent className="pt-6 text-center">
              <step.icon className="mx-auto mb-3 h-10 w-10 text-primary" />
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader><CardTitle>样品要求</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "样品量", value: "不少于 200g", icon: Package },
              { label: "粒度", value: "-200目（75μm以下）", icon: FlaskConical },
              { label: "状态", value: "干燥、无污染", icon: CheckCircle },
              { label: "包装", value: "密封袋/密封瓶包装", icon: Shield },
            ].map((req) => (
              <div key={req.label} className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                <req.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{req.label}</p>
                  <p className="text-sm text-muted-foreground">{req.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            注意事项
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "样品必须干燥，含水率影响检测结果",
              "磁性样品请特别标注，避免干扰仪器",
              "放射性样品需提前告知并按特殊流程处理",
              "有害或有毒样品需提供MSDS（化学品安全技术说明书）",
              "样品寄送前请先完成在线下单，获取订单号",
              "建议使用顺丰或京东快递寄送，确保时效",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}