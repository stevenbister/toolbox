import { useEffect, type RefObject } from 'react';

const events = ['mousedown', 'touchstart'];

export type Params = {
    ref: RefObject<HTMLElement | null>;
    callback: (e: Event) => void;
};

export const useClickOutside = (
    ref: Params['ref'],
    callback: Params['callback']
) => {
    useEffect(() => {
        const handler = (e: Event) => {
            const target = e.target as HTMLElement;
            const node = ref?.current;

            if (node && !node.contains(target)) {
                callback(e);
            }
        };

        for (const event of events) {
            document.addEventListener(event, handler);
        }

        return () => {
            for (const event of events) {
                document.removeEventListener(event, handler);
            }
        };
    }, [callback, ref]);
};
