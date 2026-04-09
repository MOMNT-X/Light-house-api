import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const mailOptions = {
      from: `"Light House Logistics" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ea580c;">Password Reset</h2>
          <p>We received a request to reset your password for Light House Logistics.</p>
          <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 1px solid #f1f5f9; margin-top: 30px;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Light House Logistics - Delivered with Comfort</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      // Even if email fails, we don't necessarily throw a 500 error to the client, 
      // but maybe we just log it depending on environment. Let's throw for now to make sure it's caught
      throw new Error('Failed to send reset email. Please verify SMTP configuration.');
    }
  }
}
