# AiToEarn → Railway 部署运行手册(CLI)

把本地修改过的 AiToEarn(含前端主题/布局改动)全自托管部署到 Railway。
全部服务在**同一个 Railway project** 内,靠**私有网络**(`<服务>.railway.internal`,IPv6)互通,
只有 **nginx** 与 **rustfs** 暴露公网域名。

> 数据库、对象存储均自托管在 Railway,不依赖 Atlas/R2 等外部服务。

---

## 0. 架构与服务清单

| 服务 | 名称 | 来源 | 公网 | 卷 | 内部端口 |
|---|---|---|---|---|---|
| 公网入口 | `nginx` | `deploy/railway/nginx`(Dockerfile)| ✅ | — | `$PORT` |
| 前端 | `web` | `project/aitoearn-web`(Dockerfile,本地源码)| 内网 | — | 3000 |
| 主后端 | `server` | `deploy/railway/server`(Dockerfile)| 内网 | — | 3002 |
| AI 服务 | `ai` | `deploy/railway/ai`(Dockerfile)| 内网 | — | 3010 |
| 数据库 | `mongodb` | `deploy/railway/mongodb`(副本集 rs0)| 内网 | ✅ `/data/db` | 27017 |
| 缓存 | `redis` | Railway 官方 Redis | 内网 | ✅ | 6379 |
| 对象存储 | `rustfs` | 镜像 `rustfs/rustfs:latest` | ✅(媒体)| ✅ `/data` | 9000 |

> ⚠️ 服务名要与下面命令一致(变量引用 `${{服务名.VAR}}` **大小写敏感**)。

---

## 1. 准备

```bash
npm i -g @railway/cli      # 安装 CLI
railway login              # 浏览器登录
cd /Users/tao/Desktop/tx_workspace/AiToEarn
railway init -n aitoearn   # 新建 project(当前目录被 link)
```

> 下面每个服务的模式:`railway add` 建服务 → `railway variables` 注入 → `railway up`/部署 → 需要的话 `railway domain`。
> 多数 CLI 子命令可加 `--service <名>` 指定目标;不确定的 flag 用 `railway <cmd> --help` 确认(CLI 版本间略有差异)。

---

## 2. 基础设施服务(先建,拿到内网/公网地址)

### 2.1 redis(Railway 官方)
```bash
railway add --database redis        # 服务名通常为 "Redis"
```
记下它提供的变量名(`railway variables --service Redis`),一般有 `REDISHOST/REDISPORT/REDISPASSWORD` 或 `REDIS_URL`。
下文用 `${{Redis.REDISHOST}}` / `${{Redis.REDISPASSWORD}}` 引用(按实际变量名改)。

### 2.2 mongodb(单节点副本集,自建镜像)
```bash
railway add --service mongodb
railway volume add --service mongodb --mount-path /data/db
( cd deploy/railway/mongodb && railway up --service mongodb )
```
- 免认证,仅私有网络可达;启动期自动 `rs.initiate` 初始化 `rs0`。
- 连接串:`mongodb://${{mongodb.RAILWAY_PRIVATE_DOMAIN}}:27017/?directConnection=true`

### 2.3 rustfs(对象存储,公网)
见 [`rustfs/README.md`](./rustfs/README.md)。关键:
```bash
railway add --image rustfs/rustfs:latest --service rustfs
railway service rustfs
railway variables --set "RUSTFS_ACCESS_KEY=<key>" --set "RUSTFS_SECRET_KEY=<secret>" \
                  --set "RUSTFS_ADDRESS=[::]:9000" --set "PORT=9000"
railway volume add --service rustfs --mount-path /data
railway domain --service rustfs --port 9000
```
部署后用 `mc` 建公开只读桶 `aitoearn`(命令见 rustfs/README.md)。

---

## 3. nginx 先开域名(后端要用它的公网域名做 appDomain)

```bash
railway add --service nginx
railway domain --service nginx          # 生成公网域名,记为 <NGINX_DOMAIN>
```
> 先生成域名即可拿到 `${{nginx.RAILWAY_PUBLIC_DOMAIN}}` 供别的服务引用;镜像稍后再 `up`。

---

## 4. 后端 ai / server(自建包装镜像 + 环境变量注入)

> 配置注入原理:镜像内置脱敏的 `config.base.yaml`,容器启动时 `railway-config.js`
> 用下列环境变量覆盖基础设施/密钥项,并把所有 `https://localhost` 替换为 `PUBLIC_BASE_URL`。

