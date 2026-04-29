"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_service_1 = require("../orders/orders.service");
const notifications_service_1 = require("../notifications/notifications.service");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    ordersService;
    notificationsService;
    mailService;
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    paystackBaseUrl = 'https://api.paystack.co';
    constructor(prisma, ordersService, notificationsService, mailService, configService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
        this.notificationsService = notificationsService;
        this.mailService = mailService;
        this.configService = configService;
    }
    get secretKey() {
        return this.configService.get('PAYSTACK_SECRET_KEY') || '';
    }
    get opayMerchantId() {
        return this.configService.get('OPAY_MERCHANT_ID') || '';
    }
    get opayPrivateKey() {
        return this.configService.get('OPAY_PRIVATE_KEY') || '';
    }
    get opayPublicKey() {
        return this.configService.get('OPAY_PUBLIC_KEY') || '';
    }
    get frontendUrl() {
        return this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }
    async initiatePayment(userId, orderId, idempotencyKey) {
        const order = await this.ordersService.findOne(userId, orderId);
        if (order.status !== client_1.OrderStatus.PAYMENT_PENDING) {
            throw new common_1.BadRequestException('Order is not in a payable state');
        }
        const existingPayment = await this.prisma.payment.findUnique({
            where: { orderId: order.id },
        });
        if (existingPayment && existingPayment.status === client_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('This order has already been paid for');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const paystackPayload = {
            email: user.email,
            amount: order.total,
            reference: idempotencyKey,
            callback_url: `${this.frontendUrl}/payment/verify?reference=${idempotencyKey}`,
            metadata: {
                orderId: order.id,
                userId: userId,
            },
        };
        this.logger.log(`Initializing Paystack payment for order ${order.id}`);
        let authorizationUrl;
        let paystackReference;
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
                throw new common_1.BadRequestException(`Payment initialization failed: ${responseData.message}`);
            }
            authorizationUrl = responseData.data.authorization_url;
            paystackReference = responseData.data.reference;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            this.logger.error('Failed to communicate with Paystack', error);
            throw new common_1.InternalServerErrorException('Payment service unavailable');
        }
        await this.prisma.payment.upsert({
            where: { orderId: order.id },
            create: {
                orderId: order.id,
                amount: order.total,
                currency: 'NGN',
                provider: 'paystack',
                providerRef: paystackReference,
                status: client_1.PaymentStatus.PENDING,
                idempotencyKey,
            },
            update: {
                providerRef: paystackReference,
                status: client_1.PaymentStatus.PENDING,
                idempotencyKey,
            },
        });
        return {
            success: true,
            authorizationUrl,
            reference: paystackReference,
        };
    }
    async verifyPayment(userId, reference) {
        this.logger.log(`Verifying Paystack payment with reference: ${reference}`);
        let paystackData;
        try {
            const response = await fetch(`${this.paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`, {
                headers: { Authorization: `Bearer ${this.secretKey}` },
            });
            const responseData = await response.json();
            if (!responseData.status) {
                throw new common_1.BadRequestException(`Verification failed: ${responseData.message}`);
            }
            paystackData = responseData.data;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            this.logger.error('Failed to verify payment with Paystack', error);
            throw new common_1.InternalServerErrorException('Payment verification unavailable');
        }
        if (paystackData.status !== 'success') {
            throw new common_1.BadRequestException(`Payment not successful. Paystack status: ${paystackData.status}`);
        }
        const order = await this.ordersService.findOneByReference(reference);
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('Order does not belong to this user');
        }
        if (order.status === client_1.OrderStatus.CONFIRMED) {
            return { success: true, orderId: order.id, message: 'Already confirmed' };
        }
        if (paystackData.amount !== order.total) {
            this.logger.warn(`Amount mismatch (non-blocking): Paystack ${paystackData.amount} kobo vs Order ${order.total} kobo`);
        }
        await this.prisma.payment.upsert({
            where: { orderId: order.id },
            create: {
                orderId: order.id,
                amount: paystackData.amount,
                currency: 'NGN',
                provider: 'paystack',
                providerRef: reference,
                status: client_1.PaymentStatus.PAID,
                idempotencyKey: reference,
                paidAt: new Date(),
                rawCallbackPayload: paystackData,
            },
            update: {
                status: client_1.PaymentStatus.PAID,
                paidAt: new Date(),
                rawCallbackPayload: paystackData,
            },
        });
        await this.ordersService.updateStatus(order.id, client_1.OrderStatus.CONFIRMED, client_1.PaymentStatus.PAID);
        this.ordersService.scheduleOrderProgression(order.id);
        await this.notificationsService.sendInAppNotification(order.userId, 'Payment Successful 🎉', `Your order #${order.id.substring(0, 8).toUpperCase()} has been confirmed.`);
        const itemsList = order.items
            .map((i) => `${i.quantity}x ${i.name} (₦${(i.price / 100).toLocaleString()})`)
            .join('\n');
        const addressStr = order.address
            ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
            : 'N/A';
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
                title: '🎉 New Order Confirmed',
                description: `Order **#${order.id.substring(0, 8).toUpperCase()}** from **${order.vendor?.name}** has been successfully paid.`,
                color: 0x10B981,
                fields: [
                    { name: 'Amount', value: `₦${(order.total / 100).toFixed(2)}`, inline: true },
                    { name: 'Provider', value: 'Paystack', inline: true },
                    { name: 'Vendor', value: order.vendor?.name || 'N/A', inline: false },
                    { name: 'Items', value: itemsList || 'No items listed', inline: false },
                    { name: 'Delivery Address', value: addressStr, inline: false },
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'User Phone', value: user?.phone || 'N/A', inline: true },
                ],
                timestamp: new Date().toISOString(),
            }
        ]);
        this.logger.log(`Payment verified and order ${order.id} confirmed`);
        return { success: true, orderId: order.id };
    }
    async verifyOrderPayment(userId, orderId) {
        const order = await this.ordersService.findOne(userId, orderId);
        if (order.status === client_1.OrderStatus.CONFIRMED || order.status !== client_1.OrderStatus.PAYMENT_PENDING) {
            return { success: true, orderId: order.id, status: order.status };
        }
        const payment = await this.prisma.payment.findUnique({
            where: { orderId: order.id },
        });
        if (!payment) {
            throw new common_1.BadRequestException('No payment record found for this order');
        }
        if (payment.provider === 'paystack' && payment.providerRef) {
            return this.verifyPayment(userId, payment.providerRef);
        }
        else if (payment.provider === 'opay') {
            if (!this.paystackBaseUrl.includes('live')) {
                this.logger.log('Local dev: Automatically confirming OPay payment');
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: client_1.PaymentStatus.PAID, paidAt: new Date() }
                });
                await this.ordersService.updateStatus(order.id, client_1.OrderStatus.CONFIRMED, client_1.PaymentStatus.PAID);
                this.ordersService.scheduleOrderProgression(order.id);
                const itemsList = order.items
                    .map((i) => `${i.quantity}x ${i.name} (₦${(i.price / 100).toLocaleString()})`)
                    .join('\n');
                const addressStr = order.address
                    ? `${order.address.street}, ${order.address.city}, ${order.address.state}`
                    : 'N/A';
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
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
                        title: '🎉 New Order Confirmed (Local Dev Sandbox)',
                        description: `Order **#${order.id.substring(0, 8).toUpperCase()}** from **${order.vendor?.name}** has been simulated as paid.`,
                        color: 0x10B981,
                        fields: [
                            { name: 'Amount', value: `₦${(order.total / 100).toFixed(2)}`, inline: true },
                            { name: 'Provider', value: 'OPay', inline: true },
                            { name: 'Vendor', value: order.vendor?.name || 'N/A', inline: false },
                            { name: 'Items', value: itemsList || 'No items listed', inline: false },
                            { name: 'Delivery Address', value: addressStr, inline: false },
                            { name: 'User ID', value: userId, inline: true },
                            { name: 'User Phone', value: user?.phone || 'N/A', inline: true },
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
    async initiateOpayPayment(userId, orderId, idempotencyKey) {
        const order = await this.ordersService.findOne(userId, orderId);
        if (order.status !== client_1.OrderStatus.PAYMENT_PENDING) {
            throw new common_1.BadRequestException('Order is not in a payable state');
        }
        const existingPayment = await this.prisma.payment.findUnique({
            where: { orderId: order.id },
        });
        if (existingPayment && existingPayment.status === client_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('This order has already been paid for');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true, phone: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!this.opayMerchantId || !this.opayPrivateKey) {
            this.logger.warn('OPay keys not set — cannot process OPay payment');
            throw new common_1.BadRequestException('OPay payment is not available at this time');
        }
        const crypto = await import('crypto');
        const amountInNaira = (order.total / 100).toFixed(2);
        const payload = {
            reference: idempotencyKey,
            mchShortName: 'LH Logistics',
            productName: 'Food Order',
            productDesc: `Order #${order.id.substring(0, 8).toUpperCase()}`,
            userPhone: user.phone || '+2340000000000',
            userRequestIp: '127.0.0.1',
            amount: amountInNaira,
            currency: 'NGN',
            payTypes: ['BalancePayment', 'BonusPayment', 'OWealth', 'CardPayment'],
            payMethods: ['account', 'qrcode', "bankCard", "bankTransfer"],
            returnUrl: `${this.frontendUrl}/payment/success`,
            callbackUrl: `${this.frontendUrl}/payment/success`,
            cancelUrl: `${this.frontendUrl}/payment/failure`,
            expireAt: '30',
        };
        const bodyStr = JSON.stringify(payload);
        const signature = crypto
            .createHmac('sha512', this.opayPrivateKey)
            .update(bodyStr)
            .digest('hex');
        const isSandbox = this.opayPrivateKey.startsWith('OPAYPRV') || !this.opayPrivateKey.startsWith('OPAYLIVE');
        const apiUrl = isSandbox
            ? 'https://testapi.opaycheckout.com/api/v3/cashier/initialize'
            : 'https://cashierapi.opayweb.com/api/v3/cashier/initialize';
        let data;
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
        }
        catch (fetchErr) {
            this.logger.error('OPay network error', fetchErr);
            throw new common_1.InternalServerErrorException('Could not reach OPay — please try again or choose a different payment method');
        }
        if (!data.data?.cashierUrl) {
            this.logger.error('OPay cashier initialization failed', data);
            throw new common_1.BadRequestException(data.message || `OPay initialization failed (code: ${data.code || 'unknown'})`);
        }
        await this.prisma.payment.upsert({
            where: { orderId: order.id },
            create: {
                orderId: order.id,
                amount: order.total,
                currency: 'NGN',
                provider: 'opay',
                providerRef: idempotencyKey,
                status: client_1.PaymentStatus.PENDING,
                idempotencyKey,
            },
            update: { provider: 'opay', providerRef: idempotencyKey },
        });
        this.logger.log(`OPay cashier URL generated for order ${order.id}`);
        return { success: true, cashierUrl: data.data.cashierUrl, reference: idempotencyKey };
    }
    async getPaymentStatus(userId, orderId) {
        const order = await this.ordersService.findOne(userId, orderId);
        let status = 'PENDING';
        if (order.status === 'CONFIRMED' ||
            order.status === 'PREPARING' ||
            order.status === 'READY_FOR_DISPATCH' ||
            order.status === 'OUT_FOR_DELIVERY' ||
            order.status === 'DELIVERED') {
            status = 'SUCCESS';
        }
        else if (order.status === 'CANCELLED') {
            status = 'CANCELLED';
        }
        return { orderId: order.id, status };
    }
    simulatePayment(orderId, idempotencyKey) {
        const authorizationUrl = `${this.frontendUrl}/payment/verify?reference=${idempotencyKey}&simulated=true`;
        setTimeout(async () => {
            try {
                await this.ordersService.updateStatus(orderId, client_1.OrderStatus.CONFIRMED, client_1.PaymentStatus.PAID);
                this.logger.debug(`[DEV] Simulated payment confirmed for order ${orderId}`);
            }
            catch (e) {
                this.logger.error('[DEV] Simulation failed', e);
            }
        }, 5000);
        return { success: true, authorizationUrl, reference: idempotencyKey };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map