"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Atom, Microscope, FlaskConical, Gem, Mountain } from "lucide-react"

const categories = [
  { id: "xrf", label: "XRF荧光光谱", icon: Sparkles },
  { id: "icp", label: "ICP质谱分析", icon: Atom },
  { id: "xrd", label: "X射线衍射", icon: Microscope },
  { id: "aas", label: "原子吸收光谱", icon: FlaskConical },
  { id: "rare", label: "稀土元素", icon: Gem },
  { id: "mineral", label: "矿物鉴定", icon: Mountain },
]

const services = {
  xrf: ["手持XRF快速检测", "台式XRF精密分析", "XRF全元素扫描", "熔融制样XRF分析"],
  icp: ["ICP-OES常规元素", "ICP-MS痕量分析", "ICP-MS同位素比值", "LA-ICP-MS原位分析"],
  xrd: ["XRD物相定性分析", "XRD物相定量分析", "微区XRD分析", "高温原位XRD"],
  aas: ["火焰原子吸收", "石墨炉原子吸收", "氢化物发生-AAS", "冷原子吸收测汞"],
  rare: ["稀土总量测定", "稀土配分分析", "稀土矿物鉴定", "稀土浸出试验"],
  mineral: ["常规矿物鉴定", "电子探针分析", "MLA矿物自动分析", "流体包裹体分析"],
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("xrf")

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">检测服务</Badge>
        <h1 className="text-3xl font-bold">检测项目</h1>
        <p className="mt-2 text-muted-foreground">一站式矿石元素检测服务</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(services as any)[activeCategory].map((service: string) => (
          <Card key={service} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{service}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href="/booking" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                立即预约 <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/booking">
          <button className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            查看全部检测项目 <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}