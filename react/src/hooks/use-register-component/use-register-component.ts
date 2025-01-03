import { useCallback, type SetStateAction } from 'react';

export const useRegisterComponent = <T extends HTMLElement>(
    setStateAction: (value: SetStateAction<T[]>) => void
) => {
    const registerItem = useCallback((item: T) => {
        setStateAction((prev) =>
            prev.includes(item) ? prev : [...prev, item]
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const unregisterItem = useCallback((id: string) => {
        setStateAction((prev) => prev.filter((item) => item.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        registerItem,
        unregisterItem,
    };
};
