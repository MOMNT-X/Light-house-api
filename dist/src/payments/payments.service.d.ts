import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private prisma;
    private ordersService;
    private notificationsService;
    private configService;
    private readonly logger;
    private readonly paystackBaseUrl;
    constructor(prisma: PrismaService, ordersService: OrdersService, notificationsService: NotificationsService, configService: ConfigService);
    private get secretKey();
    private get opayMerchantId();
    private get opayPrivateKey();
    private get opayPublicKey();
    private get frontendUrl();
    initiatePayment(userId: string, orderId: string, idempotencyKey: string): Promise<{
        success: boolean;
        authorizationUrl: string;
        reference: string;
    }>;
    verifyPayment(userId: string, reference: string): Promise<{
        success: boolean;
        orderId: string;
        message: string;
    } | {
        success: boolean;
        orderId: string;
        message?: undefined;
    }>;
    verifyOrderPayment(userId: string, orderId: string): Promise<{
        success: boolean;
        orderId: string;
        message: string;
    } | {
        success: boolean;
        orderId: string;
        message?: undefined;
    } | {
        success: boolean;
        orderId: string;
        status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY_FOR_DISPATCH" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        orderId?: undefined;
        status?: undefined;
    }>;
    initiateOpayPayment(userId: string, orderId: string, idempotencyKey: string): Promise<{
        success: boolean;
        cashierUrl: any;
        reference: string;
    }>;
    getPaymentStatus(userId: string, orderId: string): Promise<{
        orderId: string;
        status: string;
    }>;
    private simulatePayment;
}
