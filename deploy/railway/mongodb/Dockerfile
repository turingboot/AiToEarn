# Railway MongoDB:单节点副本集 rs0(应用事务所需)
# 仅在 Railway 私有网络内可达,默认免认证(私网隔离)。
FROM mongo:7
COPY entrypoint.sh /railway-mongo-entrypoint.sh
RUN chmod +x /railway-mongo-entrypoint.sh
ENTRYPOINT ["/railway-mongo-entrypoint.sh"]
