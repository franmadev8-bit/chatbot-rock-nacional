import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { RagModule } from '../rag/rag.module.js';
import { ChatTitleService } from '../rag/chat.title.service.js';
import { ChatMessageRepository } from '../repositories/chat.message.repository.js';
import { MessageRepository } from '../repositories/message.repository.js';
import { ExpiredTokenRepository } from '../repositories/expired.token.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatTitleService, ChatMessageRepository, MessageRepository, ExpiredTokenRepository],
  imports: [RagModule, AuthModule]
})
export class ChatModule {}
