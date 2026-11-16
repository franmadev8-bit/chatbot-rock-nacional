import { promisify } from "util";
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'


export class PasswordHasherService {
    private readonly MAX_KEY_LENGTH = 64;
    private readonly scriptAsync = promisify(scrypt);

    async hash(password: string) {
        const salt = randomBytes(16).toString('hex');
        const key = (await this.scriptAsync(password, salt, this.MAX_KEY_LENGTH)) as Buffer;
        return `${salt}:${key.toString('hex')}`;
    }


    async compare(password: string, stored: string) {
        const [salt, keyHex] = stored.split(':');
        if (!salt || !keyHex) return false;

        const key = (await this.scriptAsync(password, salt, this.MAX_KEY_LENGTH)) as Buffer;
        const storedKey = Buffer.from(keyHex, 'hex');

        return storedKey.length === key.length && timingSafeEqual(key, storedKey);
    }
}