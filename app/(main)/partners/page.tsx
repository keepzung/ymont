import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const partners = [
  { name: "中国地质大学", type: "高校" },
  { name: "北京科技大学", type: "高校" },
  { name: "中国矿业大学", type: "高校" },
  { name: "中国科学院", type: "科研机构" },
  { name: "自然资源部", type: "政府部门" },
  { name: "地方矿产局", type: "政府部门" },
]

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <Badge className="mb-4">合作伙伴</Badge>
        <h1 className="text-3xl font-bold">合作伙伴</h1>
        <p className="mt-2 text-muted-foreground">与我们长期合作的科研院所和企事业单位</p>
      </div>

      <Card>
        <CardHeader><CardTitle>合作单位</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-lg border p-4">
                <span className="font-medium">{p.name}</span>
                <Badge variant="outline">{p.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader><CardTitle>合作方式</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>• 实验室共建与资源共享</li>
            <li>• 项目合作与技术研发</li>
            <li>• 人才培养与交流</li>
            <li>• 学术交流与研讨</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}