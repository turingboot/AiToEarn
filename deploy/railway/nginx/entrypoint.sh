#!/bin/sh
set -e

# Railway 通过 $PORT 指定对外端口
export PORT="${PORT:-8080}"

# 从容器 DNS 配置动态取 Railway 私有网络解析器(不硬编码 IP)
RESOLVER="$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf 2>/dev/null)"
RESOLVER="${RESOLVER:-8.8.8.8}"
# Railway 内网 DNS 是 IPv6,nginx 要求 IPv6 resolver 地址加方括号
case "$RESOLVER" in
  *:*) RESOLVER="[$RESOLVER]" ;;
esac
export RESOLVER

# 上游服务(私有网络);可被同名环境变量覆盖
export WEB_UPSTREAM="${WEB_UPSTREAM:-aitoearn-web.railway.internal:3000}"
export SERVER_UPSTREAM="${SERVER_UPSTREAM:-aitoearn-server.railway.internal:3002}"
export AI_UPSTREAM="${AI_UPSTREAM:-aitoearn-ai.railway.internal:3010}"
export OSS_UPSTREAM="${OSS_UPSTREAM:-aitoearn-rustfs.railway.internal:9000}"

# 仅替换这些占位,保留 nginx 自身的 $ 变量
envsubst '${PORT} ${RESOLVER} ${WEB_UPSTREAM} ${SERVER_UPSTREAM} ${AI_UPSTREAM} ${OSS_UPSTREAM}' \
  < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

nginx -t
exec nginx -g 'daemon off;'
