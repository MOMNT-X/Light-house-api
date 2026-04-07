# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
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
WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Run the compiled NestJS app
CMD ["node", "dist/main"]
