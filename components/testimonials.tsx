"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react"

const testimonials = [
  {
    name: "张**",
    company: "中国地质大学",
    project: "ICP-MS、XRD",
    journal: "Ore Geology Reviews",
    impactFactor: "3.8",
    quote: "感谢瓦茨实验室提供的ICP-MS和XRD分析服务，数据质量高，为我们的矿床成因研究提供了重要支撑。",
    link: "#",
  },
  {
    name: "李*",
    company: "紫金矿业集团",
    project: "XRF、火试金",
    journal: "",
    impactFactor: "",
    quote: "作为矿业企业，我们对检测结果的准确性要求很高。瓦茨实验室的XRF和火试金结果与我们的生产数据高度吻合，值得信赖。",
    link: "#",
  },
  {
    name: "王**",
    company: "中南大学",
    project: "电子探针、MLA",
    journal: "Minerals Engineering",
    impactFactor: "4.9",
    quote: "电子探针和MLA分析对我们研究矿物工艺矿物学帮助很大，瓦茨实验室的技术团队专业且响应迅速。",
    link: "#",
  },
  {
    name: "陈*",
    company: "江西铜业",
    project: "稀土配分、ICP-OES",
    journal: "",
    impactFactor: "",
    quote: "稀土配分分析结果准确，帮助我们更好地评估了伴生稀土资源的经济价值，非常满意。",
    link: "#",
  },
  {
    name: "刘**",
    company: "昆明理工大学",
    project: "LA-ICP-MS",
    journal: "Journal of Asian Earth Sciences",
    impactFactor: "2.7",
    quote: "LA-ICP-MS原位分析数据精度高，研狗团队还帮助我们进行了数据后处理，服务非常到位。",
    link: "#",
  },
  {
    name: "赵*",
    company: "山东黄金集团",
    project: "XRD物相定量",
    journal: "",
    impactFactor: "",
    quote: "XRD物相定量分析帮助我们优化了选矿工艺，提高了回收率，感谢瓦茨实验室的专业服务！",
    link: "#",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= testimonials.length ? 0 : prev + itemsPerPage
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsPerPage) : prev - itemsPerPage
    )
  }

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerPage
  )

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <Badge variant="secondary" className="mb-4">
              客户案例
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              客户论文致谢
            </h2>
            <p className="mt-2 text-muted-foreground">
              感谢众多科研工作者的认可与信赖
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              aria-label="上一页"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              aria-label="下一页"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Testimonials Table Header */}
        <div className="mb-4 hidden rounded-lg bg-muted px-6 py-3 lg:grid lg:grid-cols-5 lg:gap-4">
          <div className="text-sm font-medium text-muted-foreground">影响因子</div>
          <div className="text-sm font-medium text-muted-foreground">作者信息</div>
          <div className="text-sm font-medium text-muted-foreground">服务项目</div>
          <div className="text-sm font-medium text-muted-foreground">致谢内容</div>
          <div className="text-sm font-medium text-muted-foreground">论文链接</div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden space-y-3 lg:block">
          {visibleTestimonials.map((item, index) => (
            <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="grid grid-cols-5 items-center gap-4 p-6">
                {/* Impact Factor */}
                <div>
                  {item.impactFactor ? (
                    <div className="inline-flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">IF: {item.impactFactor}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.journal}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">企业客户</span>
                  )}
                </div>

                {/* Author Info */}
                <div>
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.company}</div>
                </div>

                {/* Service */}
                <div>
                  <Badge variant="outline">{item.project}</Badge>
                </div>

                {/* Quote */}
                <div className="flex items-start gap-2">
                  <Quote className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.quote}</p>
                </div>

                {/* Link */}
                <div>
                  {item.journal && (
                    <Button variant="ghost" size="sm" className="gap-2">
                      查看文章
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Card View */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {visibleTestimonials.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  {item.impactFactor ? (
                    <Badge className="bg-primary/10 text-primary">IF: {item.impactFactor}</Badge>
                  ) : (
                    <Badge variant="secondary">企业客户</Badge>
                  )}
                  <Badge variant="outline">{item.project}</Badge>
                </div>

                <div className="mb-3">
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.company}</div>
                </div>

                <div className="flex items-start gap-2">
                  <Quote className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{item.quote}</p>
                </div>

                {item.journal && (
                  <Button variant="ghost" size="sm" className="mt-4 w-full gap-2">
                    查看文章
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <Button variant="outline">查看更多案例</Button>
        </div>
      </div>
    </section>
  )
}
