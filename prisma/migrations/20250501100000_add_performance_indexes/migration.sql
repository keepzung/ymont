-- 瓦茨实验室数据库优化索引
-- 执行: npx prisma migrate dev --name add_performance_indexes

-- 用户索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 订单索引
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders("createdAt");

-- 咨询索引
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations("userId");
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- 预约索引
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings("createdAt");

-- 取样索引
CREATE INDEX IF NOT EXISTS idx_pickups_user ON "pickupRequests"("userId");
CREATE INDEX IF NOT EXISTS idx_pickups_status ON "pickupRequests"(status);

-- 报告索引
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports("userId");
CREATE INDEX IF NOT EXISTS idx_reports_order ON reports("orderId");

-- 支付索引
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments("orderId");

-- 新闻索引
CREATE INDEX IF NOT EXISTS idx_news_published ON news("isPublished");
CREATE INDEX IF NOT EXISTS idx_news_featured ON news("isFeatured");

-- 服务索引
CREATE INDEX IF NOT EXISTS idx_services_category ON "servicePrice"("categoryId");
CREATE INDEX IF NOT EXISTS idx_services_active ON "servicePrice"(isActive);