import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
    private configService: ConfigService,
  ) {}

  private getOpayConfig() {
    return {
      publicKey: this.configService.get<string>('OPAY_PUBLIC_KEY') || '',
      secretKey: this.configService.get<string>('OPAY_SECRET_KEY') || '',
      merchantId: this.configService.get<string>('OPAY_MERCHANT_ID') || '',
      baseUrl: this.configService.get<string>('OPAY_BASE_URL') || 'https://sandboxapi.opaycheckout.com',
    };
  }

  private generateSignature(payload: any, secretKey: string): string {
    const stringified = JSON.stringify(payload);
    return crypto.createHmac('sha512', secretKey).update(stringified).digest('hex');
  }

  async initiatePayment(userId: string, orderId: string, idempotencyKey: string) {
    const order = await this.ordersService.findOne(userId, orderId);

    if (order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Order is not in a payable state');
    }

    const config = this.getOpayConfig();
    if (!config.secretKey || !config.merchantId) {
      this.logger.warn('OPay keys missing. Falling back to local simulation for testing.');
      return this.simulatePayment(order.id, idempotencyKey);
    }

    const payload = {
      reference: idempotencyKey,
      mchNo: config.merchantId,
      mchShortName: 'Light House Logistics',
      productName: `Order ${order.orderNumber}`,
      productDesc: `Food delivery order for ${order.orderNumber}`,
      userPhone: order.address?.phone || '+2348000000000',
      userRequestIp: '127.0.0.1', // Should extract from Req
      amount: order.total.toString(),
      currency: 'NGN',
      payTypes: ['BankTransfer', 'Card', 'USSD'],
      payMethods: ['account', 'qrcode', 'bankCard', 'bankTransfer'],
      returnUrl: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/payment/processing?orderId=${order.id}&ref=${idempotencyKey}`,
      callbackUrl: `${this.configService.get<string>('API_URL') || 'http://localhost:3000'}/api/v1/webhooks/opay`,
      expireAt: '30', // minutes
    };

    const signature = this.generateSignature(payload, config.secretKey);

    try {
      const response = await fetch(`${config.baseUrl}/api/v1/international/cashier/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.publicKey}`,
          'MerchantId': config.merchantId,
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (responseData.code === '00000') {
        const cashierUrl = responseData.data.cashierUrl;
        return { success: true, cashierUrl, orderId: order.id };
      } else {
        this.logger.error(`OPay API Error: ${responseData.message}`);
        throw new BadRequestException(`Payment initialization failed: ${responseData.message}`);
      }
    } catch (error) {
      this.logger.error('Failed to communicate with OPay', error);
      throw new BadRequestException('Payment service unavailable');
    }
  }

  // Fallback purely for dev environment if keys aren't set
  private simulatePayment(orderId: string, idempotencyKey: string) {
    const cashierUrl = `http://localhost:5173/payment/processing?orderId=${orderId}&ref=${idempotencyKey}`;
    
    setTimeout(async () => {
      await this.ordersService.updateStatus(orderId, OrderStatus.CONFIRMED, PaymentStatus.PAID);
    }, 5000);

    return { success: true, cashierUrl, orderId };
  }

  async getPaymentStatus(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(userId, orderId);
    
    // Map backend PaymentStatus to the frontend's expected simplified string
    let status = 'PENDING';
    if (order.paymentStatus === 'PAID') status = 'SUCCESS';
    if (order.paymentStatus === 'FAILED' || order.paymentStatus === 'REFUNDED') status = 'FAILED';
    if (order.status === 'CANCELLED') status = 'CANCELLED';

    return {
      orderId: order.id,
      status,
    };
  }
}
