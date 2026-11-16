import { Injectable } from "@nestjs/common";
import { MessageRole } from "../generated/prisma/enums.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { BaseRepository } from "./base.repository.js";
import { HistoryMessage } from "../types/rag.types.js";

@Injectable()
export class MessageRepository extends BaseRepository<'Message'> {
    constructor(prisma: PrismaService) {
        super(prisma, 'Message');
    }


    add(chatId: string, role: MessageRole, content: string, tokens?: number) {
        return this.newOne({ data: { chatId, role, content, tokens } })
    }

    async getRecent(chatId: string, limit: number = 6): Promise<HistoryMessage[]> {
        const messages = await this.getAll({
            where: { chatId },
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        return messages
            .reverse()
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    }

    getByChat(chatId: string) {
        return this.getAll({
            where: { chatId, role: { in: ['user', 'assistant'] } },
            orderBy: { createdAt: 'asc' },
            select: { id: true, role: true, content: true, createdAt: true },
        });
    }
}