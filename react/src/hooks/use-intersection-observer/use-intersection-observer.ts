import { useEffect, useState, type RefObject } from 'react';

export const useIntersectionObserver = <T extends RefObject<HTMLElement>>(
    ref: T,
    options: IntersectionObserverInit
) => {
    const [intersectionObserverEntry, setIntersectionObserverEntry] =
        useState<IntersectionObserverEntry | null>(null);

    useEffect(() => {
        if (ref.current && typeof IntersectionObserver === 'function') {
            const observer = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {
                    entries.forEach((entry) => {
                        setIntersectionObserverEntry(entry);
                    });
                },
                options
            );

            observer.observe(ref.current);

            return () => {
                setIntersectionObserverEntry(null);
                observer.disconnect();
            };
        }

        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current, options.threshold, options.root, options.rootMargin]);

    return {
        intersectionObserverEntry,
    };
};
