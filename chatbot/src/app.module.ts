import { Module } from '@nestjs/common';
import { RagModule } from './rag/rag.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ChatModule } from './chat/chat.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaFilter } from './prisma/prisma.filter.js';
import { APP_FILTER } from '@nestjs/core';


const required = [
  'DATABASE_URL',
  'JINA_API_URL',
  'JINA_API_KEY',
  'JINA_MODEL',
  'JINA_DIMENSION',
  'JINA_MAX_BATCH_TOKENS',
  'JINA_MAX_RETRIES',
  'GROQ_API_KEY',
  'GROQ_API_URL',
  'GROQ_MODEL',
  'TEMPERATURE',
];

function validateEnv(env: Record<string, unknown>) {
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }
  return env;
}


@Module({
  imports: [
    RagModule,
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    ChatModule,
    AuthModule
  ],
  providers: [PrismaService, { provide: APP_FILTER, useClass: PrismaFilter }],
})
export class AppModule { }
