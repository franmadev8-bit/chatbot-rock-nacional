import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { IndexedChunk } from "../types/chunk.type.js";
import { EmbeddingService } from "./embedding.service.js";
import { VectorStoreRepository } from "../repositories/vector.store.repository.js";

@Injectable()
export class RetrievalService implements OnModuleInit {
    private chunks: IndexedChunk[] = [];
    private readonly logger = new Logger(RetrievalService.name);
    private readonly stopwords = new Set([
        'que', 'quien', 'quienes', 'cual', 'cuales', 'como', 'cuando', 'donde', 'por', 'para',
        'los', 'las', 'una', 'uno', 'del', 'con', 'sus', 'fue', 'era', 'son', 'hay', 'banda',
    ]);
    private docFreq = new Map<string, number>();


    constructor(
        private readonly store: VectorStoreRepository,
        private readonly embedding: EmbeddingService,
    ) { }

    async onModuleInit() {
        await this.reload();
    }

    async reload() {
        const { meta, chunks } = await this.store.loadAll();

        if (!meta) {
            this.logger.warn('No hay índice. Llamá al endpoint de reindexado.');
        } else if (meta.model !== this.embedding.modelName || meta.dimensions !== this.embedding.dimensions) {
            this.logger.warn(
                `El índice se generó con ${meta.model} (${meta.dimensions}) y la configuración actual es ` +
                `${this.embedding.modelName} (${this.embedding.dimensions}). Hay que reindexar.`,
            );
        }

        this.chunks = chunks;
        this.buildDocFreq();
        this.logger.log(`Índice cargado: ${chunks.length} chunks`);
    }


    async search(question: string, topK = 8) {
        const query = await this.embedding.embedQuery(question);
        const terms = this.keywords(question);

        const weight = (t: { term: string; properNoun: boolean }) =>
            this.idf(t.term) * (t.properNoun ? 3 : 1);

        const totalWeight = terms.reduce((sum, t) => sum + weight(t), 0);
        const unknownProperNoun = terms.some((t) => t.properNoun && this.idf(t.term) === 0);

        return this.chunks
            .map((chunk) => {
                const haystack = this.normalize(`${chunk.topic} ${chunk.section} ${chunk.text}`);
                const matchedWeight = terms
                    .filter((t) => haystack.includes(t.term))
                    .reduce((sum, t) => sum + weight(t), 0);
                const bonus = !unknownProperNoun && totalWeight ? (matchedWeight / totalWeight) * 0.2 : 0;
                
                return { chunk, score: this.dot(query, chunk.embedding) + bonus };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }




    /* ======================================= PRIVATE ======================================= */

    private buildDocFreq() {
        this.docFreq.clear();
        for (const chunk of this.chunks) {
            const words = new Set(this.normalize(`${chunk.topic} ${chunk.section} ${chunk.text}`).split(/[^a-z0-9]+/));
            for (const w of words) this.docFreq.set(w, (this.docFreq.get(w) ?? 0) + 1);
        }
    }

    private idf(term: string) {
        const df = this.docFreq.get(term) ?? 0;
        return df === 0 ? 0 : Math.log(this.chunks.length / df);
    }

    private dot(a: number[], b: number[]) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
        return sum;
    }

    private normalize(text: string) {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    private keywords(question: string) {
        const words = question.split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/).filter(Boolean);
        return words
            .map((word, i) => ({
                term: this.normalize(word),
                properNoun: i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(word),
            }))
            .filter(({ term }) => term.length > 2 && !this.stopwords.has(term));
    }
}