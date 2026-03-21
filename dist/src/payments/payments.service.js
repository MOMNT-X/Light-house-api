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
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    ordersService;
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma, ordersService, configService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
        this.configService = configService;
    }
    getOpayConfig() {
        return {
            publicKey: this.configService.get('OPAY_PUBLIC_KEY') || '',
            secretKey: this.configService.get('OPAY_PRIVATE_KEY') || '',
            merchantId: this.configService.get('OPAY_MERCHANT_ID') || '',
            baseUrl: (this.configService.get('OPAY_BASE_URL') || 'https://sandboxapi.opaycheckout.com').split('/api/v1')[0],
        };
    }
    async initiatePayment(userId, orderId, idempotencyKey) {
        const order = await this.ordersService.findOne(userId, orderId);
        if (order.status !== client_1.OrderStatus.PAYMENT_PENDING) {
            throw new common_1.BadRequestException('Order is not in a payable state');
        }
        const config = this.getOpayConfig();
        if (!config.secretKey || !config.merchantId) {
            this.logger.warn('OPay keys missing. Falling back to local simulation for testing.');
            return this.simulatePayment(order.id, idempotencyKey);
        }
        const payload = {
            reference: idempotencyKey,
            mchShortName: 'LightHouse',
            productName: `Order ${order.id.substring(0, 8)}`,
            productDesc: `Food delivery order for ${order.id.substring(0, 8)}`,
            userPhone: '+2348000000000',
            userRequestIp: '127.0.0.1',
            amount: order.total.toString(),
            currency: 'NGN',
            payTypes: ['BankTransfer', 'Card', 'USSD'],
            payMethods: ['account', 'qrcode', 'bankCard', 'bankTransfer'],
            returnUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/processing?orderId=${order.id}&ref=${idempotencyKey}`,
            callbackUrl: `${this.configService.get('API_URL') || 'https://my-public-tunnel.ngrok.io'}/api/v1/webhooks/opay`,
            cancelUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/cart`,
            expireAt: '30',
        };
        try {
            const response = await fetch(`${config.baseUrl}/api/v3/cashier/initialize`, {
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
            }
            else {
                this.logger.error(`OPay API Error: ${responseData.message}`);
                throw new common_1.BadRequestException(`Payment initialization failed: ${responseData.message}`);
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error('Failed to communicate with OPay', error);
            throw new common_1.BadRequestException('Payment service unavailable');
        }
    }
    simulatePayment(orderId, idempotencyKey) {
        const cashierUrl = `http://localhost:5173/payment/processing?orderId=${orderId}&ref=${idempotencyKey}`;
        setTimeout(async () => {
            await this.ordersService.updateStatus(orderId, client_1.OrderStatus.CONFIRMED, client_1.PaymentStatus.PAID);
        }, 5000);
        return { success: true, cashierUrl, orderId };
    }
    async getPaymentStatus(userId, orderId) {
        const order = await this.ordersService.findOne(userId, orderId);
        let status = 'PENDING';
        if (order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY_FOR_DISPATCH' || order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED') {
            status = 'SUCCESS';
        }
        else if (order.status === 'CANCELLED') {
            status = 'CANCELLED';
        }
        return {
            orderId: order.id,
            status,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map