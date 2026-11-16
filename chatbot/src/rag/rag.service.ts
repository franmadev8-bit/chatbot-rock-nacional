import { ConflictException, Injectable } from '@nestjs/common';
import { ChunkService } from './chunk.service.js';
import { EmbeddingService } from './embedding.service.js';
import { VectorStoreRepository } from '../repositories/vector.store.repository.js';
import { RetrievalService } from './retrieval.service.js';
import { LlmService } from './llm.service.js';
import { PromptService } from './prompt.service.js';
import { QueryRewriteService } from './query.rewrite.service.js';
import { HistoryMessage } from '../types/rag.types.js';

@Injectable()
export class RagService {
    private running: boolean = false;

    constructor(
        private readonly chunk: ChunkService,
        private readonly embedding: EmbeddingService,
        private readonly store: VectorStoreRepository,
        private readonly retrieval: RetrievalService,
        private readonly llm: LlmService,
        private readonly prompt: PromptService,
        private readonly rewrite: QueryRewriteService,
    ) { }

    async reindex() {
        if (this.running) throw new ConflictException('Indexado en proceso...');

        this.running = true;
        const start = Date.now();

        try {
            const chunks = await this.chunk.readChunks();
            const inputs = chunks.map((c) => `${c.topic} - ${c.section}: ${c.text}`);

            const { vectors, tokens } = await this.embedding.embedDocuments(inputs);
            const indexed = chunks.map((c, i) => ({ ...c, embedding: vectors[i] }))

            await this.store.replaceAll(indexed, {
                model: this.embedding.modelName,
                dimensions: this.embedding.dimensions,
                totalChunks: indexed.length
            })

            await this.retrieval.reload();

            return {
                chunks: indexed.length,
                tokens,
                dimensions: this.embedding.dimensions,
                duretionMs: Date.now() - start
            }

        } finally {
            this.running = false;
        }
    }

    async ask(question: string, history: HistoryMessage[] = []) {
        const searchQuery = await this.rewrite.rewrite(question, history);

        const MIN_SCORE = 0.5;

        const results = await this.retrieval.search(searchQuery);
        const best = results[0]?.score ?? 0;

        if (best < MIN_SCORE) {
            return { answer: 'No tengo información sobre eso en mi base de conocimiento.', sources: [] };
        }

        const relevant = results.filter((r) => r.score >= MIN_SCORE);

        if (relevant.length === 0) {
            return {
                answer: 'No tengo información sobre eso en mi base de conocimiento.',
                sources: [],
            };
        }

        const context = relevant
            .map(({ chunk }, i) => `[${i + 1}] ${chunk.topic} — ${chunk.section}\n${chunk.text}`)
            .join('\n\n');

        const answer = await this.llm.complete([
            { role: 'system', content: this.prompt.ragSystem },
            ...history,
            { role: 'user', content: `CONTEXTO:\n${context}\n\nPREGUNTA: ${searchQuery}` }
        ]);

        if (answer.trim() === 'No tengo esa información.') {
            return { answer, sources: [] };
        }

        return {
            answer,
            sources: relevant.map(({ chunk, score }) => ({
                id: chunk.id,
                topic: chunk.topic,
                section: chunk.section,
                score: Number(score.toFixed(3)),
            })),
        };
    }



}
