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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        return this.prisma.cartItem.findMany({
            where: { userId },
            include: {
                menuItem: true,
                vendor: { select: { name: true, id: true } },
            },
        });
    }
    async addToCart(userId, vendorId, menuItemId, quantity = 1) {
        const existingItems = await this.prisma.cartItem.findMany({
            where: { userId },
            take: 1,
        });
        if (existingItems.length > 0 && existingItems[0].vendorId !== vendorId) {
            throw new common_1.BadRequestException('You can only order from one vendor at a time. Please clear your cart first.');
        }
        await this.prisma.cartItem.upsert({
            where: {
                userId_vendorId_menuItemId: {
                    userId,
                    vendorId,
                    menuItemId,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                userId,
                vendorId,
                menuItemId,
                quantity,
            },
        });
        return this.getCart(userId);
    }
    async updateQuantity(userId, menuItemId, quantity) {
        if (quantity <= 0) {
            return this.removeFromCart(userId, menuItemId);
        }
        const item = await this.prisma.cartItem.findFirst({
            where: { userId, menuItemId },
        });
        if (!item) {
            throw new common_1.BadRequestException('Item not found in cart');
        }
        await this.prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity },
        });
        return this.getCart(userId);
    }
    async removeFromCart(userId, menuItemId) {
        await this.prisma.cartItem.deleteMany({
            where: { userId, menuItemId },
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        await this.prisma.cartItem.deleteMany({
            where: { userId },
        });
        return [];
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map