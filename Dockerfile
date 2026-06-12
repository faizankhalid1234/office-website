# Production Docker — Railway deploy
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/scripts/railway-start.sh ./scripts/railway-start.sh
RUN chmod +x ./scripts/railway-start.sh

EXPOSE 3000

# Inline start — no old --skip-generate flags
CMD ["sh", "-c", "export HOSTNAME=0.0.0.0 PORT=${PORT:-3000} && echo '[start] db push...' && npx prisma db push --config=prisma.config.ts --accept-data-loss && echo '[start] seed...' && (npx tsx prisma/seed.ts || true) && echo '[start] next on 0.0.0.0:'$PORT && exec npx next start -H 0.0.0.0 -p $PORT"]
