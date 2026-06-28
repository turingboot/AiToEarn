#!/bin/bash
set -Eeo pipefail

# 后台:等 mongod 接受连接后,幂等初始化单节点副本集 rs0
(
  until mongosh --quiet --host 127.0.0.1 --eval 'db.adminCommand({ ping: 1 })' >/dev/null 2>&1; do
    sleep 1
  done
  if ! mongosh --quiet --host 127.0.0.1 --eval 'rs.status()' >/dev/null 2>&1; then
    echo "[railway-mongo] initiating single-node replica set rs0"
    mongosh --quiet --host 127.0.0.1 --eval \
      'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] })'
  else
    echo "[railway-mongo] replica set already initialized"
  fi
) &

# --bind_ip_all 同时监听 IPv4/IPv6(Railway 私有网络为 IPv6,必需)
exec docker-entrypoint.sh mongod --replSet rs0 --bind_ip_all
