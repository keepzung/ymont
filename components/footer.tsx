import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  services: {
    title: "检测服务",
    links: [
      { label: "XRF荧光光谱", href: "/services" },
      { label: "ICP-MS质谱", href: "/services" },
      { label: "X射线衍射XRD", href: "/services" },
      { label: "原子吸收光谱", href: "/services" },
      { label: "电子探针", href: "/services" },
      { label: "稀土元素分析", href: "/services" },
    ],
  },
  resources: {
    title: "资源中心",
    links: [
      { label: "送检指南", href: "/guide" },
      { label: "检测项目", href: "/services" },
      { label: "报告查询", href: "/booking" },
      { label: "技术文章", href: "#" },
      { label: "常见问题", href: "#" },
      { label: "检测标准", href: "#" },
    ],
  },
  about: {
    title: "关于我们",
    links: [
      { label: "公司简介", href: "/about" },
      { label: "仪器设备", href: "/about" },
      { label: "合作伙伴", href: "/partners" },
      { label: "加入我们", href: "/careers" },
    ],
  },
  support: {
    title: "客户服务",
    links: [
      { label: "在线咨询", href: "/consulting" },
      { label: "预约上门", href: "/consulting" },
      { label: "投诉建议", href: "/consulting" },
      { label: "隐私政策", href: "#" },
      { label: "服务条款", href: "#" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">W</span>
              </div>
              <span className="text-xl font-bold text-foreground">瓦茨实验室</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              专业矿石元素检测服务平台，提供XRF、ICP-MS、XRD等多种先进检测技术，助力矿业勘探与科学研究。
            </p>

            <div className="mt-6 space-y-3">
              <a href="tel:18600104701" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                18600104701
              </a>
              <a href="mailto:info@ymont.com" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                info@ymont.com
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                北京市海淀区中关村科技园区
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 瓦茨实验室. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}
