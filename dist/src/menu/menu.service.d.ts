import { PrismaService } from '../prisma/prisma.service';
import { Prisma, MenuItem } from '@prisma/client';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByVendor(vendorId: string): Promise<any[]>;
    getCategoriesWithItems(vendorId: string): Promise<{
        name: string;
        items: any;
    }[]>;
    findOne(id: string): Promise<MenuItem>;
    create(data: Prisma.MenuItemCreateInput): Promise<MenuItem>;
    update(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItem>;
    remove(id: string): Promise<MenuItem>;
}
