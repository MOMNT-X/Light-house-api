import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vendor } from '@prisma/client';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.VendorWhereUniqueInput;
    where?: Prisma.VendorWhereInput;
    orderBy?: Prisma.VendorOrderByWithRelationInput;
  }): Promise<Vendor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.vendor.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, deletedAt: null },
    });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  async create(data: Prisma.VendorCreateInput): Promise<Vendor> {
    return this.prisma.vendor.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VendorUpdateInput): Promise<Vendor> {
    await this.findOne(id); // Ensure exists
    return this.prisma.vendor.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Vendor> {
    await this.findOne(id);
    return this.prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
