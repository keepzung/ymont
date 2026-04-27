"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Search, Loader2, MoreHorizontal
} from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  role: string
  company: string | null
  balance: number
  memberLevel: number
  createdAt: string
  _count: { orders: number }
}

const roleMap: Record<string, { label: string; color: string }> = {
  INDIVIDUAL: { label: "个人用户", color: "bg-blue-500" },
  ENTERPRISE: { label: "企业用户", color: "bg-purple-500" },
  RESEARCH: { label: "科研机构", color: "bg-cyan-500" },
  ADMIN: { label: "管理员", color: "bg-orange-500" },
  SUPER_ADMIN: { label: "超级管理员", color: "bg-red-500" },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editDialog, setEditDialog] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [search, roleFilter])

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (roleFilter !== "all") params.set("role", roleFilter)
      
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleUpdateRole() {
    if (!editDialog || !newRole) return
    setSaving(true)
    try {
      await fetch(`/api/admin/users/${editDialog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      setEditDialog(null)
      setNewRole("")
      fetchData()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
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
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-muted-foreground">管理注册用户</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索用户..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select 
          className="rounded-lg border bg-card px-3 py-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">全部角色</option>
          <option value="INDIVIDUAL">个人用户</option>
          <option value="ENTERPRISE">企业用户</option>
          <option value="RESEARCH">科研机构</option>
          <option value="ADMIN">管理员</option>
          <option value="SUPER_ADMIN">超级管理员</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>公司/机构</TableHead>
                <TableHead>订单数</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">暂无数据</TableCell></TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name || "-"}</div>
                      <div className="text-xs text-muted-foreground">{user.email || "-"}</div>
                    </TableCell>
                    <TableCell className="text-sm">{user.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge className={roleMap[user.role]?.color}>{roleMap[user.role]?.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.company || "-"}</TableCell>
                    <TableCell>{user._count?.orders || 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => { setEditDialog(user); setNewRole(user.role) }}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editDialog} onOpenChange={(open) => { if (!open) setEditDialog(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户角色</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">用户</label>
              <p className="text-sm text-muted-foreground">{editDialog?.name || editDialog?.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">角色</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="INDIVIDUAL">个人用户</option>
                <option value="ENTERPRISE">企业用户</option>
                <option value="RESEARCH">科研机构</option>
                <option value="ADMIN">管理员</option>
                <option value="SUPER_ADMIN">超级管理员</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialog(null)}>取消</Button>
              <Button onClick={handleUpdateRole} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "保存"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}