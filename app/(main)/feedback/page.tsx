import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Send } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">投诉建议</Badge>
        <h1 className="text-3xl font-bold">投诉与建议</h1>
        <p className="mt-2 text-muted-foreground">您的意见对我们很重要，期待您的反馈</p>
      </div>

      <Card>
        <CardHeader><CardTitle>提交反馈</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" placeholder="您的姓名" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话</Label>
              <Input id="phone" placeholder="手机号" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="邮箱" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">反馈类型</Label>
            <Input id="type" placeholder="投诉/建议/其他" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">详细内容</Label>
            <Textarea id="content" placeholder="请详细描述您的问题或建议" className="min-h-[120px]" />
          </div>
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />提交反馈
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader><CardTitle>其他联系方式</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">电话</p>
              <p className="text-sm text-muted-foreground">18600104701</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">邮箱</p>
              <p className="text-sm text-muted-foreground">info@ymont.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}