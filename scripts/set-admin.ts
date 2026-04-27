import { prisma } from "@/lib/db"

async function main() {
  await prisma.user.updateMany({
    where: { email: { in: ["31413739@qq.com", "54879218@qq.com"] } },
    data: { role: "SUPER_ADMIN" },
  })
  console.log("Updated admin roles")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())