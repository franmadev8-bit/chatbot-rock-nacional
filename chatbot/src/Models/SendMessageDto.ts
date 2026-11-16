import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMessageDto {

    @ApiProperty({ example: '¿Qué discos sacó Sumo?', maxLength: 1000 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    question: string;

    @ApiPropertyOptional({ format: 'uuid', description: 'Si no se envía, se crea un chat nuevo' })
    @IsOptional()
    @IsUUID('4')
    chatId: string | undefined;

    constructor(init: Partial<SendMessageDto>) {
        Object.assign(this, init);
    }
}