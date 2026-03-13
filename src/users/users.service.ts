import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.findById(id); // Ensures user exists
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    await this.findById(id); // Ensures user exists
    // Soft delete
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
