import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class WebhooksService {
    private ordersService;
    private notificationsService;
    private readonly logger;
    constructor(ordersService: OrdersService, notificationsService: NotificationsService);
    handleOpayWebhook(payload: any, signature: string): Promise<{
        success: boolean;
        orderId: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        orderId?: undefined;
    }>;
}
