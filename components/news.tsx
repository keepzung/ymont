import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

const news = [
  {
    category: "公司动态",
    title: "瓦茨实验室新增LA-ICP-MS原位分析服务",
    summary: "引进NWR 213激光剥蚀系统，为客户提供微区原位元素分析服务...",
    date: "2024-03-15",
    featured: true,
  },
  {
    category: "技术文章",
    title: "XRF与ICP-MS在矿石检测中的应用对比",
    summary: "深入分析两种主流元素分析技术的优缺点及适用场景...",
    date: "2024-03-12",
    featured: false,
  },
  {
    category: "行业资讯",
    title: "2024年国内稀土矿检测标准更新解读",
    summary: "新版GB/T标准对稀土检测方法和质量控制提出新要求...",
    date: "2024-03-10",
    featured: false,
  },
  {
    category: "客户案例",
    title: "助力某矿业集团完成金矿资源评价",
    summary: "通过系统的元素分析和矿物学研究，为客户提供了详细的资源评价报告...",
    date: "2024-03-08",
    featured: false,
  },
]

export function News() {
  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <Badge variant="secondary" className="mb-4">
              新闻资讯
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              最新动态
            </h2>
          </div>
          <Button variant="outline" className="gap-2">
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Article */}
          <Card className="overflow-hidden lg:row-span-2">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
            <CardContent className="p-6">
              <Badge className="mb-3">{news[0].category}</Badge>
              <h3 className="text-xl font-bold text-foreground">{news[0].title}</h3>
              <p className="mt-2 text-muted-foreground">{news[0].summary}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {news[0].date}
              </div>
            </CardContent>
          </Card>

          {/* Other Articles */}
          <div className="space-y-4">
            {news.slice(1).map((item, index) => (
              <Card key={index} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-muted to-muted/50" />
                  <div className="min-w-0 flex-1">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <h3 className="line-clamp-1 font-medium text-foreground">{item.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
