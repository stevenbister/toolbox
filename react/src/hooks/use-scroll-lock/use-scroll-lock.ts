import { useEffect, useRef, useState } from 'react';

export interface UseScrollLockOptions {
    target?: HTMLElement | string;
}

interface Style {
    overflow: CSSStyleDeclaration['overflow'];
}

export const useScrollLock = (options?: UseScrollLockOptions) => {
    const { target = document.body } = options ?? {};

    const [isLocked, setIsLocked] = useState<boolean>(false);
    const targetRef = useRef<HTMLElement | null>(null);
    const originalStyle = useRef<Style | null>(null);

    const lock = () => {
        if (!targetRef.current) return;

        const { overflow } = targetRef.current.style;

        originalStyle.current = { overflow };

        targetRef.current.style.overflow = 'hidden';

        setIsLocked(true);
    };

    const unlock = () => {
        if (!targetRef.current || !originalStyle.current) return;

        targetRef.current.style.overflow = originalStyle.current.overflow;

        setIsLocked(false);
    };

    useEffect(() => {
        if (typeof window === 'undefined' || targetRef.current) return;

        targetRef.current =
            target instanceof HTMLElement
                ? target
                : document.querySelector(target);

        return () => unlock();
    }, [target]);

    return {
        isLocked,
        lock,
        unlock,
    };
};
