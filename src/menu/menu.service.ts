import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, MenuItem } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAllByVendor(vendorId: string): Promise<any[]> {
    return this.prisma.menuItem.findMany({
      where: { category: { vendorId }, deletedAt: null },
      orderBy: { categoryId: 'asc' }, // Order by category ID or sortOrder instead
      include: { category: true },
    });
  }

  async getCategoriesWithItems(vendorId: string) {
    const items = await this.findAllByVendor(vendorId);
    
    // Group by category name
    const grouped = items.reduce((acc, item) => {
      const catName = item.category?.name || 'Uncategorized';
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.keys(grouped).map(category => ({
      name: category,
      items: grouped[category],
    }));
  }

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.prisma.menuItem.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException(`Menu item not found`);
    }
    return item;
  }

  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({ data });
  }

  async update(id: string, data: Prisma.MenuItemUpdateInput): Promise<MenuItem> {
    await this.findOne(id);
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<MenuItem> {
    await this.findOne(id);
    return this.prisma.menuItem.update({
      where: { id },
      data: { deletedAt: new Date(), availability: 'SOLD_OUT' }, // Also mark sold out for safety
    });
  }
}
