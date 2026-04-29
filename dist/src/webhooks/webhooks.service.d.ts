import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
export declare class WebhooksService {
    private ordersService;
    private notificationsService;
    private prisma;
    private mailService;
    private configService;
    private readonly logger;
    constructor(ordersService: OrdersService, notificationsService: NotificationsService, prisma: PrismaService, mailService: MailService, configService: ConfigService);
    handlePaystackWebhook(rawBody: string, signature: string): Promise<{
        received: boolean;
    }>;
}
