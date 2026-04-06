import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  /**
   * POST /webhooks/paystack
   * Receives Paystack webhook events.
   * @Public — no JWT, but we verify the x-paystack-signature HMAC in the service.
   */
  @Public()
  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystack(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    // We pass the raw JSON string for HMAC verification.
    // NestJS has already parsed the body, so we re-serialize it.
    // This works correctly with Paystack as they sign the raw JSON body.
    const rawBody = JSON.stringify(body);
    return this.webhooksService.handlePaystackWebhook(rawBody, signature);
  }
}
