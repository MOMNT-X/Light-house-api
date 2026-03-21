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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    ordersService;
    notificationsService;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(ordersService, notificationsService) {
        this.ordersService = ordersService;
        this.notificationsService = notificationsService;
    }
    async handleOpayWebhook(payload, signature) {
        this.logger.log(`Received OPay Webhook: ${JSON.stringify(payload)}`);
        const { orderNo, status } = payload;
        if (!orderNo) {
            throw new common_1.BadRequestException('Invalid webhook payload');
        }
        try {
            const order = await this.ordersService.findOneByReference(orderNo);
            if (status === 'SUCCESS') {
                const updatedOrder = await this.ordersService.updateStatus(order.id, client_1.OrderStatus.CONFIRMED, client_1.PaymentStatus.PAID);
                await this.notificationsService.sendInAppNotification(order.userId, 'Payment Successful', `Your order #${order.id.substring(0, 8)} has been confirmed.`);
                return { success: true, orderId: updatedOrder.id };
            }
            else {
                await this.ordersService.updateStatus(order.id, client_1.OrderStatus.CANCELLED, client_1.PaymentStatus.FAILED);
                return { success: true, message: 'Marked failed' };
            }
        }
        catch (e) {
            this.logger.error(`Failed logging webhook for order ${orderNo}`, e);
            throw new common_1.BadRequestException('Could not process');
        }
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        notifications_service_1.NotificationsService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map