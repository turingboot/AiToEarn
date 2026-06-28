# RustFS 对象存储(Railway)

RustFS 直接用官方镜像 `rustfs/rustfs:latest`,无需自建镜像。要点:

1. **开公网域名**:媒体 URL 必须公网可达(否则发布到 LinkedIn/Twitter 等外部平台会失败)。
2. **挂卷**:`/data` 持久化对象。
3. **IPv6 绑定**:Railway 私有网络是 IPv6,需让 RustFS 监听 `::`(见变量)。
4. **公开只读桶**:创建 `aitoearn` 桶并设匿名下载,媒体才能被公网直接读取。

## 创建服务(CLI)

```bash
railway add --image rustfs/rustfs:latest --service rustfs
railway service rustfs
railway variables --set "RUSTFS_ACCESS_KEY=<自定义>" \
                  --set "RUSTFS_SECRET_KEY=<自定义>" \
                  --set "RUSTFS_ADDRESS=[::]:9000" \
                  --set "PORT=9000"
# 挂卷(确认 flag:railway volume --help)
railway volume add --service rustfs --mount-path /data
# 开公网域名,目标端口 9000
railway domain --service rustfs --port 9000
```

> 若 `RUSTFS_ADDRESS=[::]:9000` 导致启动异常,改用 `0.0.0.0:9000` 仅供公网访问;
> 内网访问可改走 nginx 的 `/oss` 反代(已内置)。

## 一次性:建公开只读桶 `aitoearn`

部署好、拿到 rustfs 公网域名后,用本机 `mc`(MinIO Client)对接公网域名执行一次:

```bash
# 安装 mc: brew install minio/stable/mc
RUSTFS_PUBLIC="https://<rustfs 公网域名>"
mc alias set aitoearn-rustfs "$RUSTFS_PUBLIC" <RUSTFS_ACCESS_KEY> <RUSTFS_SECRET_KEY>
mc mb --ignore-existing aitoearn-rustfs/aitoearn
mc anonymous set download aitoearn-rustfs/aitoearn   # 公开只读
```

验证:`curl -I "$RUSTFS_PUBLIC/aitoearn/"` 能连通即可。

## 关键产物地址(供其它服务变量引用)

- 内网(server/ai 用):`http://${{rustfs.RAILWAY_PRIVATE_DOMAIN}}:9000`
- 公网(媒体 URL / 前端 OSS):`https://${{rustfs.RAILWAY_PUBLIC_DOMAIN}}`
  - 后端 `ASSETS_CDN_ENDPOINT = https://${{rustfs.RAILWAY_PUBLIC_DOMAIN}}/aitoearn`
  - 前端 `NEXT_PUBLIC_OSS_URL  = https://${{rustfs.RAILWAY_PUBLIC_DOMAIN}}/aitoearn/`
