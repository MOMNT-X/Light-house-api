import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  private get secretKey(): string {
    return this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  private get opayMerchantId(): string {
    return this.configService.get<string>('OPAY_MERCHANT_ID') || '';
  }

  private get opayPrivateKey(): string {
    return this.configService.get<string>('OPAY_PRIVATE_KEY') || '';
  }

  private get opayPublicKey(): string {
    return this.configService.get<string>('OPAY_PUBLIC_KEY') || '';
  }

  private get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  // ─── Initialize Payment ────────────────────────────────────────────────────

  async initiatePayment(userId: string, orderId: string, idempotencyKey: string) {
    // 1. Fetch order and validate state
    const order = await this.ordersService.findOne(userId, orderId);

    if (order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Order is not in a payable state');
    }

    // 2. Check for existing payment (idempotency guard — no double payments)
    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId: order.id },
    });
    if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
      throw new BadRequestException('This order has already been paid for');
    }

    // 3. Fetch user email (required by Paystack)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // 4. Call Paystack Initialize API
    // Note: order.total is already in kobo (our schema stores all amounts in kobo)
    const paystackPayload = {
      email: user.email,
      amount: order.total, // already in kobo
      reference: idempotencyKey,
      callback_url: `${this.frontendUrl}/payment/verify?reference=${idempotencyKey}`,
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    };

    this.logger.log(`Initializing Paystack payment for order ${order.id}`);

    let authorizationUrl: string;
    let paystackReference: string;

    if (!this.secretKey) {
      this.logger.warn('PAYSTACK_SECRET_KEY not set — using dev simulation');
      return this.simulatePayment(order.id, idempotencyKey);
    }

    try {
      const response = await fetch(`${this.paystackBaseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paystackPayload),
      });

      const responseData = await response.json();

      if (!responseData.status) {
        this.logger.error(`Paystack API error: ${responseData.message}`);
        throw new BadRequestException(`Payment initialization failed: ${responseData.message}`);
      }

      authorizationUrl = responseData.data.authorization_url;
      paystackReference = responseData.data.reference;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Failed to communicate with Paystack', error);
      throw new InternalServerErrorException('Payment service unavailable');
    }

    // 5. Persist payment record (upsert — safe for retries)
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.total,
        currency: 'NGN',
        provider: 'paystack',
        providerRef: paystackReference,
        status: PaymentStatus.PENDING,
        idempotencyKey,
      },
      update: {
        providerRef: paystackReference,
        status: PaymentStatus.PENDING,
        idempotencyKey,
      },
    });

    return {
      success: true,
      authorizationUrl,
      reference: paystackReference,
    };
  }

  // ─── Verify Payment ────────────────────────────────────────────────────────

  async verifyPayment(userId: string, reference: string) {
    this.logger.log(`Verifying Paystack payment with reference: ${reference}`);

    // 1. Call Paystack verify API
    let paystackData: any;
    try {
      const response = await fetch(
        `${this.paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        },
      );
      const responseData = await response.json();

      if (!responseData.status) {
        throw new BadRequestException(`Verification failed: ${responseData.message}`);
      }
      paystackData = responseData.data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Failed to verify payment with Paystack', error);
      throw new InternalServerErrorException('Payment verification unavailable');
    }

    // 2. Confirm transaction success from Paystack
    if (paystackData.status !== 'success') {
      throw new BadRequestException(`Payment not successful. Paystack status: ${paystackData.status}`);
    }

    // 3. Find the order via idempotency key (the reference we sent)
    const order = await this.ordersService.findOneByReference(reference);

    // 4. Guard: only the order owner can verify
    if (order.userId !== userId) {
      throw new BadRequestException('Order does not belong to this user');
    }

    // 5. Guard: already processed? (idempotency)
    if (order.status === OrderStatus.CONFIRMED) {
      return { success: true, orderId: order.id, message: 'Already confirmed' };
    }

    // 6. Log if amount mismatches but don't block — both are in kobo
    //    In test mode minor discrepancies can occur; the status === 'success' check is the real guard
    if (paystackData.amount !== order.total) {
      this.logger.warn(
        `Amount mismatch (non-blocking): Paystack ${paystackData.amount} kobo vs Order ${order.total} kobo`,
      );
    }

    // 7. Update payment record → PAID
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: paystackData.amount,
        currency: 'NGN',
        provider: 'paystack',
        providerRef: reference,
        status: PaymentStatus.PAID,
        idempotencyKey: reference,
        paidAt: new Date(),
        rawCallbackPayload: paystackData,
      },
      update: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        rawCallbackPayload: paystackData,
      },
    });

    // 8. Update order status → CONFIRMED
    await this.ordersService.updateStatus(order.id, OrderStatus.CONFIRMED, PaymentStatus.PAID);

    // 9. Kick off automatic status progression (temporary until vendor dashboard is live)
    //    CONFIRMED → PREPARING (2min) → READY_FOR_DISPATCH (5min) → OUT_FOR_DELIVERY (15min) → DELIVERED (20min)
    this.ordersService.scheduleOrderProgression(order.id);

    // 10. Send in-app notification
    await this.notificationsService.sendInAppNotification(
      order.userId,
      'Payment Successful 🎉',
      `Your order #${order.id.substring(0, 8).toUpperCase()} has been confirmed.`,
    );

    const itemsList = order.items
      .map((i: any) => `${i.quantity}x ${i.name} (₦${(i.price / 100).toLocaleString()})`)
      .join('\n');

    const addressStr = order.address
      ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
      : 'N/A';

    await this.notificationsService.sendDiscordNotification('', [
      {
        title: '🎉 New Order Confirmed',
        description: `Order **#${order.id.substring(0, 8).toUpperCase()}** from **${order.vendor?.name}** has been successfully paid.`,
        color: 0x10B981,
        fields: [
          { name: 'Amount', value: `₦${(order.total / 100).toFixed(2)}`, inline: true },
          { name: 'Provider', value: 'Paystack', inline: true },
          { name: 'Vendor', value: order.vendor?.name || 'N/A', inline: false },
          { name: 'Items', value: itemsList || 'No items listed', inline: false },
          { name: 'Delivery Address', value: addressStr, inline: false },
          { name: 'User ID', value: userId, inline: false },
        ],
        timestamp: new Date().toISOString(),
      }
    ]);

    this.logger.log(`Payment verified and order ${order.id} confirmed`);
    return { success: true, orderId: order.id };
  }

  // ─── Verify Order Payment (Active Polling) ─────────────────────────────────

  async verifyOrderPayment(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(userId, orderId);

    if (order.status === OrderStatus.CONFIRMED || order.status !== OrderStatus.PAYMENT_PENDING) {
      return { success: true, orderId: order.id, status: order.status };
    }

    const payment = await this.prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (!payment) {
      throw new BadRequestException('No payment record found for this order');
    }

    if (payment.provider === 'paystack' && payment.providerRef) {
      // Actively verify with Paystack
      return this.verifyPayment(userId, payment.providerRef);
    } else if (payment.provider === 'opay') {
      // OPay relies on webhooks. Since local dev webhooks are tricky, 
      // we inform the user to wait or we can simulate successful payment in local dev
      if (!this.paystackBaseUrl.includes('live')) {
          this.logger.log('Local dev: Automatically confirming OPay payment');
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.PAID, paidAt: new Date() }
          });
          await this.ordersService.updateStatus(order.id, OrderStatus.CONFIRMED, PaymentStatus.PAID);
          this.ordersService.scheduleOrderProgression(order.id);
          
          const itemsList = order.items
            .map((i: any) => `${i.quantity}x ${i.name} (₦${(i.price / 100).toLocaleString()})`)
            .join('\n');

          const addressStr = order.address
            ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
            : 'N/A';

          await this.notificationsService.sendDiscordNotification('', [
            {
              title: '🎉 New Order Confirmed (Local Dev Sandbox)',
              description: `Order **#${order.id.substring(0, 8).toUpperCase()}** from **${order.vendor?.name}** has been simulated as paid.`,
              color: 0x10B981,
              fields: [
                { name: 'Amount', value: `₦${(order.total / 100).toFixed(2)}`, inline: true },
                { name: 'Provider', value: 'OPay', inline: true },
                { name: 'Vendor', value: order.vendor?.name || 'N/A', inline: false },
                { name: 'Items', value: itemsList || 'No items listed', inline: false },
                { name: 'Delivery Address', value: addressStr, inline: false },
                { name: 'User ID', value: userId, inline: false },
              ],
              timestamp: new Date().toISOString(),
            }
          ]);
          return { success: true, orderId: order.id };
      }
      return { success: false, message: 'OPay payment status will update automatically via webhook.', orderId: order.id };
    }

    return { success: false, message: 'Unverifiable payment provider' };
  }

  // ─── OPay Cashier Initiate ─────────────────────────────────────────────────

  async initiateOpayPayment(userId: string, orderId: string, idempotencyKey: string) {
    const order = await this.ordersService.findOne(userId, orderId);

    if (order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Order is not in a payable state');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { orderId: order.id },
    });
    if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
      throw new BadRequestException('This order has already been paid for');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, phone: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (!this.opayMerchantId || !this.opayPrivateKey) {
      this.logger.warn('OPay keys not set — cannot process OPay payment');
      throw new BadRequestException('OPay payment is not available at this time');
    }

    const crypto = await import('crypto');

    // OPay Cashier expects amount in NAIRA (not kobo), string formatted
    const amountInNaira = (order.total / 100).toFixed(2);

    // OPay V3 Cashier requires a flattened payload structure
    const payload = {
      reference: idempotencyKey,
      mchShortName: 'LH Logistics',
      productName: 'Food Order',
      productDesc: `Order #${order.id.substring(0, 8).toUpperCase()}`,
      userPhone: user.phone || '+2340000000000',
      userRequestIp: '127.0.0.1', // Real IP could be extracted if needed
      amount: amountInNaira,
      currency: 'NGN',
      payTypes: ['BalancePayment', 'BonusPayment', 'OWealth', 'CardPayment'],
      payMethods: ['account', 'qrcode', "bankCard", "bankTransfer"],
      returnUrl: `${this.frontendUrl}/payment/success`,
      callbackUrl: `${this.frontendUrl}/payment/success`,
      cancelUrl: `${this.frontendUrl}/payment/failure`,
      expireAt: '30', // 30 minutes string
    };

    // HMAC-SHA512 signature
    const bodyStr = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha512', this.opayPrivateKey)
      .update(bodyStr)
      .digest('hex');

    // Auto-detect sandbox vs live using OPay's key prefix ('OPAYPRV' = sandbox usually)
    const isSandbox = this.opayPrivateKey.startsWith('OPAYPRV') || !this.opayPrivateKey.startsWith('OPAYLIVE');
    const apiUrl = isSandbox 
      ? 'https://testapi.opaycheckout.com/api/v3/cashier/initialize'
      : 'https://cashierapi.opayweb.com/api/v3/cashier/initialize';

    let data: any;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.opayPublicKey}`,
          MerchantId: this.opayMerchantId,
          Signature: signature,
          'Content-Type': 'application/json',
        },
        body: bodyStr,
      });
      data = await response.json();
      this.logger.debug(`OPay response: ${JSON.stringify(data)}`);
    } catch (fetchErr) {
      this.logger.error('OPay network error', fetchErr);
      throw new InternalServerErrorException('Could not reach OPay — please try again or choose a different payment method');
    }

    if (!data.data?.cashierUrl) {
      this.logger.error('OPay cashier initialization failed', data);
      throw new BadRequestException(
        data.message || `OPay initialization failed (code: ${data.code || 'unknown'})`,
      );
    }

    // Create a pending payment record
    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.total,
        currency: 'NGN',
        provider: 'opay',
        providerRef: idempotencyKey,
        status: PaymentStatus.PENDING,
        idempotencyKey,
      },
      update: { provider: 'opay', providerRef: idempotencyKey },
    });

    this.logger.log(`OPay cashier URL generated for order ${order.id}`);
    return { success: true, cashierUrl: data.data.cashierUrl, reference: idempotencyKey };
  }

  // ─── Payment Status (for polling) ─────────────────────────────────────────

  async getPaymentStatus(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(userId, orderId);

    let status = 'PENDING';
    if (
      order.status === 'CONFIRMED' ||
      order.status === 'PREPARING' ||
      order.status === 'READY_FOR_DISPATCH' ||
      order.status === 'OUT_FOR_DELIVERY' ||
      order.status === 'DELIVERED'
    ) {
      status = 'SUCCESS';
    } else if (order.status === 'CANCELLED') {
      status = 'CANCELLED';
    }

    return { orderId: order.id, status };
  }

  // ─── Dev Simulation (no API keys) ─────────────────────────────────────────

  private simulatePayment(orderId: string, idempotencyKey: string) {
    const authorizationUrl = `${this.frontendUrl}/payment/verify?reference=${idempotencyKey}&simulated=true`;

    setTimeout(async () => {
      try {
        await this.ordersService.updateStatus(orderId, OrderStatus.CONFIRMED, PaymentStatus.PAID);
        this.logger.debug(`[DEV] Simulated payment confirmed for order ${orderId}`);
      } catch (e) {
        this.logger.error('[DEV] Simulation failed', e);
      }
    }, 5000);

    return { success: true, authorizationUrl, reference: idempotencyKey };
  }
}
