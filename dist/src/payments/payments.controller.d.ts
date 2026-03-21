import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(user: any, body: {
        orderId: string;
        idempotencyKey: string;
    }): Promise<{
        success: boolean;
        cashierUrl: any;
        orderId: string;
    }>;
    getPaymentStatus(user: any, orderId: string): Promise<{
        orderId: string;
        status: string;
    }>;
}
