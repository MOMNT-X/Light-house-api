import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Address } from '@prisma/client';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async create(userId: string, data: Omit<Prisma.AddressCreateInput, 'user'>): Promise<Address> {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(userId: string, id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
    await this.findOne(userId, id); // Ensure it belongs to user

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string): Promise<Address> {
    await this.findOne(userId, id);
    return this.prisma.address.delete({
      where: { id },
    });
  }
}
