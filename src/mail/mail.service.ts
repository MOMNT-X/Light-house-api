import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const fromEmail = this.configService.get<string>('EMAIL_FROM') || `\"Bogaad\" <${this.configService.get<string>('SMTP_USER')}>`;
    const mailOptions = {
      from: fromEmail,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ea580c;">Password Reset</h2>
          <p>We received a request to reset your password for Bogaad.</p>
          <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 1px solid #f1f5f9; margin-top: 30px;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Bogaad - Delivered with Comfort</p>
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

  async sendOrderConfirmationEmail(to: string, orderDetails: any) {
    const fromEmail = this.configService.get<string>('EMAIL_FROM') || `\"Bogaad\" <${this.configService.get<string>('SMTP_USER')}>`;
    
    const itemsHtml = orderDetails.items.map((i: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${i.quantity}x ${i.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right;">₦${(i.price / 100).toLocaleString()}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: fromEmail,
      to,
      subject: `Order Confirmation #${orderDetails.id.substring(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ea580c;">Order Confirmed!</h2>
          <p>Hi ${orderDetails.userFirstName || 'there'},</p>
          <p>We've received your order and it's now being processed. Here are your order details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left;">
                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0;">Item</th>
                <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Subtotal:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right;">₦${(orderDetails.subtotal / 100).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; text-align: right;">Delivery Fee:</td>
                <td style="padding: 10px; text-align: right;">₦${(orderDetails.deliveryFee / 100).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; color: #ea580c;">₦${(orderDetails.total / 100).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold;">Delivery Address:</p>
            <p style="margin: 5px 0 0 0;">${orderDetails.addressStr}</p>
          </div>
          
          <p style="margin-top: 30px;">Thank you for choosing Bogaad!</p>
          <hr style="border: 1px solid #f1f5f9; margin-top: 30px;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Bogaad - Delivered with Comfort</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Order confirmation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send order confirmation email to ${to}`, error);
    }
  }
}