先准备两个共享密钥(自己生成,server 与 ai 必须一致):
```bash
JWT=$(openssl rand -hex 24); INT=$(openssl rand -hex 24)
RELAY_KEY="<你的 aitoearn.ai Relay API Key, ai_ 开头>"
```

### 4.1 ai
```bash
railway add --service ai
railway service ai
railway variables \
  --set "MONGO_URI=mongodb://\${{mongodb.RAILWAY_PRIVATE_DOMAIN}}:27017/?directConnection=true" \
  --set "REDIS_HOST=\${{Redis.REDISHOST}}" \
  --set "REDIS_PORT=6379" \
  --set "REDIS_PASSWORD=\${{Redis.REDISPASSWORD}}" \
  --set "JWT_SECRET=$JWT" \
  --set "INTERNAL_TOKEN=$INT" \
  --set "SERVER_CLIENT_BASEURL=http://\${{server.RAILWAY_PRIVATE_DOMAIN}}:3002" \
  --set "ASSETS_ENDPOINT=http://\${{rustfs.RAILWAY_PRIVATE_DOMAIN}}:9000" \
  --set "ASSETS_CDN_ENDPOINT=https://\${{rustfs.RAILWAY_PUBLIC_DOMAIN}}/aitoearn" \
  --set "ASSETS_PUBLIC_ENDPOINT=https://\${{rustfs.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "ASSETS_ACCESS_KEY=<RUSTFS_ACCESS_KEY>" \
  --set "ASSETS_SECRET_KEY=<RUSTFS_SECRET_KEY>" \
  --set "RELAY_API_KEY=$RELAY_KEY"
( cd deploy/railway/ai && railway up --service ai )
```

### 4.2 server
```bash
railway add --service server
railway service server
railway variables \
  --set "APP_DOMAIN=\${{nginx.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "PUBLIC_BASE_URL=https://\${{nginx.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "MONGO_URI=mongodb://\${{mongodb.RAILWAY_PRIVATE_DOMAIN}}:27017/?directConnection=true" \
  --set "REDIS_HOST=\${{Redis.REDISHOST}}" \
  --set "REDIS_PORT=6379" \
  --set "REDIS_PASSWORD=\${{Redis.REDISPASSWORD}}" \
  --set "JWT_SECRET=$JWT" \
  --set "INTERNAL_TOKEN=$INT" \
  --set "AI_CLIENT_BASEURL=http://\${{ai.RAILWAY_PRIVATE_DOMAIN}}:3010" \
  --set "ASSETS_ENDPOINT=http://\${{rustfs.RAILWAY_PRIVATE_DOMAIN}}:9000" \
  --set "ASSETS_CDN_ENDPOINT=https://\${{rustfs.RAILWAY_PUBLIC_DOMAIN}}/aitoearn" \
  --set "ASSETS_PUBLIC_ENDPOINT=https://\${{rustfs.RAILWAY_PUBLIC_DOMAIN}}" \
  --set "ASSETS_ACCESS_KEY=<RUSTFS_ACCESS_KEY>" \
  --set "ASSETS_SECRET_KEY=<RUSTFS_SECRET_KEY>" \
  --set "RELAY_SERVER_URL=https://aitoearn.ai/api" \
  --set "RELAY_API_KEY=$RELAY_KEY"
( cd deploy/railway/server && railway up --service server )
```

> 中国版改用 `RELAY_SERVER_URL=https://aitoearn.cn/api`,且 `RELAY_API_KEY` 必须是对应环境的 Key,否则 401。

---

## 5. web(本地源码构建,带公网 OSS 构建变量)

```bash
railway add --service web
railway service web
# NEXT_PUBLIC_* 是 Next 构建期变量(已在 web/Dockerfile 声明 ARG),Railway 构建时注入
railway variables \
  --set "NEXT_PUBLIC_API_URL=/api" \
  --set "NEXT_PUBLIC_OSS_URL=https://\${{rustfs.RAILWAY_PUBLIC_DOMAIN}}/aitoearn/"
( cd project/aitoearn-web && railway up --service web )
```

> `railway up` 会上传**当前本地目录**并用其 Dockerfile 构建 —— 部署的就是你本地这版(含主题/布局改动),无需 push GitHub。

---

## 6. nginx 部署(最后,反代到内网各服务)

