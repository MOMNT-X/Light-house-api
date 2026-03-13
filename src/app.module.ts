import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { validationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';

// ── Domain modules (stubbed — will be filled in Phase 2+) ──────
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { VendorsModule } from './vendors/vendors.module';
import { MenuModule } from './menu/menu.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TrackingModule } from './tracking/tracking.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    // ── Config (must be first) ──────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: { abortEarly: false },
    }),

    // ── Rate limiting ───────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: parseInt(process.env.THROTTLE_TTL || '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT || '60'),
      },
    ]),

    // ── Scheduled jobs ──────────────────────────────
    ScheduleModule.forRoot(),

    // ── Health checks ───────────────────────────────
    TerminusModule,

    // ── Data layer ──────────────────────────────────
    PrismaModule,
    CommonModule,

    // ── Domain modules ──────────────────────────────
    AuthModule,
    UsersModule,
    AddressesModule,
    VendorsModule,
    MenuModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    WebhooksModule,
    NotificationsModule,
    TrackingModule,
    AdminModule,
    AuditModule,
  ],
})
export class AppModule {}
