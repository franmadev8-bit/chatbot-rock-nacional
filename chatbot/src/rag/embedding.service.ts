import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedResult, JinaResponse, JinaTask } from "../types/embedding.type.js";

@Injectable()
export class EmbeddingService {
    private readonly url: string;
    private readonly apiKey: string;
    private readonly model: string;
    private readonly DIMENSIONS: number;
    private readonly MAX_BATCH_TOKENS: number;
    private readonly MAX_RETRIES: number;

    constructor(config: ConfigService) {
        this.url = config.getOrThrow('JINA_API_URL');
        this.apiKey = config.getOrThrow('JINA_API_KEY');
        this.model = config.getOrThrow('JINA_MODEL');
        this.DIMENSIONS = parseInt(config.getOrThrow('JINA_DIMENSION'));
        this.MAX_BATCH_TOKENS = parseInt(config.getOrThrow('JINA_MAX_BATCH_TOKENS'));
        this.MAX_RETRIES = parseInt(config.getOrThrow('JINA_MAX_RETRIES'));
    }

    get dimensions() {
        return this.DIMENSIONS;
    }

    get modelName() {
        return this.model;
    }

    async embedDocuments(texts: string[]): Promise<EmbedResult> {
        const vectors: number[][] = [];
        let tokens = 0;

        for (const batch of this.toBatches(texts)) {
            const result = await this.request(batch, 'retrieval.passage', this.MAX_RETRIES);
            vectors.push(...result.vectors);
            tokens += result.tokens;
        }

        return { vectors, tokens };
    }

    async embedQuery(text: string): Promise<number[]> {
        const result = await this.request([text], 'retrieval.query', 1);
        return result.vectors[0];
    }
    
    /* ########## PRIVATES ########## */

    private toBatches(texts: string[]): string[][] {
        const batches: string[][] = [];
        let current: string[] = [];
        let size = 0;

        for (const text of texts) {
            const estimated = Math.ceil(text.length / 3);
            if (current.length > 0 && size + estimated > this.MAX_BATCH_TOKENS) {
                batches.push(current);
                current = [];
                size = 0;
            }
            current.push(text);
            size += estimated;
        }
        if (current.length > 0) batches.push(current);

        return batches;
    }

    private async request(input: string[], task: JinaTask, retries: number): Promise<EmbedResult> {
        for (let attempt = 0; ; attempt++) {
            const res = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    task,
                    dimensions: this.DIMENSIONS,
                    normalized: true,
                    input,
                }),
            });

            if (res.ok) {
                const json = (await res.json()) as JinaResponse;
                return this.validate(json, input.length);
            }

            const retryable = res.status === 429 || res.status >= 500;
            if (!retryable || attempt >= retries) {
                throw new InternalServerErrorException(`Jina ${res.status}: ${await res.text()}`);
            }

            await this.sleep(1000 * 2 ** attempt);
        }
    }


    private validate(json: JinaResponse, expected: number): EmbedResult {
        if (json.data.length !== expected) {
            throw new InternalServerErrorException(
                `Jina devolvió ${json.data.length} vectores, se esperaban ${expected}`,
            );
        }

        const vectors: number[][] = new Array(expected);
        for (const item of json.data) {
            if (item.embedding.length !== this.DIMENSIONS) {
                throw new InternalServerErrorException(
                    `Vector de ${item.embedding.length} dimensiones, se esperaban ${this.DIMENSIONS}`,
                );
            }
            vectors[item.index] = item.embedding;
        }

        return { vectors, tokens: json.usage.total_tokens };
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}