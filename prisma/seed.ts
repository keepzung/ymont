import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("正在初始化种子数据...")

  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@labs.com" },
    update: {},
    create: {
      email: "admin@labs.com",
      name: "管理员",
      phone: "13800000000",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log(`管理员账户: ${admin.email} (密码: admin123)`)

  const categories = [
    { name: "XRF荧光光谱", slug: "xrf", description: "X射线荧光光谱分析", sortOrder: 1 },
    { name: "ICP质谱分析", slug: "icp", description: "电感耦合等离子体质谱分析", sortOrder: 2 },
    { name: "X射线衍射", slug: "xrd", description: "X射线衍射物相分析", sortOrder: 3 },
    { name: "原子吸收光谱", slug: "aas", description: "原子吸收光谱分析", sortOrder: 4 },
    { name: "稀土元素", slug: "ree", description: "稀土元素分析", sortOrder: 5 },
    { name: "矿物鉴定", slug: "mineral", description: "矿物鉴定与分析", sortOrder: 6 },
  ]

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("检测分类已创建")

  const serviceData = [
    { cat: "xrf", items: [
      { name: "手持XRF检测", code: "XRF-H", instrument: "手持式XRF光谱仪", price: 80, turnaround: "1-2天" },
      { name: "台式XRF检测", code: "XRF-B", instrument: "台式XRF光谱仪", price: 150, turnaround: "2-3天" },
      { name: "XRF全元素扫描", code: "XRF-F", instrument: "波长色散XRF光谱仪", price: 200, turnaround: "3-5天" },
      { name: "熔融制样XRF", code: "XRF-M", instrument: "熔融制样+XRF", price: 280, turnaround: "3-5天" },
    ]},
    { cat: "icp", items: [
      { name: "ICP-OES常规分析", code: "ICP-OES", instrument: "ICP-OES光谱仪", price: 120, turnaround: "2-3天" },
      { name: "ICP-MS痕量分析", code: "ICP-MS", instrument: "ICP-MS质谱仪", price: 200, turnaround: "3-5天" },
      { name: "ICP-MS同位素分析", code: "ICP-ISO", instrument: "MC-ICP-MS", price: 350, turnaround: "5-7天" },
      { name: "LA-ICP-MS原位分析", code: "LA-ICP", instrument: "LA-ICP-MS联用", price: 500, turnaround: "5-7天" },
    ]},
    { cat: "xrd", items: [
      { name: "XRD定性分析", code: "XRD-Q", instrument: "X射线衍射仪", price: 100, turnaround: "2-3天" },
      { name: "XRD定量分析", code: "XRD-R", instrument: "X射线衍射仪+Rietveld", price: 180, turnaround: "3-5天" },
      { name: "微区XRD分析", code: "XRD-M", instrument: "微区X射线衍射仪", price: 300, turnaround: "5-7天" },
      { name: "高温原位XRD", code: "XRD-HT", instrument: "高温原位XRD", price: 400, turnaround: "5-7天" },
    ]},
    { cat: "aas", items: [
      { name: "火焰AAS检测", code: "AAS-F", instrument: "火焰原子吸收光谱仪", price: 80, turnaround: "1-2天" },
      { name: "石墨炉AAS检测", code: "AAS-G", instrument: "石墨炉原子吸收光谱仪", price: 150, turnaround: "2-3天" },
      { name: "氢化物AAS检测", code: "AAS-H", instrument: "氢化物发生AAS", price: 120, turnaround: "2-3天" },
      { name: "冷原子测汞", code: "AAS-CV", instrument: "冷原子吸收测汞仪", price: 100, turnaround: "1-2天" },
    ]},
    { cat: "ree", items: [
      { name: "稀土总量测定", code: "REE-T", instrument: "ICP-OES", price: 150, turnaround: "3-5天" },
      { name: "稀土配分分析", code: "REE-D", instrument: "ICP-MS", price: 350, turnaround: "5-7天" },
      { name: "稀土矿物鉴定", code: "REE-M", instrument: "SEM+EDS", price: 200, turnaround: "3-5天" },
      { name: "稀土浸出试验", code: "REE-L", instrument: "浸出+ICP-MS", price: 500, turnaround: "7-10天" },
    ]},
    { cat: "mineral", items: [
      { name: "常规矿物鉴定", code: "MIN-R", instrument: "偏光显微镜", price: 120, turnaround: "2-3天" },
      { name: "电子探针分析", code: "MIN-EPMA", instrument: "EPMA电子探针", price: 300, turnaround: "5-7天" },
      { name: "MLA矿物分析", code: "MIN-MLA", instrument: "MLA矿物自动分析系统", price: 500, turnaround: "5-7天" },
      { name: "流体包裹体分析", code: "MIN-FL", instrument: "显微测温+拉曼光谱", price: 400, turnaround: "5-7天" },
    ]},
  ]

  for (const group of serviceData) {
    const category = await prisma.serviceCategory.findUnique({ where: { slug: group.cat } })
    if (!category) continue

    for (const item of group.items) {
      await prisma.servicePrice.upsert({
        where: { code: item.code },
        update: {},
        create: {
          ...item,
          categoryId: category.id,
          unit: "次",
        },
      })
    }
  }
  console.log("检测项目及价格已创建")

  const newsData = [
    { title: "瓦茨实验室新增LA-ICP-MS原位分析服务", slug: "new-la-icp-ms", summary: "新增激光剥蚀电感耦合等离子体质谱原位分析服务，可实现微区原位元素分析。", content: "瓦茨实验室近日新增LA-ICP-MS原位分析服务，该技术可实现对矿物微区的原位元素分析，空间分辨率可达10μm级别，广泛应用于矿床学、地球化学等领域。", isPublished: true, isFeatured: true, publishedAt: new Date() },
    { title: "XRF与ICP-MS在矿石检测中的应用对比", slug: "xrf-vs-icp-ms", summary: "详细对比XRF荧光光谱与ICP-MS质谱在矿石元素检测中的优缺点和适用场景。", content: "XRF和ICP-MS是矿石元素检测中最常用的两种技术手段。XRF具有无损、快速、成本低等优点，适合主量元素分析；ICP-MS灵敏度高、检测限低，适合痕量元素分析。", isPublished: true, isFeatured: false, publishedAt: new Date() },
    { title: "2024年国内稀土矿检测标准更新解读", slug: "ree-standard-2024", summary: "解读2024年最新发布的稀土矿检测相关国家标准。", content: "2024年国家发布了多项稀土矿检测相关标准的更新版本，涉及稀土总量测定、稀土配分分析等关键检测方法。", isPublished: true, isFeatured: false, publishedAt: new Date() },
    { title: "助力某矿业集团完成金矿资源评价", slug: "gold-resource-evaluation", summary: "瓦茨实验室成功助力某大型矿业集团完成金矿资源评价项目。", content: "瓦茨实验室近日成功完成某大型矿业集团委托的金矿资源评价项目，通过系统的元素分析和矿物鉴定，为客户提供了可靠的数据支撑。", isPublished: true, isFeatured: false, publishedAt: new Date() },
  ]

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    })
  }
  console.log("新闻数据已创建")

  const coupon = await prisma.coupon.upsert({
    where: { code: "WELCOME100" },
    update: {},
    create: {
      code: "WELCOME100",
      name: "新用户注册好礼",
      type: "FIXED",
      value: 100,
      minAmount: 200,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
    },
  })
  console.log(`优惠券已创建: ${coupon.code}`)

  console.log("\n种子数据初始化完成！")
  console.log("管理员: admin@labs.com / admin123")
  console.log("优惠券: WELCOME100 (满200减100)")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
