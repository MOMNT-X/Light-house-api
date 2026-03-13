import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  initiatePayment(
    @CurrentUser() user: any,
    @Body() body: { orderId: string; idempotencyKey: string },
  ) {
    return this.paymentsService.initiatePayment(user.userId, body.orderId, body.idempotencyKey);
  }

  @Get('status/:orderId')
  getPaymentStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.getPaymentStatus(user.userId, orderId);
  }
}
