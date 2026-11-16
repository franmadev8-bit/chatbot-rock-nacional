import { Controller, Post, UseGuards } from '@nestjs/common';
import { RagService } from './rag.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { ApiRagController, ApiReindex } from './rag.docs.js';

@Controller('rag')
@ApiRagController()
@UseGuards(AuthGuard)
export class RagController {

    constructor(private readonly rag: RagService) { }


    @Post('index')
    @ApiReindex()
    async indexData() {
        return this.rag.reindex();
    }
}