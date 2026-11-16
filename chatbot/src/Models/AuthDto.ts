import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AuthDto {

    @ApiProperty({ example: 'francisco@mail.com', format: 'email' })
    @IsEmail()
    email: string;


    @ApiProperty({ example: 'MiClave123' })
    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(init: Partial<AuthDto>) {
        Object.assign(this, init);
    }
}