"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let WebhooksService = WebhooksService_1 = class WebhooksService {
    ordersService;
    notificationsService;
    prisma;
    mailService;
    configService;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(ordersService, notificationsService, prisma, mailService, configService) {
        this.ordersService = ordersService;
        this.notificationsService = notificationsService;
        this.prisma = prisma;
        this.mailService = mailService;
        this.configService = configService;
    }
    async handlePaystackWebhook(rawBody, signature) {
        const webhookSecret = this.configService.get('PAYSTACK_WEBHOOK_SECRET') || '';
        if (webhookSecret) {
            const expectedSig = crypto
                .createHmac('sha512', webhookSecret)
                .update(rawBody)
                .digest('hex');
            if (expectedSig !== signature) {
                this.logger.warn('Invalid Paystack webhook signature — rejecting');
                throw new common_1.UnauthorizedException('Invalid webhook signature');
            }
        }
        else {
            this.logger.warn('PAYSTACK_WEBHOOK_SECRET not set — skipping signature verification (dev mode)');
        }
        let payload;
        try {
            payload = JSON.parse(rawBody);
        }
        catch {
            throw new common_1.BadRequestException('Invalid JSON payload');
        }
        const { event, data } = payload;
        this.logger.log(`Received Paystack webhook event: ${event}`);
        const webhookEvent = await this.prisma.webhookEvent.create({
            data: {
                provider: 'paystack',
                eventType: event,
                rawPayload: payload,
                status: 'received',
            },
        });
        if (event === 'charge.success') {
            try {
                const reference = data?.reference;
                if (!reference)
                    throw new common_1.BadRequestException('Missing reference in webhook data');
                const order = await this.ordersService.findOneByReference(reference);
                if (order.status === client_1.OrderStatus.CONFIRMED) {
                    this.logger.log(`Order ${order.id} already confirmed — skipping webhook processing`);
                    await this.prisma.webhookEvent.update({
                        where: { id: webhookEvent.id },
                        data: { status: 'processed', processedAt: new Date() },
                    });
                    return { received: true };
                }
                if (data.amount !== order.total) {
                    this.logger.error(`Webhook amount mismatch! Paystack: ${data.amount}, Order: ${order.total}`);
                    await this.prisma.webhookEvent.update({
                        where: { id: webhookEvent.id },
                        data: { status: 'failed', errorMessage: 'Amount mismatch' },
                    });
                    return { received: true };
                }
                await this.prisma.payment.update({
                    where: { orderId: order.id },
                    data: {
                        status: client_1.PaymentStatus.PAID,
                        paidAt: new Date(),
                        rawCallbackPayload: data,
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
                await this.prisma.webhookEvent.update({
                    where: { id: webhookEvent.id },
                    data: { status: 'processed', processedAt: new Date() },
                });
                this.logger.log(`Webhook processed: order ${order.id} confirmed`);
            }
            catch (error) {
                this.logger.error(`Webhook processing error for event ${webhookEvent.id}`, error);
                await this.prisma.webhookEvent.update({
                    where: { id: webhookEvent.id },
                    data: { status: 'failed', errorMessage: String(error) },
                });
            }
        }
        return { received: true };
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        notifications_service_1.NotificationsService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map