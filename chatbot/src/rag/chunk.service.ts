import { Injectable } from "@nestjs/common";
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { Chunk } from "../types/chunk.type.js";


@Injectable()
export class ChunkService {
    private readonly path: string = join(process.cwd(), 'data_source');
    private readonly MAX_CHARS: number = 1500;

    async readChunks(): Promise<Chunk[]> {
        const fileNames = await readdir(this.path);
        const mds = fileNames.filter((n) => n.endsWith('.md') && !n.includes('FUENTES'));

        const chunks: Chunk[] = [];

        for (const file of mds) {
            const content = await readFile(join(this.path, file), 'utf-8');
            chunks.push(...this.chunkFile(file, content));
        }

        return chunks;
    }

    private chunkFile(source: string, content: string): Chunk[] {
        const lines = content.split(/\r?\n/);
        const topic = lines.find((l) => l.startsWith('# '))?.slice(2).trim() ?? source;

        const chunks: Chunk[] = [];
        let section = '';
        let body: string[] = [];

        const flush = () => {
            if (!section) return;
            this.splitBySize(body).forEach((text, order) => {
                chunks.push({
                    id: `${this.slug(topic)}-${this.slug(section)}-${order}`,
                    topic,
                    section,
                    text,
                    source,
                    order,
                });
            });
        };

        for (const line of lines) {
            if (line.startsWith('## ')) {
                flush();
                section = line.slice(3).trim();
                body = [];
            } else if (section) {
                body.push(line);
            }
        }
        flush();

        return chunks;
    }


    private splitBySize(lines: string[]): string[] {
        const parts: string[] = [];
        let current: string[] = [];
        let size = 0;

        for (const line of lines) {
            if (size + line.length > this.MAX_CHARS && current.length > 0) {
                parts.push(current.join('\n').trim());
                current = [];
                size = 0;
            }
            current.push(line);
            size += line.length + 1;
        }

        const last = current.join('\n').trim();
        if (last) parts.push(last);

        return parts;
    }

    private slug(value: string): string {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}