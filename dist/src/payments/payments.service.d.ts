import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private prisma;
    private ordersService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, ordersService: OrdersService, configService: ConfigService);
    private getOpayConfig;
    initiatePayment(userId: string, orderId: string, idempotencyKey: string): Promise<{
        success: boolean;
        cashierUrl: any;
        orderId: string;
    }>;
    private simulatePayment;
    getPaymentStatus(userId: string, orderId: string): Promise<{
        orderId: string;
        status: string;
    }>;
}
