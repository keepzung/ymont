"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    category: "检测服务",
    questions: [
      {
        q: "检测周期需要多长时间？",
        a: "常规检测项目通常3-5个工作日出报告，加急项目1-2个工作日可出报告。具体周期根据检测项目难度和样品数量会有所不同。"
      },
      {
        q: "样品需要多少量？",
        a: "不同检测项目对样品量要求不同，一般粉末样品需要50-200克，块状样品需要50-100克。具体要求可在检测项目详情页查看。"
      },
      {
        q: "如何确保检测结果的准确性？",
        a: "我们拥有CMA认证，严格按照国家标准方法进行检测，每批样品都包含质控样和空白样，定期参与能力验证，确保检测结果准确可靠。"
      },
      {
        q: "可以出具哪些类型的报告？",
        a: "我们可以出具中文检测报告、英文检测报告、中英文双语报告，也可以根据客户要求定制报告格式。"
      },
    ]
  },
  {
    category: "送检流程",
    questions: [
      {
        q: "如何寄送样品？",
        a: "您可以选择快递寄送或亲自送样。我们提供顺丰、德邦等快递服务，建议使用防潮防震包装。"
      },
      {
        q: "检测费用如何支付？",
        a: "支持支付宝、微信支付、银行转账、对公转账等多种支付方式。也可以检测完成后支付。"
      },
      {
        q: "如何查询检测进度？",
        a: "您可以登录用户中心查看订单状态，也可以随时联系客服咨询进度。"
      },
    ]
  },
  {
    category: "报告领取",
    questions: [
      {
        q: "报告如何领取？",
        a: "报告完成后，您可以自行下载PDF版本，也可以要求我们寄送纸质报告。快递费用自理。"
      },
      {
        q: "报告可以加急吗？",
        a: "可以加急，加急费用根据项目不同有所差异。请联系客服确认。"
      },
      {
        q: "报告有效期多久？",
        a: "检测报告本身永久有效，但根据不同用途（如工程验收、进出口报关等）可能有不同的时效要求，请提前咨询。"
      },
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4">常见问题</Badge>
        <h1 className="text-3xl font-bold">常见问题解答</h1>
        <p className="mt-2 text-muted-foreground">您可能关心的问题都在这里</p>
      </div>

      {faqs.map((group, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>{group.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {group.questions.map((item, qIndex) => (
                <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <Card className="mt-12">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-bold">没有找到答案？</h3>
          <p className="mt-2 text-muted-foreground">请联系我们的客服团队</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/consulting">
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                在线咨询
              </Button>
            </Link>
            <a href="tel:18600104701">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                电话咨询
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}