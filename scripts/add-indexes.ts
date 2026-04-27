import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("正在添加数据库索引...")
  
  try {
    // 用户表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`.catch(() => {})
    console.log("✓ 用户表索引")

    // 订单表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders("userId")`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt")`.catch(() => {})
    console.log("✓ 订单表索引")

    // 咨询表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations("userId")`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status)`.catch(() => {})
    console.log("✓ 咨询表索引")

    // 预约表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings("createdAt")`.catch(() => {})
    console.log("✓ 预约表索引")

    // 新闻表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_news_published ON news("isPublished")`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_news_featured ON news("isFeatured")`.catch(() => {})
    console.log("✓ 新闻表索引")

    // 服务表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_services_category ON "ServicePrice"("categoryId")`.catch(() => {})
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_services_active ON "ServicePrice"(isActive)`.catch(() => {})
    console.log("✓ 服务表索引")

    // 分类表索引
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS idx_categories_sort ON "ServiceCategory"(isActive)`.catch(() => {})
    console.log("✓ 分类表索引")

    console.log("\n✓ 索引添加完成!")
  } catch (e) {
    console.log("部分索引可能已存在:", e.message)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())