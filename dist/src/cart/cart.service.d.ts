import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<({
        vendor: {
            name: string;
            id: string;
        };
        menuItem: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string;
            sortOrder: number;
            categoryId: string;
            price: number;
            imageUrl: string | null;
            availability: import("@prisma/client").$Enums.AvailabilityState;
            availableFrom: string | null;
            availableTo: string | null;
            prepTimeMinutes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        vendorId: string;
        menuItemId: string;
    })[]>;
    addToCart(userId: string, vendorId: string, menuItemId: string, quantity?: number): Promise<({
        vendor: {
            name: string;
            id: string;
        };
        menuItem: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string;
            sortOrder: number;
            categoryId: string;
            price: number;
            imageUrl: string | null;
            availability: import("@prisma/client").$Enums.AvailabilityState;
            availableFrom: string | null;
            availableTo: string | null;
            prepTimeMinutes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        vendorId: string;
        menuItemId: string;
    })[]>;
    updateQuantity(userId: string, menuItemId: string, quantity: number): Promise<({
        vendor: {
            name: string;
            id: string;
        };
        menuItem: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string;
            sortOrder: number;
            categoryId: string;
            price: number;
            imageUrl: string | null;
            availability: import("@prisma/client").$Enums.AvailabilityState;
            availableFrom: string | null;
            availableTo: string | null;
            prepTimeMinutes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        vendorId: string;
        menuItemId: string;
    })[]>;
    removeFromCart(userId: string, menuItemId: string): Promise<({
        vendor: {
            name: string;
            id: string;
        };
        menuItem: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string;
            sortOrder: number;
            categoryId: string;
            price: number;
            imageUrl: string | null;
            availability: import("@prisma/client").$Enums.AvailabilityState;
            availableFrom: string | null;
            availableTo: string | null;
            prepTimeMinutes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        quantity: number;
        vendorId: string;
        menuItemId: string;
    })[]>;
    clearCart(userId: string): Promise<never[]>;
}
