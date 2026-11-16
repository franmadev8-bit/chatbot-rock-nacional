import { applyDecorators, HttpCode } from '@nestjs/common';
import {
    ApiConflictResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiAuthController = () => ApiTags('auth');

export const ApiSignUp = () =>
    applyDecorators(
        HttpCode(201),
        ApiOperation({ summary: 'Crear una cuenta' }),
        ApiCreatedResponse({ description: 'Cuenta creada' }),
        ApiConflictResponse({ description: 'El email ya está registrado' }),
    );

export const ApiSignIn = () =>
    applyDecorators(
        ApiOperation({ summary: 'Iniciar sesión' }),
        ApiOkResponse({ description: 'Deja la cookie access_token' }),
        ApiUnauthorizedResponse({ description: 'Credenciales inválidas' }),
    );

export const ApiSignOut = () =>
    applyDecorators(
        HttpCode(200),
        ApiCookieAuth('access_token'),
        ApiOperation({ summary: 'Cerrar sesión y revocar el token' }),
        ApiOkResponse({ description: 'Sesión cerrada' }),
        ApiUnauthorizedResponse({ description: 'No autenticado' }),
    );

export const ApiMe = () =>
    applyDecorators(
        ApiCookieAuth('access_token'),
        ApiOperation({ summary: 'Usuario logueado' }),
        ApiOkResponse({ description: 'Devuelve { id, name, email }' }),
        ApiUnauthorizedResponse({ description: 'No autenticado' }),
    );