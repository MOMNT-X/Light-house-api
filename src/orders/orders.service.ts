import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus, PaymentStatus } from '@prisma/client';

export class CreateOrderDto {
  vendorId!: string;
  addressId!: string;
  items!: { menuItemId: string; quantity: number }[];
  notes?: string;
  idempotencyKey?: string;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Generate a random 6-character alphanumeric string for orderNumber
  private generateOrderNumber(): string {
    return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async create(userId: string, data: CreateOrderDto): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Check idempotency key to prevent duplicate orders
    if (data.idempotencyKey) {
      const existing = await this.prisma.order.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
      });
      if (existing) return existing;
    }

    // Verify vendor and fetch delivery fee
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: data.vendorId },
    });
    if (!vendor) throw new BadRequestException('Invalid vendor');

    const itemIds = data.items.map(i => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: itemIds }, vendorId: data.vendorId },
    });

    if (menuItems.length !== data.items.length) {
      throw new BadRequestException('Some items are invalid or do not belong to the selected vendor');
    }

    // Compute pricing (in kobo)
    let subtotal = 0;
    const orderItemsCreate = data.items.map(item => {
      const menuItem = menuItems.find((m: any) => m.id === item.menuItemId)!;
      subtotal += menuItem.price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price, // snapshot price at time of order
        name: menuItem.name,
      };
    });

    const deliveryFee = vendor.deliveryFee;
    const serviceCharge = 100 * 100; // Flat ₦100 service charge for example
    const total = subtotal + deliveryFee + serviceCharge;

    const orderNumber = this.generateOrderNumber();

    return this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        vendorId: data.vendorId,
        addressId: data.addressId,
        notes: data.notes,
        subtotal,
        deliveryFee,
        serviceCharge,
        total,
        status: OrderStatus.PAYMENT_PENDING,
        paymentStatus: PaymentStatus.PENDING,
        idempotencyKey: data.idempotencyKey,
        items: {
          create: orderItemsCreate,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAllByUser(userId: string, skip: number = 0, take: number = 20) {
    const [orders, count] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: { select: { name: true, imageUrl: true } },
          items: true,
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { orders, count, totalPages: Math.ceil(count / take) };
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        vendor: { select: { name: true, imageUrl: true } },
        address: true,
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOneByReference(reference: string) {
    const order = await this.prisma.order.findFirst({
      where: { idempotencyKey: reference },
    });
    if (!order) throw new NotFoundException('Order not found via reference');
    return order;
  }

  // Used by admin/vendors/system
  async updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const data: Prisma.OrderUpdateInput = { status };
    
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async cancel(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}
