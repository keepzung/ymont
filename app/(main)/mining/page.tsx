import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FlaskConical, Calculator, Wind, Factory, Sprout, CheckCircle } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Calculator,
    title: "模拟计算",
    description: "专业模拟计算测试平台",
    items: [
      { name: "第一性原理", desc: "VASP、MS等软件" },
      { name: "分子动力学", desc: "Gromacs、Lammps" },
      { name: "有限元仿真", desc: "COMSOL、ANSYS" },
    ]
  },
  {
    icon: FlaskConical,
    title: "选矿试验",
    description: "小试到中试全流程服务",
    items: [
      { name: "浮选试验", desc: "药剂制度优化" },
      { name: "磁选试验", desc: "磁场强度优化" },
      { name: "重选试验", desc: "摇床、跳汰机" },
    ]
  },
  {
    icon: Wind,
    title: "环境检测",
    description: "矿区环境评价检测",
    items: [
      { name: "土壤检测", desc: "重金属、pH值" },
      { name: "水质检测", desc: "矿坑水、尾矿水" },
      { name: "大气检测", desc: "粉尘、有害气体" },
    ]
  },
  {
    icon: Factory,
    title: "冶金分析",
    description: "冶金工艺与材料分析",
    items: [
      { name: "冶金工艺优化", desc: "工艺参数改进" },
      { name: "材料性能测试", desc: "力学、物理性能" },
      { name: "微观结构分析", desc: "SEM、TEM" },
    ]
  },
]

export default function MiningPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">一站式矿业技术服务</Badge>
        <h1 className="text-3xl font-bold">一站式矿业技术服务</h1>
        <p className="mt-2 text-muted-foreground">除元素检测外，我们还提供模拟计算、选矿试验、环境检测等全方位服务</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.title}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.items.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.desc}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link href="/consulting">
                    了解详情 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-12">
        <CardHeader><CardTitle>为什么选择我们的矿业技术服务</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "专业团队", desc: "资深地质专家" },
              { title: "先进设备", desc: "进口精密仪器" },
              { title: "快速响应", desc: "3.5天出结果" },
              { title: "全程服务", desc: "一对一服务" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <Link href="/consulting">
          <Button size="lg">
            在线咨询 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}