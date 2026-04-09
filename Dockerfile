# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Prisma needs openssl on alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies first (layer cache-friendly)
COPY package*.json ./
RUN npm ci

# Copy source and generate prisma client, then compile TypeScript
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Production stage ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Prisma needs openssl on alpine
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production

# Copy everything needed to run (incl. src & tsconfig for ts-node seed)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3001

# start.sh: pushes DB schema, seeds, then starts the app
CMD ["./start.sh"]

