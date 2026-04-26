"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  xrf: [
    {
      title: "手持XRF快速检测",
      desc: "现场快速筛查，30秒出结果",
      instruments: "Niton XL3t, Olympus Vanta",
    },
    {
      title: "台式XRF精密分析",
      desc: "高精度定量分析，ppm级检出限",
      instruments: "Panalytical Axios, Rigaku ZSX",
    },
    {
      title: "XRF全元素扫描",
      desc: "Na-U全元素半定量扫描",
      instruments: "Bruker S8 Tiger",
    },
    {
      title: "熔融制样XRF分析",
      desc: "消除矿物效应，精度更高",
      instruments: "Panalytical Zetium",
    },
  ],
  icp: [
    {
      title: "ICP-OES常规元素",
      desc: "多元素同时检测，高通量",
      instruments: "Agilent 5110, Thermo iCAP",
    },
    {
      title: "ICP-MS痕量分析",
      desc: "ppb级检出限，微量元素首选",
      instruments: "Agilent 7900, Thermo iCAP RQ",
    },
    {
      title: "ICP-MS同位素比值",
      desc: "铅同位素、锶同位素测定",
      instruments: "Nu Plasma II MC-ICP-MS",
    },
    {
      title: "LA-ICP-MS原位分析",
      desc: "微区原位元素分布分析",
      instruments: "NWR 213激光 + Agilent 7900",
    },
  ],
  xrd: [
    {
      title: "XRD物相定性分析",
      desc: "矿物相鉴定，PDF卡片匹配",
      instruments: "Bruker D8, Rigaku SmartLab",
    },
    {
      title: "XRD物相定量分析",
      desc: "Rietveld全谱拟合定量",
      instruments: "Panalytical Empyrean",
    },
    {
      title: "微区XRD分析",
      desc: "微米级区域物相分析",
      instruments: "Bruker D8 Discover",
    },
    {
      title: "高温原位XRD",
      desc: "变温条件下相变研究",
      instruments: "配备Anton Paar高温附件",
    },
  ],
  aas: [
    {
      title: "火焰原子吸收",
      desc: "常规金属元素快速测定",
      instruments: "Agilent 240FS AA",
    },
    {
      title: "石墨炉原子吸收",
      desc: "痕量重金属高灵敏测定",
      instruments: "Agilent 280Z AA",
    },
    {
      title: "氢化物发生-AAS",
      desc: "As、Sb、Se等专用测定",
      instruments: "配备氢化物发生器",
    },
    {
      title: "冷原子吸收测汞",
      desc: "超痕量汞专用检测",
      instruments: "Milestone DMA-80",
    },
  ],
  rare: [
    {
      title: "稀土总量测定",
      desc: "REO总量快速测定",
      instruments: "ICP-OES",
    },
    {
      title: "稀土配分分析",
      desc: "15种稀土元素全配分",
      instruments: "ICP-MS",
    },
    {
      title: "稀土矿物鉴定",
      desc: "独居石、氟碳铈矿等鉴定",
      instruments: "XRD + SEM-EDS",
    },
    {
      title: "稀土浸出试验",
      desc: "离子吸附型稀土评价",
      instruments: "柱浸试验",
    },
  ],
  mineral: [
    {
      title: "常规矿物鉴定",
      desc: "偏光显微镜+XRD联用",
      instruments: "Leica DM750P + XRD",
    },
    {
      title: "电子探针分析",
      desc: "矿物化学成分精确测定",
      instruments: "JEOL JXA-8230",
    },
    {
      title: "MLA矿物自动��析",
      desc: "矿物解离度、嵌布特征",
      instruments: "FEI MLA 650",
    },
    {
      title: "流体包裹体分析",
      desc: "均一温度、盐度测定",
      instruments: "Linkam THMS600",
    },
  ],
}

export function Services() {
  const [activeCategory, setActiveCategory] = useState("xrf")

  const activeServices = services[activeCategory as keyof typeof services]

  return (
    <section id="services" className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            检测服务
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            元素检测服务
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            提供全方位矿石元素检测服务，覆盖主量元素、微量元素、稀土元素等多种分析需求
          </p>
        </div>

        {/* Category Tabs */}
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

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeServices.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm">{service.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-xs text-muted-foreground">
                  仪器：{service.instruments}
                </p>
                <Link 
                  href="/booking" 
                  className="flex items-center justify-center w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  立即预约 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More */}
        <div className="mt-10 text-center">
          <Link 
            href="/pricing" 
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            查看全部检测项目 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
