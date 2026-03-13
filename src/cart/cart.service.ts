import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        menuItem: true,
        vendor: { select: { name: true, id: true } },
      },
    });
  }

  async addToCart(userId: string, vendorId: string, menuItemId: string, quantity: number = 1) {
    // Enforce single-vendor cart logic
    const existingItems = await this.prisma.cartItem.findMany({
      where: { userId },
      take: 1, // Just need to check if there's any item from another vendor
    });

    if (existingItems.length > 0 && existingItems[0].vendorId !== vendorId) {
      throw new BadRequestException('You can only order from one vendor at a time. Please clear your cart first.');
    }

    // Upsert avoids Prisma unique constraint violation
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

  async updateQuantity(userId: string, menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, menuItemId);
    }

    // Find the cart item first to ensure it belongs to the user
    const item = await this.prisma.cartItem.findFirst({
      where: { userId, menuItemId },
    });

    if (!item) {
      throw new BadRequestException('Item not found in cart');
    }

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, menuItemId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId, menuItemId },
    });
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });
    return [];
  }
}
