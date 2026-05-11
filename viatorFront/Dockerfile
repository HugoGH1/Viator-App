FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]