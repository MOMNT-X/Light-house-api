import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * POST /payments/initialize
   * Calls Paystack to create a transaction and returns the authorizationUrl.
   */
  @Post('initialize')
  initiatePayment(
    @CurrentUser() user: any,
    @Body() body: { orderId: string; idempotencyKey: string },
  ) {
    return this.paymentsService.initiatePayment(user.userId, body.orderId, body.idempotencyKey);
  }

  /**
   * POST /payments/initiate-opay
   * Calls OPay Cashier to create a transaction and returns the cashierUrl.
   */
  @Post('initiate-opay')
  initiateOpayPayment(
    @CurrentUser() user: any,
    @Body() body: { orderId: string; idempotencyKey: string },
  ) {
    return this.paymentsService.initiateOpayPayment(user.userId, body.orderId, body.idempotencyKey);
  }

  /**
   * GET /payments/verify?reference=xxx
   * Called after Paystack redirects back to the frontend.
   * Backend verifies with Paystack, updates order, sends notification.
   */
  @Get('verify')
  verifyPayment(
    @CurrentUser() user: any,
    @Query('reference') reference: string,
  ) {
    return this.paymentsService.verifyPayment(user.userId, reference);
  }

  /**
   * GET /payments/status/:orderId
   * Polling endpoint — returns simplified status for the frontend.
   */
  @Get('status/:orderId')
  getPaymentStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.getPaymentStatus(user.userId, orderId);
  }

  /**
   * POST /payments/verify-order/:orderId
   * Called by the frontend 'Refresh Status' button to actively poll the payment gateway.
   */
  @Post('verify-order/:orderId')
  verifyOrderPayment(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.verifyOrderPayment(user.userId, orderId);
  }
}
