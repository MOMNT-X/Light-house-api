import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.signup(signupDto);
    
    // Store refresh token in an HTTP-Only cookie to prevent XSS
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user, accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(loginDto);
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user.userId);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rfToken = req.cookies?.['refresh_token'];
    
    if (!rfToken) {
      // Return 401 instead of throwing directly so the client cleanly catches it
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No refresh token' });
      return;
    }

    try {
      // Decode JWT simply to get the subject without full verification here 
      // (The service does DB verification against bcrypt hash anyway)
      // Actually we'll need to parse the token to extract the sub safely:
      const base64Url = rfToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const sub = JSON.parse(jsonPayload).sub;

      const { accessToken, refreshToken } = await this.authService.refreshTokens(sub, rfToken);
      
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken };
    } catch {
      res.clearCookie('refresh_token');
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    // TODO: Implement actual email sending logic
    return { message: 'If an account exists, a password reset email has been sent.' };
  }
}
