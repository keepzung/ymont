import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const services = await prisma.servicePrice.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  })
  
  console.log("数据库中的检测项目：")
  console.log("===================")
  
  const grouped = services.reduce((acc, s) => {
    const cat = s.category?.name || "其他"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s.name)
    return acc
  }, {} as Record<string, string[]>)
  
  for (const [cat, items] of Object.entries(grouped)) {
    console.log(`\n【${cat}】`)
    items.forEach(item => console.log(`  - ${item}`))
  }
  
  console.log(`\n总计: ${services.length} 项`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())