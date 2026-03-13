import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      datasourceUrl: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    await (this as unknown as PrismaService).$connect();
    this.logger.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await (this as unknown as PrismaService).$disconnect();
    this.logger.log('Database disconnected');
  }
}
