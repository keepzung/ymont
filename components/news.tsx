"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Loader2 } from "lucide-react"

type News = {
  id: string
  title: string
  slug: string
  summary: string | null
  category: string
  isPublished: boolean
  isFeatured: boolean
  publishedAt: string | null
  createdAt: string
}

export function News() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => {
        const published = (Array.isArray(data) ? data : []).filter((n: News) => n.isPublished)
        setNews(published.slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  const featured = news.find(n => n.isFeatured) || news[0]
  const otherNews = news.filter(n => n.id !== featured?.id).slice(0, 3)

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
          <Link href="/news">
            <Button variant="outline" className="gap-2">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="text-center text-muted-foreground">
            暂无新闻资讯
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Featured Article */}
            {featured && (
              <Link href={`/news/${featured.slug}`}>
                <Card className="overflow-hidden lg:row-span-2 transition-shadow hover:shadow-md">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
                  <CardContent className="p-6">
                    <Badge className="mb-3">精选</Badge>
                    <h3 className="text-xl font-bold text-foreground">{featured.title}</h3>
                    <p className="mt-2 text-muted-foreground">{featured.summary}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString("zh-CN") : new Date(featured.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Other Articles */}
            <div className="space-y-4">
              {otherNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-muted to-muted/50" />
                      <div className="min-w-0 flex-1">
                        <Badge variant="outline" className="mb-2 text-xs">
                          新闻
                        </Badge>
                        <h3 className="line-clamp-1 font-medium text-foreground">{item.title}</h3>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("zh-CN") : new Date(item.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}