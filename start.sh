#!/bin/sh
set -e

echo "🗃️  Running Prisma db push..."
npx prisma db push --skip-generate

echo "🌱  Running seed..."
npx ts-node -r tsconfig-paths/register prisma/seed.ts || echo "⚠️  Seed skipped (already seeded or error)."

echo "🚀  Starting Light House API..."
exec node dist/main
