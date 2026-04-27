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
  Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, Eye, EyeOff
} from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sortOrder: number
  _count?: { services: number }
}

type FormData = {
  name: string
  slug: string
  description: string
  icon: string
  sortOrder: string
}

const emptyForm: FormData = {
  name: "", slug: "", description: "", icon: "", sortOrder: "0"
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/services/categories")
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
      
      // Fetch service counts for each category
      const counts: Record<string, number> = {}
      for (const cat of data) {
        counts[cat.id] = cat._count?.services || 0
      }
      setServiceCounts(counts)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleSubmit() {
    if (!form.name) return
    setSaving(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = JSON.stringify({ 
        ...form, 
        sortOrder: parseInt(form.sortOrder) || 0 
      })
      await fetch(`/api/admin/services/categories${editingId ? "/" + editingId : ""}`, {
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
    const count = serviceCounts[id] || 0
    if (count > 0) {
      alert(`该分类下有${count}个检测项目，无法删除`)
      return
    }
    if (!confirm("确定删除？")) return
    try {
      await fetch(`/api/admin/services/categories/${id}`, { method: "DELETE" })
      fetchData()
    } catch (e) { console.error(e) }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === categories.length - 1) return
    
    const other = direction === "up" ? categories[index - 1] : categories[index + 1]
    await fetch(`/api/admin/services/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder: other.sortOrder })
    })
    await fetch(`/api/admin/services/categories/${other.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder: categories[index].sortOrder })
    })
    fetchData()
  }

  function openEdit(category: Category) {
    setEditingId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      sortOrder: String(category.sortOrder)
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
          <h1 className="text-2xl font-bold">检测分类管理</h1>
          <p className="text-muted-foreground">管理检测项目分类</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(emptyForm) } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />添加分类</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "编辑分类" : "添加分类"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">分类名称 *</label>
                <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="元素检测" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug标识</label>
                <Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="element-detection" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="元素相关检测服务" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">排序</label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({...form, sortOrder: e.target.value})} placeholder="0" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button onClick={handleSubmit} disabled={saving || !form.name}>
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
                <TableHead>排序</TableHead>
                <TableHead>分类名称</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>项目数</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">暂无数据</TableCell></TableRow>
              ) : (
                categories.map((cat, index) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => handleMove(cat.id, "up")}>
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={index === categories.length - 1} onClick={() => handleMove(cat.id, "down")}>
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="font-mono text-sm">{cat.slug}</TableCell>
                    <TableCell className="text-muted-foreground">{cat.description || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{serviceCounts[cat.id] || 0} 个</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4" /></Button>
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