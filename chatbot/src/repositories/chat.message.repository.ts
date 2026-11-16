import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { BaseRepository } from "./base.repository.js";

@Injectable()
export class ChatMessageRepository extends BaseRepository<'ChatMessage'> {
    constructor(prisma: PrismaService) {
        super(prisma, 'ChatMessage');
    }

    createForUser(userId: string, title: string) {
        return this.newOne({ data: { userId: userId, title: title } })
    }

    findByIdForUser(chatId: string, userId: string) {
        return this.getOne({ where: { id: chatId, user: { id: userId } } });
    }

    updateTitle(chatId: string, title: string) {
        return this.changeOne({ where: { id: chatId }, data: { title } });
    }

    listForUser(userId: string) {
        return this.getAll({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, createdAt: true } });
    }
}