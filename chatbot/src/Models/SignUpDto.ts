import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDto {

    @IsEmail({}, { message: 'Email Invalido.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    email: string;

    @IsNotEmpty({ message: 'Debe introducir una contraseña.' })
    password: string;

    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name:string;

    constructor(init: Partial<SignUpDto>) {
        Object.assign(this, init);
    }
}