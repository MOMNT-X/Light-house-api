import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getCookieMaxAge(): number {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '3d';
    const amount = parseInt(expiresIn);
    const unit = expiresIn.slice(-1).toLowerCase();

    if (unit === 'd') return amount * 24 * 60 * 60 * 1000;
    if (unit === 'h') return amount * 60 * 60 * 1000;
    if (unit === 'm') return amount * 60 * 1000;
    return 3 * 24 * 60 * 60 * 1000; // default 3 days
  }


  @Public()
  @Post('signup')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.signup(signupDto);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: this.getCookieMaxAge(),
    });

    return { user, accessToken };
  }

  @Public()
  @Post('login')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(loginDto);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: this.getCookieMaxAge(),
    });

    return { user, accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.userId);
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rfToken = req.cookies?.['refresh_token'];
    
    if (!rfToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      // Decode JWT payload to extract sub (userId)
      const base64Url = rfToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
      );
      const sub = JSON.parse(jsonPayload).sub;

      const { accessToken, refreshToken } = await this.authService.refreshTokens(sub, rfToken);
      
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: this.getCookieMaxAge(),
      });

      return { accessToken };
    } catch {
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    await this.authService.forgotPassword(email);
    return { message: 'If an account exists, a password reset email has been sent.' };
  }

  @Public()
  @Post('reset-password')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: any) {
    const { email, token, newPassword } = body;
    if (!email || !token || !newPassword) {
      throw new UnauthorizedException('Missing required fields for reset');
    }
    await this.authService.resetPassword(email, token, newPassword);
    return { message: 'Password has been successfully reset. You can now login.' };
  }
}
