import { createContext } from 'react';
import type { SignInRequest, SignUpRequest, User } from '../../models/auth';

export interface AuthContextValue {
    user: User | null;
    checking: boolean;
    signIn: (body: SignInRequest) => Promise<void>;
    signUp: (body: SignUpRequest) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
