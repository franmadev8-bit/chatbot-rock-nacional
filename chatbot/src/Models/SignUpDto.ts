import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';


export class SignUpDto {

    @ApiProperty({ example: 'francisco@mail.com', format: 'email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'MiClave123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'Francisco', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    constructor(init: Partial<SignUpDto>) {
        Object.assign(this, init);
    }
}