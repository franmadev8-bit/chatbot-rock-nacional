import { Injectable, Logger } from "@nestjs/common";
import { LlmService } from "./llm.service.js";
import { PromptService } from "./prompt.service.js";
import { ChatMessageRepository } from "../repositories/chat.message.repository.js";

@Injectable()
export class ChatTitleService {
    private readonly logger = new Logger(ChatTitleService.name);

    constructor(
        private readonly llm: LlmService,
        private readonly prompt: PromptService,
        private readonly chats: ChatMessageRepository,
    ) { }

    provisional(question: string) {
        const clean = question.trim().replace(/\s+/g, ' ');
        return clean.length > 50 ? `${clean.slice(0, 50)}…` : clean;
    }

    generateInBackground(chatId: string, question: string) {
        this.generate(chatId, question).catch((e) =>
            this.logger.warn(`No se pudo generar el título del chat ${chatId}: ${e.message}`),
        );
    }

    /* ============================== PRIVATE ============================== */
    private async generate(chatId: string, question: string) {
        const raw = await this.llm.complete([
            { role: 'system', content: this.prompt.chatTitle },
            { role: 'user', content: question },
        ]);

        const title = this.clean(raw);
        if (title) await this.chats.updateTitle(chatId, title);
    }

    private clean(raw: string) {
        return raw
            .replace(/<think>[\s\S]*?<\/think>/g, '')
            .replace(/^["'«»“”]+|["'«»“”.]+$/g, '')
            .trim()
            .slice(0, 80);
    }
}