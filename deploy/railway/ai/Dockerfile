# Railway ai 服务:基于官方镜像,启动期注入 Railway 专属配置
FROM aitoearn/aitoearn-ai:latest
WORKDIR /app
# 构建上下文 = 仓库根(Railway 上传 git 根);路径相对仓库根
COPY deploy/railway/ai/config.base.yaml /app/config.yaml
COPY deploy/railway/ai/railway-config.js /app/railway-config.js
COPY deploy/railway/ai/entrypoint.sh /railway-entrypoint.sh
RUN chmod +x /railway-entrypoint.sh
ENTRYPOINT ["/railway-entrypoint.sh"]
