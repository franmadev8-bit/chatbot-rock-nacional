import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const ChatNotFound = () => ApiNotFoundResponse({ description: 'El chat no existe o no es del usuario' });

export const ApiChatController = () =>
    applyDecorators(
        ApiTags('chat'),
        ApiCookieAuth('access_token'),
        ApiUnauthorizedResponse({ description: 'No autenticado' }),
    );

export const ApiListChats = () =>
    applyDecorators(
        ApiOperation({ summary: 'Listar los chats del usuario' }),
        ApiOkResponse({ description: 'Lista de { id, title, createdAt }, del más nuevo al más viejo' }),
    );

export const ApiChatMessages = () =>
    applyDecorators(
        ApiOperation({ summary: 'Mensajes de un chat' }),
        ApiOkResponse({ description: 'Lista de { id, role, content, createdAt }, en orden cronológico' }),
        ChatNotFound(),
    );

export const ApiAsk = () =>
    applyDecorators(
        ApiOperation({ summary: 'Enviar una pregunta' }),
        ApiCreatedResponse({ description: 'Devuelve { chatId, title, answer, sources }' }),
        ApiBadRequestResponse({ description: 'La pregunta está vacía o es demasiado larga' }),
        ChatNotFound(),
    );