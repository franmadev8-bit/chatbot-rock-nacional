import { Injectable, Logger } from "@nestjs/common";
import { LlmService } from "./llm.service.js";
import { PromptService } from "./prompt.service.js";
import { HistoryMessage } from "../types/rag.types.js";

@Injectable()
export class QueryRewriteService {
    private readonly logger = new Logger(QueryRewriteService.name);

    constructor(
        private readonly llm: LlmService,
        private readonly prompt: PromptService
    ) { }

    async rewrite(question: string, history: HistoryMessage[]): Promise<string> {
        if (history.length === 0) return question;

        const conversation = history
            .map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
            .join('\n');

        try {
            const raw = await this.llm.complete([
                { role: 'system', content: this.prompt.queryRewrite },
                { role: 'user', content: `Conversación: \n${conversation}\nPregunta: ${question}\nnReescrita:` }
            ]);
            const rewritten = raw
                .replace(/<think>[\s\S]*?<\/think>/g, '')
                .replace(/^["'«“]+|["'»”]+$/g, '')
                .trim();

            return rewritten || question;
        } catch (e) {
            this.logger.warn(`No se pudo reescribir la pregunta: ${(e as Error).message}`);
            return question;
        }
    }
}