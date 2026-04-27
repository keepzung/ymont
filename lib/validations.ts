import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("请输入有效邮箱").optional(),
  phone: z.string().min(11, "请输入有效手机号").optional(),
  password: z.string().min(6, "密码至少6位"),
}).refine((data) => data.email || data.phone, {
  message: "请输入邮箱或手机号",
})

export const registerSchema = z.object({
  name: z.string().min(1, "请输入姓名").max(20, "姓名最多20个字符"),
  email: z.string().email("请输入有效邮箱").optional().or(z.literal("")),
  phone: z.string().min(11, "请输入有效手机号").optional().or(z.literal("")),
  password: z.string().min(6, "密码至少6位").max(32, "密码最多32位"),
  confirmPassword: z.string(),
  role: z.enum(["INDIVIDUAL", "ENTERPRISE", "RESEARCH"]),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"],
}).refine((data) => data.email || data.phone, {
  message: "请输入邮箱或手机号",
})

export const orderSchema = z.object({
  sampleName: z.string().min(1, "请输入样品名称"),
  sampleType: z.string().optional(),
  sampleWeight: z.string().optional(),
  sampleSize: z.string().optional(),
  sampleDesc: z.string().optional(),
  serviceIds: z.array(z.string()).min(1, "请至少选择一个检测项目"),
  couponCode: z.string().optional(),
  remark: z.string().optional(),
})

export const consultationSchema = z.object({
  subject: z.string().min(1, "请输入咨询主题").max(100, "主题最多100个字符"),
  message: z.string().min(10, "咨询内容至少10个字符").max(2000, "内容最多2000个字符"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type ConsultationInput = z.infer<typeof consultationSchema>
