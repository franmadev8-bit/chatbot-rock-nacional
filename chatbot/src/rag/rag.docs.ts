import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

export const ApiRagController = () => ApiTags('rag');

export const ApiReindex = () =>
    applyDecorators(
        ApiOperation({ summary: 'Reindexar todo data_source/' }),
        ApiCreatedResponse({ description: 'Índice regenerado' }),
        ApiConflictResponse({ description: 'Ya hay un indexado en curso' }),
    );