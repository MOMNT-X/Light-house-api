import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(user: any, body: {
        orderId: string;
        idempotencyKey: string;
    }): Promise<{
        success: boolean;
        authorizationUrl: string;
        reference: string;
    }>;
    initiateOpayPayment(user: any, body: {
        orderId: string;
        idempotencyKey: string;
    }): Promise<{
        success: boolean;
        cashierUrl: any;
        reference: string;
    }>;
    verifyPayment(user: any, reference: string): Promise<{
        success: boolean;
        orderId: string;
        message: string;
    } | {
        success: boolean;
        orderId: string;
        message?: undefined;
    }>;
    getPaymentStatus(user: any, orderId: string): Promise<{
        orderId: string;
        status: string;
    }>;
    verifyOrderPayment(user: any, orderId: string): Promise<{
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
}
