export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

export function generateOrderNo(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `WC${y}${m}${d}${rand}`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  })
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "待付款", color: "text-yellow-600" },
  PENDING_SAMPLE: { label: "待寄样", color: "text-blue-600" },
  SAMPLE_RECEIVED: { label: "已收样", color: "text-indigo-600" },
  TESTING: { label: "检测中", color: "text-purple-600" },
  DATA_ANALYSIS: { label: "数据分析", color: "text-cyan-600" },
  REPORT_READY: { label: "报告就绪", color: "text-green-600" },
  COMPLETED: { label: "已完成", color: "text-gray-600" },
  CANCELLED: { label: "已取消", color: "text-red-600" },
  REFUNDED: { label: "已退款", color: "text-orange-600" },
}

export const ORDER_STATUS_FLOW = [
  { key: "PENDING_PAYMENT", label: "待付款", desc: "等待支付" },
  { key: "PENDING_SAMPLE", label: "待寄样", desc: "等待寄送样品" },
  { key: "SAMPLE_RECEIVED", label: "已收样", desc: "样品已送达实验室" },
  { key: "TESTING", label: "检测中", desc: "正在进行元素检测" },
  { key: "DATA_ANALYSIS", label: "数据分析", desc: "检测数据分析" },
  { key: "REPORT_READY", label: "报告就绪", desc: "检测报告已生成" },
  { key: "COMPLETED", label: "已完成", desc: "报告已交付" },
]

export const USER_ROLE_MAP: Record<string, string> = {
  INDIVIDUAL: "个人用户",
  ENTERPRISE: "企业用户",
  RESEARCH: "科研机构",
  ADMIN: "管理员",
}
