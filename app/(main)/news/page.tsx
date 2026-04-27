"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, ArrowLeft } from "lucide-react"

type News = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string
  coverImage: string | null
  isPublished: boolean
  isFeatured: boolean
  publishedAt: string | null
  createdAt: string
}

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => {
        const published = (Array.isArray(data) ? data : []).filter((n: News) => n.isPublished)
        setNews(published)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">新闻资讯</h1>
          <p className="mt-4 text-muted-foreground">暂无新闻资讯</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    )
  }

  const featured = news.find(n => n.isFeatured)
  const otherNews = news.filter(n => n.id !== featured?.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
      </div>

      <h1 className="text-3xl font-bold">新闻资讯</h1>
      <p className="mt-2 text-muted-foreground">了解瓦茨实验室最新动态</p>

      <div className="mt-8 space-y-6">
        {featured && (
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-[21/9] w-full bg-gradient-to-br from-primary/20 to-accent/20" />
              <CardContent className="p-6">
                <Badge className="mb-3">推荐</Badge>
                <CardTitle className="text-xl">{featured.title}</CardTitle>
                <p className="mt-2 text-muted-foreground">{featured.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString("zh-CN") : new Date(featured.createdAt).toLocaleDateString("zh-CN")}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {otherNews.map((item) => (
            <div key={item.id}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">新闻</Badge>
                  <h3 className="font-medium line-clamp-2">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("zh-CN") : new Date(item.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}