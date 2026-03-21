import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: any): Promise<({
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
    addToCart(user: any, body: AddToCartDto): Promise<({
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
    updateQuantity(user: any, menuItemId: string, quantity: number): Promise<({
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
    removeFromCart(user: any, menuItemId: string): Promise<({
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
    clearCart(user: any): Promise<never[]>;
}
