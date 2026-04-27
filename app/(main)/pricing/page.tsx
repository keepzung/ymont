"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Loader2 } from "lucide-react"

type Service = {
  id: string
  name: string
  instrument: string
  price: number
  unit: string
  turnaround: string | null
  description: string | null
  category: { name: string }
}

const features = [
  { title: "3.5天", desc: "平均检测周期" },
  { title: "50+", desc: "检测项目" },
  { title: "99%+", desc: "客户满意度" },
]

export default function PricingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => { setServices(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function toggleService(id: string) {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const grouped = services.reduce((acc, s) => {
    const cat = s.category?.name || "其他"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {} as Record<string, Service[]>)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <Badge className="mb-4">服务价格</Badge>
          <h1 className="text-3xl font-bold">检测服务</h1>
          <p className="mt-2 text-muted-foreground">暂无检测服务，请联系客服咨询</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button asChild><Link href="/consulting">在线咨询</Link></Button>
          <Button variant="outline" asChild><a href="tel:18600104701">电话咨询</a></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">立即下单</Badge>
        <h1 className="text-3xl font-bold">在线下单检测</h1>
        <p className="mt-2 text-muted-foreground">选择检测项目，提交样品信息，客服将第一时间联系您</p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-xl font-bold">选择检测项目</h2>
        {Object.entries(grouped).map(([catName, items]) => (
          <Card key={catName} className="mb-4">
            <CardHeader><CardTitle>{catName}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const isSelected = selectedServices.includes(item.id)
                  return (
                    <button key={item.id} onClick={() => toggleService(item.id)}
                      className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.instrument}</p>
                        {item.turnaround && (
                          <p className="text-xs text-muted-foreground">周期：{item.turnaround}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">¥{item.price}</p>
                        <p className="text-xs text-muted-foreground">/{item.unit}</p>
                        {isSelected && <Check className="ml-auto mt-1 h-5 w-5 text-primary" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-12 text-center">
        <Link href="/booking">
          <Button size="lg" disabled={selectedServices.length === 0}>
            立即下单 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">选择检测项目后提交预约</p>
      </div>

      <Card>
        <CardHeader><CardTitle>其他检测项目</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">如果您需要其他检测项目或有特殊检测需求，请联系客服。</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link href="/consulting">在线咨询</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:18600104701">电话咨询</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}