import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    private getCookieMaxAge;
    signup(signupDto: SignupDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            isActive: boolean;
            avatarUrl: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            isActive: boolean;
            avatarUrl: string | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        accessToken: string;
    }>;
    logout(user: any, res: Response): Promise<{
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
