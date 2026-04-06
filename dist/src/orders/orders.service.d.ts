import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Order, OrderStatus, PaymentStatus } from '@prisma/client';
declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    vendorId: string;
    addressId: string;
    items: OrderItemDto[];
    notes?: string;
    idempotencyKey?: string;
}
export declare class OrdersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateOrderDto): Promise<Order>;
    findAllByUser(userId: string, skip?: number, take?: number): Promise<{
        orders: ({
            vendor: {
                name: string;
                logoUrl: string | null;
            };
            items: {
                name: string;
                id: string;
                quantity: number;
                menuItemId: string;
                subtotal: number;
                orderId: string;
                price: number;
            }[];
        } & {
            promoCode: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            vendorId: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            subtotal: number;
            deliveryFee: number;
            serviceCharge: number;
            discount: number;
            total: number;
            notes: string | null;
            idempotencyKey: string;
            addressId: string;
        })[];
        count: number;
        totalPages: number;
    }>;
    findOne(userId: string, id: string): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            state: string;
            landmark: string | null;
            deliveryInstructions: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            isDefault: boolean;
        };
        vendor: {
            name: string;
            logoUrl: string | null;
        };
        items: {
            name: string;
            id: string;
            quantity: number;
            menuItemId: string;
            subtotal: number;
            orderId: string;
            price: number;
        }[];
    } & {
        promoCode: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        deliveryFee: number;
        serviceCharge: number;
        discount: number;
        total: number;
        notes: string | null;
        idempotencyKey: string;
        addressId: string;
    }>;
    findOneByReference(reference: string): Promise<{
        address: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            street: string;
            city: string;
            state: string;
            landmark: string | null;
            deliveryInstructions: string | null;
            latitude: Prisma.Decimal | null;
            longitude: Prisma.Decimal | null;
            isDefault: boolean;
        };
        vendor: {
            name: string;
            logoUrl: string | null;
        };
        items: {
            name: string;
            id: string;
            quantity: number;
            menuItemId: string;
            subtotal: number;
            orderId: string;
            price: number;
        }[];
    } & {
        promoCode: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        deliveryFee: number;
        serviceCharge: number;
        discount: number;
        total: number;
        notes: string | null;
        idempotencyKey: string;
        addressId: string;
    }>;
    updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus): Promise<{
        promoCode: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        deliveryFee: number;
        serviceCharge: number;
        discount: number;
        total: number;
        notes: string | null;
        idempotencyKey: string;
        addressId: string;
    }>;
    cancel(userId: string, id: string): Promise<{
        promoCode: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        vendorId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        deliveryFee: number;
        serviceCharge: number;
        discount: number;
        total: number;
        notes: string | null;
        idempotencyKey: string;
        addressId: string;
    }>;
    scheduleOrderProgression(orderId: string): void;
}
export {};
