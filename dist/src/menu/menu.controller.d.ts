import { MenuService } from './menu.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    findAllByVendor(vendorId: string): Promise<any[]>;
    getCategoriesWithItems(vendorId: string): Promise<{
        name: string;
        items: any;
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    create(createData: CreateMenuItemDto): Promise<{
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
    }>;
    update(id: string, updateData: UpdateMenuItemDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
