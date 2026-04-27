# 瓦茨实验室 - 完整优化升级方案

## 一、架构优化

### 1.1 用户认证优化
- 问题：每个API都重复定义getUserFromRequest函数
- 解决：统一使用lib/auth-helper.ts中的函数
- 优化：添加30秒用户缓存，减少数据库查询

### 1.2 数据库优化
- 添加关键字段索引：
  - orders.userId, orders.status, orders.createdAt
  - consultations.userId, consultations.status
  - bookings.status
  - servicePrice.categoryId

## 二、功能优化

### 2.1 登录流程
- 简化：邮箱/手机号二选一登录
- 安全：登录失败次数限制
- 体验：登录后自动跳转到对应后台

### 2.2 订单流程
- 状态流转：PENDING_PAYMENT → PENDING_SAMPLE → SAMPLE_RECEIVED → TESTING → DATA_ANALYSIS → REPORT_READY → COMPLETED
- 管理操作：管理员可修改状态、添加备注
- 用户操作：查看订单、取消待付款订单

### 2.3 检测项目管理
- 分类管理：CRUD操作
- 项目管理：CRUD、上下架
- 批量操作：批量启用/禁用

## 三、安全优化

### 3.1 API权限控制
- 所有管理API需ADMIN/SUPER_ADMIN权限
- 用户只能访问自己的数据
- 敏感操作记录日志

### 3.2 数据验证
- 所有输入使用Zod验证
- XSS防护
- SQL注入防护（Prisma原生防护）

## 四、性能优化

### 4.1 前端优化
- 组件懒加载
- API响应缓存
- 图片优化

### 4.2 后端优化
- 用户信息缓存
- 数据库查询优化
- API分页

## 五、代码规范

### 5.1 项目结构
```
/app
  /(main)      - 公开页面
  /(auth)      - 认证页面
  /(dashboard) - 用户后台
  /(admin)     - 管理后台
  /api         - API接口
/components   - React组件
/lib          - 工具函数
/prisma       - 数据库
```

### 5.2 命名规范
- 页面：page.tsx
- 组件：*.tsx
- 工具：*.ts
- API：route.ts

## 六、部署配置

### 6.1 环境变量
- DATABASE_URL - Supabase连接
- AUTH_SECRET - 认证密钥
- AUTH_URL - 网站域名

### 6.2 Vercel
- 构建命令：pnpm build
- Node版本：18+