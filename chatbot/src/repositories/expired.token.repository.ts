import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class ExpiredTokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    async isRevoked(jti: string) {
        const token = await this.prisma.expiredToken.findUnique({ where: { jti: jti } });
        return token !== null;
    }

    async revokeToken(jti: string, exp: number) {
        const expiresAt = new Date(exp * 1000);

        await this.prisma.$transaction([
            this.prisma.expiredToken.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
            this.prisma.expiredToken.upsert({
                where: {
                    jti: jti
                },
                create: {
                    jti: jti,
                    expiresAt: expiresAt
                },
                update: {}
            })
        ])
    }
}