"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Plus, Pencil, Trash2, Loader2, Check, X 
} from "lucide-react"

type ServiceCategory = {
  id: string
  name: string
  slug: string
  sortOrder: number
}

type ServicePrice = {
  id: string
  name: string
  code: string
  instrument: string
  price: number
  unit: string
  turnaround: string | null
  description: string | null
  isActive: boolean
  categoryId: string
  category: ServiceCategory
}

type FormData = {
  name: string
  code: string
  instrument: string
  price: string
  unit: string
  turnaround: string
  description: string
  categoryId: string
}

const emptyForm: FormData = {
  name: "", code: "", instrument: "", price: "", unit: "次", 
  turnaround: "", description: "", categoryId: ""
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServicePrice[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [catRes, svcRes] = await Promise.all([
        fetch("/api/admin/services/categories"),
        fetch("/api/admin/services"),
      ])
      const catData = await catRes.json()
      const svcData = await svcRes.json()
      setCategories(Array.isArray(catData) ? catData : [])
      setServices(Array.isArray(svcData) ? svcData : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.categoryId) return
    setSaving(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = JSON.stringify({ ...form, price: parseFloat(form.price) })
      await fetch(`/api/admin/services${editingId ? "/" + editingId : ""}`, {
        method, headers: { "Content-Type": "application/json" }, body,
      })
      setDialogOpen(false)
      setEditingId(null)
      setForm(emptyForm)
      fetchData()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
      fetchData()
    } catch (e) { console.error(e) }
  }

  function openEdit(service: ServicePrice) {
    setEditingId(service.id)
    setForm({
      name: service.name, code: service.code, instrument: service.instrument,
      price: String(service.price), unit: service.unit,
      turnaround: service.turnaround || "",
      description: service.description || "",
      categoryId: service.categoryId,
    })
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">检测项目管理</h1>
          <p className="text-muted-foreground">管理检测项目和价格</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(emptyForm) } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />添加项目</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "编辑项目" : "添加项目"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">项目名称</label>
                  <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="XRF荧光光谱分析" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">项目编号</label>
                  <Input value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="XRF001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">所属分类</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})}>
                    <option value="">选择分类</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">仪器设备</label>
                  <Input value={form.instrument} onChange={(e) => setForm({...form, instrument: e.target.value})} placeholder="XRF" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">价格(元)</label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">单位</label>
                  <Input value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} placeholder="次" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">检测周期</label>
                  <Input value={form.turnaround} onChange={(e) => setForm({...form, turnaround: e.target.value})} placeholder="3工作日" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述说明</label>
                <Input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="简要描述..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button onClick={handleSubmit} disabled={saving || !form.name || !form.price}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "保存"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>项目</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>仪器</TableHead>
                <TableHead>周期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">暂无数据</TableCell></TableRow>
              ) : (
                services.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono">{s.code}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.category?.name}</TableCell>
                    <TableCell>{s.instrument}</TableCell>
                    <TableCell>{s.turnaround || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}