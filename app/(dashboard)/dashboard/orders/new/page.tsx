"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/constants"
import { ArrowLeft, Check, Search } from "lucide-react"

type ServiceItem = {
  id: string; name: string; code: string; instrument: string
  price: number; unit: string; turnaround: string | null
  category: { name: string; slug: string }
}

export default function NewOrderPage() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    sampleName: "", sampleType: "", sampleWeight: "",
    sampleSize: "", sampleDesc: "", remark: "", couponCode: "",
  })

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => { setServices(Array.isArray(data) ? data : []) })
  }, [])

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = services.filter((s) =>
    s.name.includes(search) || s.instrument.includes(search) || s.category.name.includes(search)
  )

  const grouped = filtered.reduce((acc, s) => {
    const key = s.category.name
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {} as Record<string, ServiceItem[]>)

  const totalAmount = services
    .filter((s) => selected.has(s.id))
    .reduce((sum, s) => sum + s.price, 0)

  async function handleSubmit() {
    if (!form.sampleName) return alert("请输入样品名称")
    if (selected.size === 0) return alert("请至少选择一个检测项目")

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceIds: Array.from(selected),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/dashboard/orders/${data.id}`)
      } else {
        alert(data.error || "创建订单失败")
      }
    } catch {
      alert("网络错误")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />返回
        </Button>
        <h1 className="text-2xl font-bold">新建检测订单</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>样品信息</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sampleName">样品名称 *</Label>
                  <Input id="sampleName" placeholder="如：铁矿石、铜精矿" value={form.sampleName} onChange={(e) => setForm({ ...form, sampleName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleType">样品类型</Label>
                  <Input id="sampleType" placeholder="如：矿石、土壤、水样" value={form.sampleType} onChange={(e) => setForm({ ...form, sampleType: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleWeight">样品重量</Label>
                  <Input id="sampleWeight" placeholder="如：200g" value={form.sampleWeight} onChange={(e) => setForm({ ...form, sampleWeight: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleSize">粒度要求</Label>
                  <Input id="sampleSize" placeholder="如：-200目" value={form.sampleSize} onChange={(e) => setForm({ ...form, sampleSize: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleDesc">样品描述</Label>
                <Textarea id="sampleDesc" placeholder="请简要描述样品情况" value={form.sampleDesc} onChange={(e) => setForm({ ...form, sampleDesc: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remark">备注</Label>
                <Textarea id="remark" placeholder="其他需要说明的事项" value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>选择检测项目</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索检测项目" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="mb-3 font-semibold">{category}</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((item) => {
                      const isSelected = selected.has(item.id)
                      return (
                        <button key={item.id} onClick={() => toggleService(item.id)}
                          className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.instrument}</p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader><CardTitle>订单摘要</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {services.filter((s) => selected.has(s.id)).map((s) => (
                  <div key={s.id} className="text-sm">
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                ))}
                {selected.size === 0 && (
                  <p className="text-sm text-muted-foreground">请选择检测项目</p>
                )}
              </div>
              <Separator />
              <Button className="w-full" size="lg" disabled={selected.size === 0 || loading} onClick={handleSubmit}>
                {loading ? "提交中..." : "提交订单"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">提交后可在线支付或线下转账</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
