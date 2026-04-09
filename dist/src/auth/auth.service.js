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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    prisma;
    mailService;
    constructor(usersService, jwtService, configService, prisma, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async signup(signupDto) {
        const existingUser = await this.usersService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);
        const user = await this.usersService.create({
            email: signupDto.email,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            phone: signupDto.phone,
            passwordHash: hashedPassword,
            role: client_1.Role.CUSTOMER,
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { passwordHash: _, ...result } = user;
        return { user: result, ...tokens };
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { passwordHash: _, ...result } = user;
        return { user: result, ...tokens };
    }
    async logout(userId) {
        return this.prisma.userSession.deleteMany({
            where: { userId },
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const sessions = await this.prisma.userSession.findMany({
            where: { userId, expiresAt: { gt: new Date() } },
        });
        let validSession = null;
        for (const session of sessions) {
            const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (isMatch) {
                validSession = session;
                break;
            }
        }
        if (!validSession) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = await bcrypt.hash(token, 10);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: tokenHash,
                passwordResetExpires: expires,
            },
        });
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        await this.mailService.sendPasswordResetEmail(user.email, resetLink);
    }
    async resetPassword(email, token, newPassword) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (new Date() > user.passwordResetExpires) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const isValid = await bcrypt.compare(token, user.passwordResetToken);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        await this.logout(user.id);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.userSession.deleteMany({
            where: { userId, expiresAt: { lt: new Date() } },
        });
        const MAX_SESSIONS = 5;
        const sessions = await this.prisma.userSession.findMany({
            where: { userId, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'asc' },
        });
        if (sessions.length >= MAX_SESSIONS) {
            const toDelete = sessions.slice(0, sessions.length - MAX_SESSIONS + 1);
            await this.prisma.userSession.deleteMany({
                where: { id: { in: toDelete.map(s => s.id) } },
            });
        }
        await this.prisma.userSession.create({
            data: {
                userId,
                refreshTokenHash: hashedRefreshToken,
                expiresAt,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map