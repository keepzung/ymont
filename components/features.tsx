import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Shield, 
  Clock, 
  FileText, 
  Users, 
  Truck,
  ArrowRight 
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "快速检测",
    description: "常规项目3-5个工作日出报告，加急服务最快24小时",
  },
  {
    icon: Clock,
    title: "全程追溯",
    description: "样品接收、处理、检测全流程可视化追踪",
  },
  {
    icon: FileText,
    title: "专业报告",
    description: "详尽的检测数据，配套专业技术解读",
  },
  {
    icon: Users,
    title: "技术支持",
    description: "资深地质专家团队，提供选矿工艺咨询",
  },
]

const highlights = [
  {
    title: "模拟计算",
    description: "专业模拟计算测试平台",
    items: [
      { name: "第一性原理", desc: "VASP、MS等软件" },
      { name: "分子动力学", desc: "Gromacs、Lammps" },
      { name: "有限元仿真", desc: "COMSOL、ANSYS" },
    ],
    color: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    title: "选矿试验",
    description: "小试到中试全流程服务",
    items: [
      { name: "浮选试验", desc: "药剂制度优化" },
      { name: "磁选试验", desc: "磁场强度优化" },
      { name: "重选试验", desc: "摇床、跳汰机" },
    ],
    color: "bg-accent/10",
    textColor: "text-foreground",
  },
  {
    title: "环境检测",
    description: "矿区环境评价检测",
    items: [
      { name: "土壤检测", desc: "重金属、pH值" },
      { name: "水质检测", desc: "矿坑水、尾矿水" },
      { name: "大气检测", desc: "粉尘、有害气体" },
    ],
    color: "bg-chart-3/10",
    textColor: "text-foreground",
  },
]

export function Features() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              服务优势
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              为什么选择瓦茨实验室
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 bg-card shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Highlight Services */}
        <div>
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              更多服务
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              一站式矿业技术服务
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              除元素检测外，我们还提供模拟计算、选矿试验、环境检测等全方位服务
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((item, index) => (
              <Card key={index} className={`overflow-hidden border-0 ${item.color}`}>
                <CardContent className="p-6">
                  <h3 className={`text-xl font-bold ${item.textColor}`}>{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="mt-6 space-y-3">
                    {item.items.map((subItem, subIndex) => (
                      <div key={subIndex} className="flex items-center justify-between rounded-lg bg-card/80 px-4 py-3">
                        <span className="font-medium text-foreground">{subItem.name}</span>
                        <span className="text-sm text-muted-foreground">{subItem.desc}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="mt-6 w-full" size="sm">
                    了解详情
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
