# Railway ai 服务:基于官方镜像,启动期注入 Railway 专属配置
FROM aitoearn/aitoearn-ai:latest
WORKDIR /app
COPY config.base.yaml /app/config.yaml
COPY railway-config.js /app/railway-config.js
COPY entrypoint.sh /railway-entrypoint.sh
RUN chmod +x /railway-entrypoint.sh
ENTRYPOINT ["/railway-entrypoint.sh"]
