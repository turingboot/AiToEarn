# Railway 公网入口:反代到私有网络的 web/server/ai/rustfs
FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /railway-nginx-entrypoint.sh
RUN chmod +x /railway-nginx-entrypoint.sh
ENTRYPOINT ["/railway-nginx-entrypoint.sh"]
