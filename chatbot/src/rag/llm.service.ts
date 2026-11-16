import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { Message } from "../types/llm.types.js";

@Injectable()
export class LlmService {
    private readonly client: OpenAI;
    private readonly model: string;
    private readonly temperature: number;

    constructor(config: ConfigService) {
        this.temperature = parseFloat(config.getOrThrow<string>('TEMPERATURE'))

        this.client = new OpenAI({
            apiKey: config.getOrThrow<string>('GROQ_API_KEY'),
            baseURL: config.getOrThrow<string>('GROQ_API_URL')
        })
        this.model = config.getOrThrow<string>('GROQ_MODEL')
    }

    async complete(messages: Message[]): Promise<string> {
        const res = await this.client.chat.completions.create({
            model: this.model,
            messages,
            temperature: this.temperature
        });
        return res.choices[0]?.message?.content?.trim() ?? ''
    }

    
}