import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import { AuthDto } from '../Models/AuthDto.js';
import { PasswordHasherService } from './password.hasher.service.js';
import { JwtService } from '@nestjs/jwt';
import { JwtSignPayload } from '../types/jwt.payload.type.js';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from '../Models/SignUpDto.js';

@Injectable()
export class AuthService {
    private dummyHash: string;

    constructor(
        config: ConfigService,
        private readonly auth: UserRepository,
        private readonly hash: PasswordHasherService,
        private readonly jwt: JwtService
    ) {
        this.dummyHash = config.getOrThrow<string>('JWT_PASSWORD_COMPARE');
    }

    async signIn(auth: AuthDto): Promise<string> {
        const user = await this.auth.getOne({ where: { email: auth.email } })
        const match = await this.hash.compare(auth.password, user?.password ?? this.dummyHash);

        if (!user || !match) throw new UnauthorizedException('Credenciales Invalidas.');

        const payload: JwtSignPayload = { sub: user.id, email: user.email };
        return await this.jwt.signAsync<JwtSignPayload>(payload, { jwtid: randomUUID() });
    }


    async signUp(data: SignUpDto): Promise<boolean> {
        const email = data.email.trim().toLowerCase();
        const user = await this.auth.getOne({ where: { email: email } });
        if (user) throw new ConflictException('Email ya registrado.');

        const hashPassword = await this.hash.hash(data.password);

        await this.auth.newOne({
            data: {
                email: email,
                name: data.name,
                password: hashPassword,
            }
        })
        return true;
    }

    async me(userId: string) {
        const user = await this.auth.getOne({ where: { id: userId }, select: { id: true, name: true, email: true } });
        if (!user) throw new UnauthorizedException('No autenticado.');
        return user;
    }

}
