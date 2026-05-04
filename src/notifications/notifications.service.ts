import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`[EMAIL] To: ${to} | Subj: ${subject} | Body: ${body}`);
    // In production, integrate SendGrid, Resend, AWS SES, etc.
    return true;
  }

  async sendSms(phoneNumber: string, message: string) {
    this.logger.log(`[SMS] To: ${phoneNumber} | Msg: ${message}`);
    // In production, integrate Twilio, Termii, etc.
    return true;
  }

  async sendInAppNotification(userId: string, title: string, message: string) {
    this.logger.log(`[IN-APP] User: ${userId} | Title: ${title} | Msg: ${message}`);
    // Here we could save to DB and emit to WebSocket via TrackingGateway/NotificationGateway
    return true;
  }

  async sendDiscordNotification(content: string, embeds?: any[]) {
    const webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL') || process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      this.logger.warn('DISCORD_WEBHOOK_URL not set — skipping Discord notification');
      return false;
    }

    try {
      this.logger.log(`[DISCORD] Sending webhook notification`);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, embeds }),
      });

      if (!response.ok) {
        this.logger.error(`Discord webhook failed: ${response.statusText}`);
        return false;
      }
      return true;
    } catch (error) {
      this.logger.error('Failed to send Discord notification', error);
      return false;
    }
  }
}
