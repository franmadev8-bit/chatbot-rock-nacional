import { http } from '../api/http';
import type { SignInRequest, SignUpRequest, User } from '../models/auth';

export const authService = {
    async me(): Promise<User> {
        const { data } = await http.get<User>('/auth/me');
        return data;
    },

    async signIn(body: SignInRequest): Promise<void> {
        await http.post('/auth/sign-in', body);
    },

    async signUp(body: SignUpRequest): Promise<void> {
        await http.post('/auth/sign-up', body);
    },

    async signOut(): Promise<void> {
        await http.post('/auth/sign-out');
    },
};
