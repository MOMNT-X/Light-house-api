import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private ordersService: OrdersService,
    private notificationsService: NotificationsService,
    private prisma: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async handlePaystackWebhook(rawBody: string, signature: string) {
    // ── 1. Verify HMAC-SHA512 signature ─────────────────────────────────────
    const webhookSecret = this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET') || '';

    if (webhookSecret) {
      const expectedSig = crypto
        .createHmac('sha512', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== signature) {
        this.logger.warn('Invalid Paystack webhook signature — rejecting');
        throw new UnauthorizedException('Invalid webhook signature');
      }
    } else {
      this.logger.warn('PAYSTACK_WEBHOOK_SECRET not set — skipping signature verification (dev mode)');
    }

    // ── 2. Parse payload ─────────────────────────────────────────────────────
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new BadRequestException('Invalid JSON payload');
    }

    const { event, data } = payload;
    this.logger.log(`Received Paystack webhook event: ${event}`);

    // ── 3. Store raw event for audit ─────────────────────────────────────────
    const webhookEvent = await this.prisma.webhookEvent.create({
      data: {
        provider: 'paystack',
        eventType: event,
        rawPayload: payload,
        status: 'received',
      },
    });

    // ── 4. Handle charge.success ─────────────────────────────────────────────
    if (event === 'charge.success') {
      try {
        const reference: string = data?.reference;
        if (!reference) throw new BadRequestException('Missing reference in webhook data');

        // Find order by the idempotency key we used as reference
        const order = await this.ordersService.findOneByReference(reference);

        // Idempotency: skip if already confirmed
        if (order.status === OrderStatus.CONFIRMED) {
          this.logger.log(`Order ${order.id} already confirmed — skipping webhook processing`);
          await this.prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: { status: 'processed', processedAt: new Date() },
          });
          return { received: true };
        }

        // Validate amount (both are in kobo)
        if (data.amount !== order.total) {
          this.logger.error(
            `Webhook amount mismatch! Paystack: ${data.amount}, Order: ${order.total}`,
          );
          await this.prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: { status: 'failed', errorMessage: 'Amount mismatch' },
          });
          return { received: true }; // Still return 200 to Paystack
        }

        // Update payment record
        await this.prisma.payment.update({
          where: { orderId: order.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            rawCallbackPayload: data,
          },
        });

        // Update order status
        await this.ordersService.updateStatus(order.id, OrderStatus.CONFIRMED, PaymentStatus.PAID);

        // Kick off automatic status progression
        this.ordersService.scheduleOrderProgression(order.id);

        // Send in-app notification
        await this.notificationsService.sendInAppNotification(
          order.userId,
          'Payment Successful 🎉',
          `Your order #${order.id.substring(0, 8).toUpperCase()} has been confirmed.`,
        );

        // Send Discord notification
        const itemsList = order.items
          .map((i: any) => `${i.quantity}x ${i.name} (₦${(i.price / 100).toLocaleString()})`)
          .join('\n');

        const addressStr = order.address
          ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
          : 'N/A';

        const user = await this.prisma.user.findUnique({
          where: { id: order.userId },
          select: { email: true, firstName: true, phone: true },
        });

        if (user?.email) {
          await this.mailService.sendOrderConfirmationEmail(user.email, {
            ...order,
            userFirstName: user.firstName,
            addressStr,
          });
        }

        await this.notificationsService.sendDiscordNotification('', [
          {
            title: '🎉 New Order Confirmed (Webhook)',
            description: `Order **#${order.id.substring(0, 8).toUpperCase()}** from **${order.vendor?.name}** has been successfully paid.`,
            color: 0x10B981,
            fields: [
              { name: 'Amount', value: `₦${(order.total / 100).toFixed(2)}`, inline: true },
              { name: 'Provider', value: 'Paystack Webhook', inline: true },
              { name: 'Vendor', value: order.vendor?.name || 'N/A', inline: false },
              { name: 'Items', value: itemsList || 'No items listed', inline: false },
              { name: 'Delivery Address', value: addressStr, inline: false },
              { name: 'User ID', value: order.userId, inline: true },
              { name: 'User Phone', value: user?.phone || 'N/A', inline: true },
            ],
            timestamp: new Date().toISOString(),
          }
        ]);

        // Mark webhook as processed
        await this.prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: 'processed', processedAt: new Date() },
        });

        this.logger.log(`Webhook processed: order ${order.id} confirmed`);
      } catch (error) {
        this.logger.error(`Webhook processing error for event ${webhookEvent.id}`, error);
        await this.prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: 'failed', errorMessage: String(error) },
        });
        // Do NOT re-throw — always return 200 to Paystack so they don't retry forever
      }
    }

    // Always acknowledge receipt to Paystack
    return { received: true };
  }
}
