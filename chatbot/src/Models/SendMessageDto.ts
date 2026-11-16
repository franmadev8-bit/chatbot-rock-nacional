import { IsOptional, IsString } from "class-validator";

export class SendMessageDto {

    @IsString()
    question: string;

    @IsOptional()
    chatId: string | undefined;

    constructor(init: Partial<SendMessageDto>) {
        Object.assign(this, init);
    }
}