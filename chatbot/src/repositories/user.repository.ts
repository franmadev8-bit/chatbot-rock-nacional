import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { BaseRepository } from "./base.repository.js";

@Injectable()
export class UserRepository extends BaseRepository<'User'> {
    constructor(prisma: PrismaService) {
        super(prisma, 'User');
    }
}