"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Upload
} from "lucide-react"

type News = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string
  isPublished: boolean
  isFeatured: boolean
  publishedAt: string | null
  createdAt: string
}

type FormData = {
  title: string
  slug: string
  summary: string
  content: string
  isPublished: boolean
  isFeatured: boolean
}

const emptyForm: FormData = {
  title: "", slug: "", summary: "", content: "", isPublished: false, isFeatured: false
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
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
      const res = await fetch("/api/news")
      const data = await res.json()
      setNews(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleSubmit() {
    if (!form.title || !form.content) return
    setSaving(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = JSON.stringify({ 
        ...form, 
        publishedAt: form.isPublished ? new Date().toISOString() : null 
      })
      await fetch(`/api/admin/news${editingId ? "/" + editingId : ""}`, {
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
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" })
      fetchData()
    } catch (e) { console.error(e) }
  }

  async function togglePublish(id: string, current: boolean) {
    try {
      await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current, publishedAt: !current ? new Date().toISOString() : null })
      })
      fetchData()
    } catch (e) { console.error(e) }
  }

  function openEdit(item: News) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary || "",
      content: item.content,
      isPublished: item.isPublished,
      isFeatured: item.isFeatured
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
          <h1 className="text-2xl font-bold">新闻管理</h1>
          <p className="text-muted-foreground">发布和管理新闻资讯</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(emptyForm) } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />添加新闻</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingId ? "编辑新闻" : "添加新闻"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">标题 *</label>
                  <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="新闻标题" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="news-slug" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">摘要</label>
                <Input value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} placeholder="简要描述..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">内容 *</label>
                <Textarea 
                  value={form.content} 
                  onChange={(e) => setForm({...form, content: e.target.value})} 
                  placeholder="新闻详细内容..." 
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isPublished} 
                    onChange={(e) => setForm({...form, isPublished: e.target.checked})}
                  />
                  <span className="text-sm">发布</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isFeatured} 
                    onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
                  />
                  <span className="text-sm">推荐</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button onClick={handleSubmit} disabled={saving || !form.title || !form.content}>
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
                <TableHead>标题</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>推荐</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">暂无数据</TableCell></TableRow>
              ) : (
                news.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="font-mono text-sm">{item.slug}</TableCell>
                    <TableCell>
                      <Badge variant={item.isPublished ? "default" : "secondary"}>{item.isPublished ? "已发布" : "草稿"}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.isFeatured && <Badge variant="outline">推荐</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("zh-CN") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => togglePublish(item.id, item.isPublished)}>
                          {item.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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