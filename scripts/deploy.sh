#!/bin/bash
set -e

echo "=== 瓦茨实验室 部署脚本 ==="

echo "[1/6] 检查环境..."
command -v docker >/dev/null 2>&1 || { echo "错误: 未安装 Docker"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "错误: 未安装 Docker Compose"; exit 1; }

echo "[2/6] 配置环境变量..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "已创建 .env 文件，请修改其中的配置后再运行此脚本"
  echo "重要: 请修改 AUTH_SECRET, DB_PASSWORD 等敏感配置"
  exit 1
fi

echo "[3/6] 构建 Docker 镜像..."
docker compose build

echo "[4/6] 启动服务..."
docker compose up -d

echo "[5/6] 等待数据库就绪..."
sleep 5

echo "[6/6] 运行数据库迁移和种子..."
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed

echo ""
echo "=== 部署完成 ==="
echo "应用已启动在 http://localhost:3000"
echo "管理后台: http://localhost:3000/admin"
echo ""
echo "后续步骤:"
echo "  1. 修改 .env 中的配置（域名、密钥等）"
echo "  2. 配置 SSL 证书: 运行 ./scripts/setup-ssl.sh"
echo "  3. 修改 nginx/conf.d/default.conf 中的 server_name 和证书路径"
