import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {

    @IsEmail({}, { message: 'Email Invalido.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    email: string;

    @IsNotEmpty({ message: 'Contraseña obligatoria' })
    password: string;

    constructor(init: Partial<AuthDto>) {
        Object.assign(this, init);
    }
}