# Railway server 服务:基于官方镜像,启动期注入 Railway 专属配置
FROM aitoearn/aitoearn-server:latest
WORKDIR /app
# 随镜像打包的脱敏基础配置(密钥/基础设施值在启动期由环境变量注入)
COPY config.base.yaml /app/config.yaml
COPY railway-config.js /app/railway-config.js
COPY entrypoint.sh /railway-entrypoint.sh
RUN chmod +x /railway-entrypoint.sh
ENTRYPOINT ["/railway-entrypoint.sh"]
