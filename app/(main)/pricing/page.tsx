"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"

const serviceCategories = [
  {
    name: "元素检测",
    items: [
      { name: "XRF荧光光谱全元素分析", instrument: "XRF" },
      { name: "ICP-MS痕量元素分析", instrument: "ICP-MS" },
      { name: "原子吸收光谱", instrument: "AAS" },
      { name: "X射线衍射物相分析", instrument: "XRD" },
      { name: "电子探针分析", instrument: "EPMA" },
    ]
  },
  {
    name: "矿物分析",
    items: [
      { name: "矿物鉴定", instrument: "偏光显微镜" },
      { name: "品位分析", instrument: "化学分析" },
      { name: "物相分析", instrument: "XRD/Rietveld" },
    ]
  },
  {
    name: "稀土元素",
    items: [
      { name: "稀土总量分析", instrument: "ICP-MS" },
      { name: "稀土配分分析", instrument: "ICP-MS" },
      { name: "稀有元素分析", instrument: "ICP-MS" },
    ]
  },
]

const features = [
  { title: "3.5天", desc: "平均检测周期" },
  { title: "50+", desc: "检测项目" },
  { title: "99%+", desc: "客户满意度" },
]

export default function OrderPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  function toggleService(name: string) {
    setSelectedServices(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
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
        {serviceCategories.map((cat) => (
          <Card key={cat.name} className="mb-4">
            <CardHeader><CardTitle>{cat.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => {
                  const isSelected = selectedServices.includes(item.name)
                  return (
                    <button key={item.name} onClick={() => toggleService(item.name)}
                      className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.instrument}</p>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
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