# Railway server 服务:基于官方镜像,启动期注入 Railway 专属配置
FROM aitoearn/aitoearn-server:latest
WORKDIR /app
# 构建上下文 = 仓库根(Railway 上传 git 根);路径相对仓库根
COPY deploy/railway/server/config.base.yaml /app/config.yaml
COPY deploy/railway/server/railway-config.js /app/railway-config.js
COPY deploy/railway/server/entrypoint.sh /railway-entrypoint.sh
RUN chmod +x /railway-entrypoint.sh
ENTRYPOINT ["/railway-entrypoint.sh"]
