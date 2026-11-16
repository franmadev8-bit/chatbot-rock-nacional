import { useAuth } from '../contexts/auth/useAuth';

export function useHeaderViewModel() {
    const { user, signOut } = useAuth();

    const initial = user?.name.trim().charAt(0).toUpperCase() || '?';

    return { userName: user?.name ?? '', initial, signOut };
}
