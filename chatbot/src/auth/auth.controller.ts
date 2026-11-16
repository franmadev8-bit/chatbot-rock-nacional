import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from '../Models/AuthDto.js';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from '../Models/SignUpDto.js';
import { ExpiredTokenRepository } from '../repositories/expired.token.repository.js';
import { CurrentUser } from '../middlewares/curremt.user.middleware.js';
import type { JwtPayload } from '../types/jwt.payload.type.js';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  private readonly cookieMaxAge: number;
  private readonly isProd: boolean;

  constructor(
    config: ConfigService,
    private readonly expired: ExpiredTokenRepository,
    private readonly auth: AuthService,
  ) {
    this.cookieMaxAge = Number(config.getOrThrow('JWT_COOKIE_MAX_AGE_MS') ?? 15 * 60 * 1000);
    this.isProd = config.get('NODE_ENV') === 'production';
  }

  @Post('sign-in')
  async signIn(@Res({ passthrough: true }) res: Response, @Body() auth: AuthDto) {
    const token = await this.auth.signIn(auth);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.isProd,
      maxAge: this.cookieMaxAge,
      sameSite: 'lax'
    })

    return { ok: true }
  }

  @Post('sign-up')
  @HttpCode(201)
  async signUp(@Body() auth: SignUpDto) {
    await this.auth.signUp(auth);
  }


  @UseGuards(AuthGuard)
  @Post('sign-out')
  @HttpCode(200)
  async signOut(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    await this.expired.revokeToken(user.jti, user.exp);
    res.clearCookie('access_token', {
      sameSite: 'lax',
      httpOnly: true,
      secure: this.isProd
    });
    return { ok: true }
  }


  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser('sub') userId: string) {
    return this.auth.me(userId);
  }
}
