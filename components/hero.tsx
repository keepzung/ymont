"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const stats = [
  { value: "3.5天", label: "平均检测周期" },
  { value: "99.2%", label: "客户满意度" },
  { value: "50+", label: "检测项目" },
  { value: "20+", label: "全国服务网点" },
]

const features = [
  "专业技术团队",
  "快速出具报告",
  "全程可追溯",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Qzk4QjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              一站式矿石元素检测服务平台
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              专业矿石
              <span className="text-primary">元素检测</span>
              服务
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              提供XRF、ICP-MS、XRD等多种先进检测技术，覆盖金属矿、非金属矿、稀土矿等全品类矿石元素分析，助力矿业勘探、选矿工艺和贸易结算。
            </p>

            {/* Feature List */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/booking">
                <Button size="lg" className="gap-2">
                  立即下单检测
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/booking">
                <Button size="lg" variant="outline">
                  在线咨询
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Stats Card */}
          <div className="relative">
            <div className="mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground">欢迎使用瓦茨实验室</h3>
                  <p className="mt-1 text-sm text-muted-foreground">专业 · 快速 · 可信赖</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-muted/50 p-4 text-center transition-colors hover:bg-muted"
                    >
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="mt-6 grid grid-cols-3 gap-3">
<Link href="/booking" className="rounded-lg bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                    企业用户
                  </Link>
                  <Link href="/booking" className="rounded-lg bg-accent/10 px-4 py-3 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/20">
                    科研机构
                  </Link>
                  <Link href="/booking" className="rounded-lg bg-muted px-4 py-3 text-center text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/80">
                    个人用户
                  </Link>
                  <Link href="/register?role=RESEARCH" className="rounded-lg bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                    科研机构
                  </Link>
                  <Link href="/register?role=INDIVIDUAL" className="rounded-lg bg-muted px-4 py-3 text-center text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/80">
                    个人用户
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 -top-4 hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg lg:block">
                新用户享8折
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
