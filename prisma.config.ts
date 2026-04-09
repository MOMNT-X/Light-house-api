// Prisma 7 config — connection URLs live here, NOT in schema.prisma
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env["DIRECT_URL"]!, // direct postgres URL used for db push / migrations
  },
});
