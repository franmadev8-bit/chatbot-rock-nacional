import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { IndexedChunk, IndexMetaData } from "../types/chunk.type.js";

@Injectable()
export class VectorStoreRepository {
    constructor(private readonly prisma: PrismaService) { }

    async replaceAll(chunks: IndexedChunk[], meta: IndexMetaData) {
        await this.prisma.$transaction([
            this.prisma.chunk.deleteMany(),
            this.prisma.chunk.createMany({
                data: chunks.map((c) => ({ ...c, embedding: this.toBytes(c.embedding) }))
            }),
            this.prisma.indexMeta.upsert({
                where: { id: 1 },
                create: { ...meta, id: 1 },
                update: { ...meta, createdAt: new Date() }
            })
        ]);
    }

    async loadAll() {
        const [meta, rows] = await this.prisma.$transaction([
            this.prisma.indexMeta.findUnique({ where: { id: 1 } }),
            this.prisma.chunk.findMany()
        ])

        return {
            meta,
            chunks: rows.map((r) => ({ ...r, embedding: this.fromBytes(r.embedding) }))
        }
    }


    /* ======================== PRIVATE ==========================================*/
    private toBytes(vector: number[]): Uint8Array<ArrayBuffer> {
        return new Uint8Array(new Float32Array(vector).buffer);
    }

    private fromBytes(bytes: Uint8Array): number[] {
        return Array.from(new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4));
    }
}