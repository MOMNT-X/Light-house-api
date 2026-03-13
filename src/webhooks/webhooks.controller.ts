import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public() // Webhooks come from external sources without JWT
  @Post('opay')
  @HttpCode(HttpStatus.OK)
  async handleOpay(
    @Body() payload: any,
    @Headers('opay-signature') signature: string, // Typically webhook providers send a signature
  ) {
    // Return immediately to acknowledge receipt if processed asynchronously,
    // but here we process it directly
    return this.webhooksService.handleOpayWebhook(payload, signature);
  }
}
