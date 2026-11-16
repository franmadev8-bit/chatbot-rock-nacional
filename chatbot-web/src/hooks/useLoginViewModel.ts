import { useState } from 'react';
import { useAuth } from '../contexts/auth/useAuth';
import { getErrorMessage } from '../utils/errors';

export type AuthMode = 'sign-in' | 'sign-up';

export interface AuthFormValues {
    name?: string;
    email: string;
    password: string;
}

export function useLoginViewModel() {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<AuthMode>('sign-in');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changeMode = (next: AuthMode) => {
        setMode(next);
        setError(null);
    };

    const submit = async (values: AuthFormValues) => {
        setSubmitting(true);
        setError(null);
        try {
            const email = values.email.trim().toLowerCase();
            if (mode === 'sign-up') {
                await signUp({ name: values.name?.trim() ?? '', email, password: values.password });
            } else {
                await signIn({ email, password: values.password });
            }
        } catch (err) {
            setError(getErrorMessage(err, 'No pudimos iniciar sesión.'));
        } finally {
            setSubmitting(false);
        }
    };

    return { mode, changeMode, submitting, error, submit };
}
