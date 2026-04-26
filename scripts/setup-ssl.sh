#!/bin/bash
set -e

DOMAIN=${1:-"example.com"}
EMAIL=${2:-"admin@example.com"}

echo "=== 配置 SSL 证书 ==="
echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"

if [ ! -d certbot ]; then
  mkdir -p certbot/conf certbot/www
fi

docker run -it --rm \
  -v ./certbot/conf:/etc/letsencrypt \
  -v ./certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN

echo "证书已生成，请更新 nginx/conf.d/default.conf 中的 YOUR_DOMAIN 为 $DOMAIN"

docker compose restart nginx

echo "SSL 配置完成！"
