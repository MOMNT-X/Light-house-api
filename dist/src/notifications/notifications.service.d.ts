export declare class NotificationsService {
    private readonly logger;
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
    sendSms(phoneNumber: string, message: string): Promise<boolean>;
    sendInAppNotification(userId: string, title: string, message: string): Promise<boolean>;
    sendDiscordNotification(content: string, embeds?: any[]): Promise<boolean>;
}
