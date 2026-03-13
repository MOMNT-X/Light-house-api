import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // ── Security ───────────────────────────────────────
  app.use(helmet());

  app.enableCors({
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── API Versioning ─────────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // ── Global Validation ──────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,          // auto-cast primitives
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Interceptors & Filters ─────────────────
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Start ──────────────────────────────────────────
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Light House API running on http://localhost:${port}/api/v1`);
}

bootstrap();
