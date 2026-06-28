#!/bin/sh
set -e
# 启动期用环境变量注入配置,然后按官方镜像方式启动
node /app/railway-config.js
exec pm2-runtime start "apps/${APP_NAME}/src/main.js" --name "${APP_NAME}" -- -c config.yaml
