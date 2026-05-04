import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
    sendSms(phoneNumber: string, message: string): Promise<boolean>;
    sendInAppNotification(userId: string, title: string, message: string): Promise<boolean>;
    sendDiscordNotification(content: string, embeds?: any[]): Promise<boolean>;
}
