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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = exports.CreateOrderDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderItemDto {
    menuItemId;
    quantity;
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "menuItemId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
class CreateOrderDto {
    vendorId;
    addressId;
    items;
    notes;
    idempotencyKey;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "vendorId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "addressId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "idempotencyKey", void 0);
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        if (!data.items || data.items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        if (data.idempotencyKey) {
            const existing = await this.prisma.order.findUnique({
                where: { idempotencyKey: data.idempotencyKey },
            });
            if (existing)
                return existing;
        }
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: data.vendorId },
        });
        if (!vendor)
            throw new common_1.BadRequestException('Invalid vendor');
        const itemIds = data.items.map(i => i.menuItemId);
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: itemIds }, category: { vendorId: data.vendorId } },
        });
        if (menuItems.length !== data.items.length) {
            throw new common_1.BadRequestException('Some items are invalid or do not belong to the selected vendor');
        }
        let subtotal = 0;
        const orderItemsCreate = data.items.map(item => {
            const menuItem = menuItems.find((m) => m.id === item.menuItemId);
            subtotal += menuItem.price * item.quantity;
            return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price,
                name: menuItem.name,
                subtotal: menuItem.price * item.quantity,
            };
        });
        const deliveryFee = 500 * 100;
        const serviceCharge = 100 * 100;
        const total = subtotal + deliveryFee + serviceCharge;
        return this.prisma.order.create({
            data: {
                userId,
                vendorId: data.vendorId,
                addressId: data.addressId,
                notes: data.notes,
                subtotal,
                deliveryFee,
                serviceCharge,
                total,
                status: client_1.OrderStatus.PAYMENT_PENDING,
                idempotencyKey: data.idempotencyKey || `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                items: {
                    create: orderItemsCreate,
                },
            },
            include: {
                items: true,
            },
        });
    }
    async findAllByUser(userId, skip = 0, take = 20) {
        const [orders, count] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: { select: { name: true, logoUrl: true } },
                    items: true,
                },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return { orders, count, totalPages: Math.ceil(count / take) };
    }
    async findOne(userId, id) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: {
                vendor: { select: { name: true, logoUrl: true } },
                address: true,
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findOneByReference(reference) {
        const order = await this.prisma.order.findFirst({
            where: { idempotencyKey: reference },
            include: {
                vendor: { select: { name: true, logoUrl: true } },
                address: true,
                items: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found via reference');
        return order;
    }
    async updateStatus(id, status, paymentStatus) {
        const data = { status };
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }
    async cancel(userId, id) {
        const order = await this.findOne(userId, id);
        if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.PAYMENT_PENDING) {
            throw new common_1.BadRequestException('Order cannot be cancelled at this stage');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: client_1.OrderStatus.CANCELLED },
        });
    }
    scheduleOrderProgression(orderId) {
        const MIN = 60_000;
        const steps = [
            { delayMs: 2 * MIN, status: client_1.OrderStatus.PREPARING },
            { delayMs: 2 * MIN, status: client_1.OrderStatus.READY_FOR_DISPATCH },
            { delayMs: 7 * MIN, status: client_1.OrderStatus.OUT_FOR_DELIVERY },
            { delayMs: 10 * MIN, status: client_1.OrderStatus.DELIVERED },
        ];
        const logger = this.logger;
        const prisma = this.prisma;
        for (const { delayMs, status } of steps) {
            setTimeout(async () => {
                try {
                    const current = await prisma.order.findUnique({
                        where: { id: orderId },
                        select: { status: true },
                    });
                    const stoppedStatuses = [
                        client_1.OrderStatus.CANCELLED,
                        client_1.OrderStatus.DELIVERED,
                    ];
                    if (!current || stoppedStatuses.includes(current.status)) {
                        logger.debug(`[Progression] Skipping ${status} for order ${orderId} — current status: ${current?.status}`);
                        return;
                    }
                    await prisma.order.update({
                        where: { id: orderId },
                        data: { status },
                    });
                    logger.log(`[Progression] Order ${orderId} → ${status}`);
                }
                catch (err) {
                    logger.error(`[Progression] Failed to update order ${orderId} to ${status}`, err);
                }
            }, delayMs);
        }
        logger.log(`[Progression] Scheduled auto-progression for order ${orderId}`);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map