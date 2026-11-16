import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt.payload.type.js';
import { ExpiredTokenRepository } from '../repositories/expired.token.repository.js';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly expired: ExpiredTokenRepository,
    private readonly jwt: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const token = request.cookies?.['access_token'];

    if (!token) throw new UnauthorizedException('No autenticado.');

    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync(token)
    } catch (e) {
      console.log(e);

      throw new UnauthorizedException('Token invalido o vencido.');
    }

    const isRevoked = await this.expired.isRevoked(payload.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Sesión cerrada.');
    }

    request['user'] = payload;
    return true;
  }
}
