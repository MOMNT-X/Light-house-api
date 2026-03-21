import { OrdersService, CreateOrderDto } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: any, createOrderDto: CreateOrderDto): Promise<{
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
    findAll(user: any, page?: string, limit?: string): Promise<{
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
    findOne(user: any, id: string): Promise<{
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
            latitude: import("@prisma/client-runtime-utils").Decimal | null;
            longitude: import("@prisma/client-runtime-utils").Decimal | null;
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
    cancel(user: any, id: string): Promise<{
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
}
