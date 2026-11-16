import { BadRequestException, InternalServerErrorException, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PasswordHasherService } from './password.hasher.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpiredTokenRepository } from '../repositories/expired.token.repository.js';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    global: true,
    useFactory: (config: ConfigService) => ({
      secret: config.getOrThrow<string>('JWT_SECRET'),
      signOptions: { expiresIn: config.getOrThrow('JWT_EXPIRES_IN') ?? '15m' },
    }),
  })
  ],
  providers: [AuthService, PasswordHasherService, ExpiredTokenRepository, UserRepository],
})
export class AuthModule { }
