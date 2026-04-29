#!/bin/sh
set -e

echo "🗃️  Running Prisma db push..."
npx prisma db push --url "$DIRECT_URL"

echo "🌱  Running seed..."
npx ts-node -r tsconfig-paths/register prisma/seed.ts || echo "⚠️  Seed skipped (already seeded or error)."

echo "🚀  Starting Bogaad API..."
exec node dist/src/main
