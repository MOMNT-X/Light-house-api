import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class WebhooksService {
    private ordersService;
    private notificationsService;
    private prisma;
    private configService;
    private readonly logger;
    constructor(ordersService: OrdersService, notificationsService: NotificationsService, prisma: PrismaService, configService: ConfigService);
    handlePaystackWebhook(rawBody: string, signature: string): Promise<{
        received: boolean;
    }>;
}
