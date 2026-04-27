import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 确保所有服务都设为 active
  const result = await prisma.servicePrice.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  })
  console.log(`已激活 ${result.count} 项服务`)

  const services = await prisma.servicePrice.findMany({
    where: { isActive: true },
    select: { name: true },
  })
  console.log(`\n当前激活的服务: ${services.length} 项`)
  services.forEach(s => console.log(`  - ${s.name}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())