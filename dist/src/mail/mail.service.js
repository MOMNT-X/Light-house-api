"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    configService;
    transporter;
    logger = new common_1.Logger(MailService_1.name);
    constructor(configService) {
        this.configService = configService;
        const port = this.configService.get('SMTP_PORT') || 587;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
            port,
            secure: port === 465,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendPasswordResetEmail(to, resetLink) {
        const fromEmail = this.configService.get('EMAIL_FROM') || `\"Bogaad\" <${this.configService.get('SMTP_USER')}>`;
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
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
            throw new Error('Failed to send reset email. Please verify SMTP configuration.');
        }
    }
    async sendOrderConfirmationEmail(to, orderDetails) {
        const fromEmail = this.configService.get('EMAIL_FROM') || `\"Bogaad\" <${this.configService.get('SMTP_USER')}>`;
        const itemsHtml = orderDetails.items.map((i) => `
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
        }
        catch (error) {
            this.logger.error(`Failed to send order confirmation email to ${to}`, error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map