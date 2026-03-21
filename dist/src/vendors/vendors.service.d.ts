import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vendor } from '@prisma/client';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.VendorWhereUniqueInput;
        where?: Prisma.VendorWhereInput;
        orderBy?: Prisma.VendorOrderByWithRelationInput;
    }): Promise<Vendor[]>;
    findOne(id: string): Promise<Vendor>;
    create(data: Prisma.VendorCreateInput): Promise<Vendor>;
    update(id: string, data: Prisma.VendorUpdateInput): Promise<Vendor>;
    remove(id: string): Promise<Vendor>;
}
