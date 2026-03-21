import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Address } from '@prisma/client';
export declare class AddressesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<Address[]>;
    findOne(userId: string, id: string): Promise<Address>;
    create(userId: string, data: Omit<Prisma.AddressCreateInput, 'user'>): Promise<Address>;
    update(userId: string, id: string, data: Prisma.AddressUpdateInput): Promise<Address>;
    remove(userId: string, id: string): Promise<Address>;
}
