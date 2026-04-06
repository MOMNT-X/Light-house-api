import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { IsString, IsUUID, IsOptional, ValidateNested, IsInt, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  menuItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsUUID()
  vendorId!: string;

  @IsUUID()
  addressId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

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
      where: { id: { in: itemIds }, category: { vendorId: data.vendorId } },
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
        subtotal: menuItem.price * item.quantity,
      };
    });

    const deliveryFee = 500 * 100; // Flat ₦500 delivery fee to match frontend Checkout
    const serviceCharge = 100 * 100; // Flat ₦100 service charge
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
        status: OrderStatus.PAYMENT_PENDING,
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

  async findAllByUser(userId: string, skip: number = 0, take: number = 20) {
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

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        vendor: { select: { name: true, logoUrl: true } },
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
      include: {
        vendor: { select: { name: true, logoUrl: true } },
        address: true,
        items: true,
      },
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

  /**
   * Automatically advances an order through fulfilment stages after payment.
   *
   * Timeline (temporary until vendors dashboard is live):
   *   +0 min  → CONFIRMED        (already set by payment verification)
   *   +2 min  → PREPARING
   *   +5 min  → READY_FOR_DISPATCH
   *   +15 min → OUT_FOR_DELIVERY
   *   +10 min → DELIVERED
   *
   * Each step re-checks the order status before updating — a manual
   * admin override (e.g. CANCELLED) will stop the chain.
   */
  scheduleOrderProgression(orderId: string): void {
    const MIN = 60_000; // 1 minute in ms

    const steps: Array<{ delayMs: number; status: OrderStatus }> = [
      { delayMs:  2 * MIN, status: OrderStatus.PREPARING },
      { delayMs:  2 * MIN, status: OrderStatus.READY_FOR_DISPATCH },
      { delayMs: 7 * MIN, status: OrderStatus.OUT_FOR_DELIVERY },
      { delayMs: 10 * MIN, status: OrderStatus.DELIVERED },
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

          // Stop progression if order was cancelled or manually overridden
          const stoppedStatuses: OrderStatus[] = [
            OrderStatus.CANCELLED,
            OrderStatus.DELIVERED,
          ];
          if (!current || stoppedStatuses.includes(current.status as OrderStatus)) {
            logger.debug(`[Progression] Skipping ${status} for order ${orderId} — current status: ${current?.status}`);
            return;
          }

          await prisma.order.update({
            where: { id: orderId },
            data: { status },
          });
          logger.log(`[Progression] Order ${orderId} → ${status}`);
        } catch (err) {
          logger.error(`[Progression] Failed to update order ${orderId} to ${status}`, err);
        }
      }, delayMs);
    }

    logger.log(`[Progression] Scheduled auto-progression for order ${orderId}`);
  }
}

