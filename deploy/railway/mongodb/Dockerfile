# Railway MongoDB:单节点副本集 rs0(应用事务所需)
# 仅在 Railway 私有网络内可达,默认免认证(私网隔离)。
# 构建上下文 = 仓库根(Railway 上传 git 根),Dockerfile 路径经 RAILWAY_DOCKERFILE_PATH 指定
FROM mongo:7
COPY deploy/railway/mongodb/entrypoint.sh /railway-mongo-entrypoint.sh
RUN chmod +x /railway-mongo-entrypoint.sh
ENTRYPOINT ["/railway-mongo-entrypoint.sh"]
