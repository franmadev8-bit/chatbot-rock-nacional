import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { http } from '../../api/http';
import type { SignInRequest, SignUpRequest, User } from '../../models/auth';
import { authService } from '../../services/authService';
import { isUnauthorized } from '../../utils/errors';
import { AuthContext, type AuthContextValue } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            setUser(await authService.me());
        } catch {
            setUser(null);
        } finally {
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        authService.me()
            .then((me) => active && setUser(me))
            .catch(() => active && setUser(null))
            .finally(() => active && setChecking(false));
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const interceptor = http.interceptors.response.use(undefined, (error: unknown) => {
            if (isUnauthorized(error)) setUser(null);
            return Promise.reject(error);
        });
        return () => http.interceptors.response.eject(interceptor);
    }, []);

    const signIn = useCallback(async (body: SignInRequest) => {
        await authService.signIn(body);
        await loadUser();
    }, [loadUser]);

    const signUp = useCallback(async (body: SignUpRequest) => {
        await authService.signUp(body);
        await signIn({ email: body.email, password: body.password });
    }, [signIn]);

    const signOut = useCallback(async () => {
        try {
            await authService.signOut();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, checking, signIn, signUp, signOut }),
        [user, checking, signIn, signUp, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
