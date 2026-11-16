import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Algo salió mal. Probá de nuevo.'): string {
    if (isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) return message[0] ?? fallback;
        if (message) return message;
        if (!error.response) return 'No hay conexión con el servidor.';
    }
    return fallback;
}

export function isUnauthorized(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 401;
}
