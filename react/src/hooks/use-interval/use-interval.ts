import { useEffect, useRef } from 'react';

/**
 * Calls a function repeatedly with a fixed time delay between each call.
 *
 * @param callback - The function to call.
 * @param delay - The time, in milliseconds, between each call to the function. If `null`, the interval is stopped.
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void | undefined>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (typeof savedCallback.current === 'function') {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
