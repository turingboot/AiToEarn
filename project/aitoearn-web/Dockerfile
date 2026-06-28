FROM node:lts-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod=false

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建期公开变量(Next.js 在 build 时烘焙进前端包)
# - NEXT_PUBLIC_API_URL:默认走相对 /api(经 nginx 反代,同源)
# - NEXT_PUBLIC_OSS_URL:媒体公网基址(Railway 上指向 rustfs 公网域名;发布媒体需公网可达)
ARG NEXT_PUBLIC_API_URL="/api"
ARG NEXT_PUBLIC_OSS_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_OSS_URL=$NEXT_PUBLIC_OSS_URL

RUN pnpm build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
