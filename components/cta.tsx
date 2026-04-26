import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gift, Percent, Users, GraduationCap } from "lucide-react"

const promotions = [
{ icon: Gift, title: "新用户优惠", description: "联系客服享好礼", href: "/booking" },

  { icon: Users, title: "企业服务", description: "企业用户专享", href: "/booking" },

  { icon: GraduationCap, title: "高校合作", description: "高校师生合作", href: "/booking" },
]

export function CTA() {
  return (
    <section className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            开启您的矿石检测之旅
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            专业团队、先进设备、快速响应，助力您的矿业勘探与科学研究
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="flex-1">
              <Input
                placeholder="输入检测项目名称搜索..."
                className="w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
                readOnly
              />
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" className="whitespace-nowrap">搜索项目</Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="secondary">立即下单</Button>
            </Link>
            <Link href="/consulting">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                联系我们
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promotions.map((promo) => {
            const Icon = promo.icon
            return (
              <Link key={promo.title} href={promo.href} className="group rounded-xl bg-primary-foreground/10 p-6 transition-colors hover:bg-primary-foreground/15">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-primary-foreground">{promo.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">{promo.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary-foreground underline-offset-4 group-hover:underline">
                  了解详情 →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
