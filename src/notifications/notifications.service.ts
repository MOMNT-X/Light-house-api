import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

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
}
