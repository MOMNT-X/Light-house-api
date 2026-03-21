import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handleOpay(payload: any, signature: string): Promise<{
        success: boolean;
        orderId: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        orderId?: undefined;
    }>;
}
