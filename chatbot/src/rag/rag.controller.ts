import { Controller, Post, UseGuards } from '@nestjs/common';
import { RagService } from './rag.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('rag')
@UseGuards(AuthGuard)
export class RagController {

    constructor(private readonly rag: RagService) { }


    @Post('index')
    async indexData() {
        return this.rag.reindex();
    }
}