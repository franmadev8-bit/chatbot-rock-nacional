import { useEffect, useRef } from 'react';

export function useAutoScroll<T extends HTMLElement>(trigger: unknown) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (element) element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }, [trigger]);

    return ref;
}
