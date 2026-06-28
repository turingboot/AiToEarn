/**
 * Railway 启动期配置注入
 * 读取 /app/config.yaml(随镜像打包的脱敏基础配置),用环境变量覆盖
 * 基础设施地址与密钥,再写回。server 与 ai 共用同一份脚本。
 * 仅在对应环境变量存在时才覆盖,缺省则保留基础配置里的值。
 */
const fs = require('node:fs')
const YAML = require('yaml')

const FILE = '/app/config.yaml'
const doc = YAML.parse(fs.readFileSync(FILE, 'utf8'))
const E = process.env

function set(path, val) {
  if (val === undefined || val === null || val === '')
    return
  const keys = path.split('.')
  let o = doc
  for (let i = 0; i < keys.length - 1; i++) {
    if (o[keys[i]] == null || typeof o[keys[i]] !== 'object')
      o[keys[i]] = {}
    o = o[keys[i]]
  }
  o[keys[keys.length - 1]] = val
}

// ---- 通用基础设施 ----
set('appDomain', E.APP_DOMAIN)
set('auth.secret', E.JWT_SECRET)
set('auth.internalToken', E.INTERNAL_TOKEN)
for (const base of ['redis', 'redlock.redis']) {
  set(`${base}.host`, E.REDIS_HOST)
  set(`${base}.port`, E.REDIS_PORT && Number(E.REDIS_PORT))
  set(`${base}.username`, E.REDIS_USERNAME)
  set(`${base}.password`, E.REDIS_PASSWORD)
}
set('mongodb.uri', E.MONGO_URI)
set('assets.endpoint', E.ASSETS_ENDPOINT)
set('assets.cdnEndpoint', E.ASSETS_CDN_ENDPOINT)
set('assets.publicEndpoint', E.ASSETS_PUBLIC_ENDPOINT)
set('assets.accessKeyId', E.ASSETS_ACCESS_KEY)
set('assets.secretAccessKey', E.ASSETS_SECRET_KEY)
set('assets.bucketName', E.ASSETS_BUCKET)

// ---- server 专属 ----
set('aiClient.baseUrl', E.AI_CLIENT_BASEURL)
set('aiClient.token', E.INTERNAL_TOKEN)
set('channel.channelDb.uri', E.MONGO_URI)
set('channel.shortLink.baseUrl', E.SHORTLINK_BASEURL)
set('relay.serverUrl', E.RELAY_SERVER_URL)
set('relay.apiKey', E.RELAY_API_KEY)
set('relay.callbackUrl', E.RELAY_CALLBACK_URL)

// ---- ai 专属 ----
set('serverClient.baseUrl', E.SERVER_CLIENT_BASEURL)
// AI 模型服务商默认全部走 aitoearn 官方 Relay(同一把 key);如需单独 key 用各自变量覆盖
const aiKey = E.AI_RELAY_API_KEY || E.RELAY_API_KEY
for (const p of ['openai', 'gemini', 'anthropic'])
  set(`ai.${p}.apiKey`, aiKey)
set('ai.relay.apiKey', aiKey)
set('agent.apiKey', aiKey)
set('ai.grok.apiKey', E.GROK_API_KEY)
set('ai.dashscope.apiKey', E.DASHSCOPE_API_KEY)

// ---- 把基础配置里残留的 localhost 占位统一替换为公网入口 ----
// 覆盖各平台 OAuth redirectUri、shortLink、relay 回调等 http(s)://localhost[:port]
if (E.PUBLIC_BASE_URL) {
  const base = E.PUBLIC_BASE_URL.replace(/\/+$/, '')
  const walk = (o) => {
    if (Array.isArray(o))
      return o.forEach(walk)
    if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) {
        if (typeof o[k] === 'string')
          o[k] = o[k].replace(/https?:\/\/localhost(:\d+)?/g, base)
        else walk(o[k])
      }
    }
  }
  walk(doc)
}

fs.writeFileSync(FILE, YAML.stringify(doc))
console.log('[railway-config] config.yaml patched from environment variables')
