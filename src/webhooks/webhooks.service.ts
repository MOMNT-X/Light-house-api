import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private ordersService: OrdersService,
    private notificationsService: NotificationsService,
  ) {}

  async handleOpayWebhook(payload: any, signature: string) {
    // In production, verify the HMAC signature from OPay here to ensure authenticity.
    this.logger.log(`Received OPay Webhook: ${JSON.stringify(payload)}`);

    // Example payload shape based on standard payments
    // { "orderNo": "...", "status": "SUCCESS", "amount": ... }
    const { orderNo, status } = payload;
    if (!orderNo) {
      throw new BadRequestException('Invalid webhook payload');
    }

    try {
      // Find the order by its orderNumber or idempotencyKey depending on what we sent as reference
      // Let's assume orderNo here corresponds to the internal order number or reference we sent.
      // E.g., if we sent idempotencyKey as the reference:
      const order = await this.ordersService.findOneByReference(orderNo); // We need to implement this in OrdersService

      if (status === 'SUCCESS') {
        const updatedOrder = await this.ordersService.updateStatus(order.id, OrderStatus.CONFIRMED, PaymentStatus.PAID);
        
        // Trigger notifications
        await this.notificationsService.sendInAppNotification(
          order.userId, 
          'Payment Successful', 
          `Your order #${order.id.substring(0, 8)} has been confirmed.`
        );
        // Maybe also notify the vendor, tracking, etc.

        return { success: true, orderId: updatedOrder.id };
      } else {
        await this.ordersService.updateStatus(order.id, OrderStatus.CANCELLED, PaymentStatus.FAILED);
        return { success: true, message: 'Marked failed' };
      }
    } catch (e) {
      this.logger.error(`Failed logging webhook for order ${orderNo}`, e);
      // Even if our processing fails, standard practice is to acknowledge receipt if valid format
      throw new BadRequestException('Could not process');
    }
  }
}
