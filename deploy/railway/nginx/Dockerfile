# Railway 公网入口:反代到私有网络的 web/server/ai/rustfs
FROM nginx:alpine
# 构建上下文 = 仓库根(Railway 上传 git 根);路径相对仓库根
COPY deploy/railway/nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY deploy/railway/nginx/entrypoint.sh /railway-nginx-entrypoint.sh
RUN chmod +x /railway-nginx-entrypoint.sh
ENTRYPOINT ["/railway-nginx-entrypoint.sh"]
