import { Module } from '@nestjs/common';
import { ChunkService } from './chunk.service.js';
import { RagController } from './rag.controller.js';
import { EmbeddingService } from './embedding.service.js';
import { RagService } from './rag.service.js';
import { VectorStoreRepository } from '../repositories/vector.store.repository.js';
import { RetrievalService } from './retrieval.service.js';
import { LlmService } from './llm.service.js';
import { PromptService } from './prompt.service.js';
import { ChatTitleService } from './chat.title.service.js';
import { ChatMessageRepository } from '../repositories/chat.message.repository.js';
import { ExpiredTokenRepository } from '../repositories/expired.token.repository.js';
import { JwtModule } from '@nestjs/jwt';
import { QueryRewriteService } from './query.rewrite.service.js';

@Module({
    providers: [
        ChunkService, 
        RetrievalService, 
        EmbeddingService, 
        ChatMessageRepository, 
        ExpiredTokenRepository, 
        LlmService, 
        PromptService, 
        ChatTitleService, 
        QueryRewriteService,
        RagService, 
        VectorStoreRepository],
    controllers: [RagController],
    exports: [RagService, LlmService, PromptService],
    imports: [JwtModule]
})
export class RagModule {

}
