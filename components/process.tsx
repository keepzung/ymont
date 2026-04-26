import { Badge } from "@/components/ui/badge"
import { FileText, Package, FlaskConical, BarChart3, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "在线下单",
    description: "选择检测项目，填写样品信息，在线支付",
  },
  {
    icon: Package,
    step: "02",
    title: "样品寄送",
    description: "按照要求采集样品，选择上门取样或自行寄送",
  },
  {
    icon: FlaskConical,
    step: "03",
    title: "实验室检测",
    description: "专业团队按标准流程进行样品处理与检测",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "数据分析",
    description: "原始数据复核，质量控制审核",
  },
  {
    icon: CheckCircle,
    step: "05",
    title: "报告交付",
    description: "电子版即时推送，纸质版快递寄送",
  },
]

export function Process() {
  return (
    <section id="guide" className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            送检指南
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            简单五步，轻松送检
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            标准化服务流程，让您的检测体验更加便捷高效
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
            
            <div className="relative grid grid-cols-5 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                    
                    {/* Step Number */}
                    <div className="mt-4 text-sm font-bold text-primary">{step.step}</div>
                    
                    {/* Content */}
                    <h3 className="mt-2 text-center text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile List */}
        <div className="space-y-6 lg:hidden">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="text-xs font-bold text-primary">{step.step}</div>
                  <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sample Requirements */}
        <div className="mt-16 rounded-2xl bg-muted/50 p-8">
          <h3 className="mb-6 text-center text-xl font-bold text-foreground">送样要求</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">200g</div>
              <div className="mt-1 text-sm text-muted-foreground">建议样品量</div>
            </div>
            <div className="rounded-xl bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">-200目</div>
              <div className="mt-1 text-sm text-muted-foreground">粉末粒度要求</div>
            </div>
            <div className="rounded-xl bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">干燥</div>
              <div className="mt-1 text-sm text-muted-foreground">样品状态</div>
            </div>
            <div className="rounded-xl bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">密封</div>
              <div className="mt-1 text-sm text-muted-foreground">包装要求</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
