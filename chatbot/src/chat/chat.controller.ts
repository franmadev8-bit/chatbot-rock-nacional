import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { CurrentUser } from '../middlewares/curremt.user.middleware.js';
import { SendMessageDto } from '../Models/SendMessageDto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { ApiAsk, ApiChatController, ApiChatMessages, ApiListChats } from './chat.docs.js';

@Controller('chat')
@ApiChatController()
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }


  @Post('ask')
  @ApiAsk()
  ask(@CurrentUser('sub') userId: string, @Body() body: SendMessageDto) {
    return this.chatService.send(userId, body.question, body.chatId);
  }

  @Get()
  @ApiListChats()
  list(@CurrentUser('sub') userId: string) {
    return this.chatService.list(userId);
  }

  @Get(':id/messages')
  @ApiChatMessages()
  messages(@CurrentUser('sub') userId: string, @Param('id', new ParseUUIDPipe({ version: '4' })) chatId: string) {
    return this.chatService.getMessages(userId, chatId);
  }
}
