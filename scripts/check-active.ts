import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const services = await prisma.servicePrice.findMany({
    include: { category: true },
  })
  
  console.log("所有服务 isActive 状态：")
  services.forEach(s => {
    console.log(`${s.name}: isActive=${s.isActive}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())