```bash
railway service nginx
railway variables \
  --set "WEB_UPSTREAM=\${{web.RAILWAY_PRIVATE_DOMAIN}}:3000" \
  --set "SERVER_UPSTREAM=\${{server.RAILWAY_PRIVATE_DOMAIN}}:3002" \
  --set "AI_UPSTREAM=\${{ai.RAILWAY_PRIVATE_DOMAIN}}:3010" \
  --set "OSS_UPSTREAM=\${{rustfs.RAILWAY_PRIVATE_DOMAIN}}:9000"
( cd deploy/railway/nginx && railway up --service nginx )
```

nginx 监听 `$PORT`(Railway 注入),运行时通过私有网络 DNS 动态解析上游(IPv6)。

---

## 7. 验证

```bash
NGINX="https://<NGINX_DOMAIN>"
curl -s "$NGINX/_nhealth"          # healthy
curl -s -o /dev/null -w "%{http_code}\n" "$NGINX/api/health"      # 200
curl -s -o /dev/null -w "%{http_code}\n" "$NGINX/api/ai/health"   # 200
```
浏览器打开 `$NGINX`:首屏是新主题/布局;配置管理页 Server/AI 两栏都能加载;发布时媒体 URL 为
`https://<rustfs 公网域名>/aitoearn/...`(公网可达,外部平台能抓取)。

---

## 8. 变量速查(每服务最少必填)

| 服务 | 必填变量 |
|---|---|
| mongodb | (无,仅挂卷) |
| redis | (Railway 自带) |
| rustfs | `RUSTFS_ACCESS_KEY` `RUSTFS_SECRET_KEY` `RUSTFS_ADDRESS=[::]:9000` `PORT=9000` + 卷 + 域名 |
| ai | `MONGO_URI` `REDIS_HOST/PORT/PASSWORD` `JWT_SECRET` `INTERNAL_TOKEN` `SERVER_CLIENT_BASEURL` `ASSETS_*` `RELAY_API_KEY` |
| server | ai 的全部 + `APP_DOMAIN` `PUBLIC_BASE_URL` `AI_CLIENT_BASEURL` `RELAY_SERVER_URL` |
| web | `NEXT_PUBLIC_API_URL=/api` `NEXT_PUBLIC_OSS_URL=https://<rustfs公网>/aitoearn/`(构建期) |
| nginx | `WEB_UPSTREAM` `SERVER_UPSTREAM` `AI_UPSTREAM` `OSS_UPSTREAM` + 公网域名 |

> server 与 ai 的 `JWT_SECRET`、`INTERNAL_TOKEN` 必须**完全一致**(内部互信)。

---

## 9. 常见坑

1. **IPv6**:Railway 私有网络是 IPv6。mongodb 用 `--bind_ip_all`(已内置);rustfs 用 `RUSTFS_ADDRESS=[::]:9000`;nginx 用动态 `resolver`(已内置)。若内网连不通,优先查上游是否监听了 IPv6。
2. **构建期变量**:`NEXT_PUBLIC_OSS_URL` 必须在 `web` **构建前**设好(Next 构建期烘焙)。改了它要**重新 `railway up` web**。
3. **变量引用顺序**:`server` 的 `APP_DOMAIN` 依赖 `nginx` 域名,所以第 3 步先给 nginx 开域名。
4. **Redis 变量名**:不同模板变量名可能不同,用 `railway variables --service Redis` 核对后再引用。
5. **Relay 环境匹配**:`RELAY_API_KEY` 与 `RELAY_SERVER_URL` 必须同属国际版(aitoearn.ai)或中国版(aitoearn.cn),否则 401。
6. **rustfs 公开桶**:不建 `aitoearn` 桶或没设匿名下载,媒体读取/发布会失败(见 rustfs/README.md)。
7. **重新部署**:改了 `deploy/railway/<svc>` 下文件,重新 `cd` 进去 `railway up --service <svc>` 即可。

---

## 10. 本地已验证

- `deploy/railway/{server,ai}` 包装镜像本地构建通过,`railway-config.js` 实测能把
  mongo/redis/rustfs/inter-service/appDomain/各平台 redirectUri/relay 全部正确注入。
- `deploy/railway/nginx` 渲染后 `nginx -t` 通过;`deploy/railway/mongodb` 镜像构建通过。
- `config.base.yaml` 已脱敏(无任何真实密钥),密钥仅经 Railway 环境变量注入。
