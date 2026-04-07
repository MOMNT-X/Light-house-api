import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handlePaystack(body: any, signature: string): Promise<{
        received: boolean;
    }>;
}
