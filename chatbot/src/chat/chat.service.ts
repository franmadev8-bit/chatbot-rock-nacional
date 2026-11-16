import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageRepository } from '../repositories/chat.message.repository.js';
import { MessageRepository } from '../repositories/message.repository.js';
import { ChatTitleService } from '../rag/chat.title.service.js';
import { RagService } from '../rag/rag.service.js';
import { SendMessageResponse } from '../types/chat.type.js';

@Injectable()
export class ChatService {

    constructor(
        private readonly chats: ChatMessageRepository,
        private readonly messages: MessageRepository,
        private readonly titles: ChatTitleService,
        private readonly rag: RagService,
    ) { }

    async send(userId: string, question: string, chatId?: string): Promise<SendMessageResponse> {
        const isNew = !chatId;

        const chat = isNew
            ? await this.chats.createForUser(userId, this.titles.provisional(question))
            : await this.chats.findByIdForUser(chatId, userId);

        if (!chat) throw new NotFoundException('Chat no encontrado');

        const history = await this.messages.getRecent(chat.id);

        await this.messages.add(chat.id, 'user', question);

        const { answer, sources } = await this.rag.ask(question, history);

        await this.messages.add(chat.id, 'assistant', answer);

        if (isNew) this.titles.generateInBackground(chat.id, question);

        const result: SendMessageResponse = { chatId: chat.id, title: chat.title, answer, sources };
        return result;
    }

    list(userId: string) {
        return this.chats.listForUser(userId);
    }

    async getMessages(userId: string, chatId: string) {
        const chat = await this.chats.findByIdForUser(chatId, userId);
        if (!chat) throw new NotFoundException('Chat no encontrado');
        return this.messages.getByChat(chatId);
    }
}
