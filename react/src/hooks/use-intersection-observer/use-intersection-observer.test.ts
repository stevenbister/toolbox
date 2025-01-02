import { act, renderHook } from '@testing-library/react-hooks';
import type { RefObject } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

const mockTargetElement = document.createElement('div');
const mockIntersectionObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
    callback: vi.fn(),
};
const mockIntersectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
};
const mockEntry = {
    isIntersecting: true,
    intersectionRatio: 0.7,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: {} as DOMRectReadOnly | null,
    target: mockTargetElement,
    time: 123.45,
};
const mockRef = { current: mockTargetElement };

interface SetupProps {
    ref?: RefObject<HTMLElement>;
    options?: IntersectionObserverInit;
}

const setup = (props?: SetupProps) => {
    const { ref = mockRef, options = mockIntersectionObserverOptions } =
        props ?? {};

    window.IntersectionObserver = vi.fn((callback) => {
        mockIntersectionObserver.callback = callback;
        return {
            observe: mockIntersectionObserver.observe,
            disconnect: mockIntersectionObserver.disconnect,
            unobserve: mockIntersectionObserver.unobserve,
        };
    }) as unknown as typeof IntersectionObserver;

    return {
        ...renderHook(() => useIntersectionObserver(ref, options)),
    };
};

beforeEach(() => vi.resetAllMocks());

it('observes the element and update entry when intersecting', () => {
    const { result } = setup();

    expect(mockIntersectionObserver.observe).toHaveBeenNthCalledWith(
        1,
        mockTargetElement
    );

    act(() => {
        mockIntersectionObserver.callback?.([mockEntry]);
    });

    expect(result.current.intersectionObserverEntry?.isIntersecting).toBe(true);
    expect(result.current.intersectionObserverEntry?.intersectionRatio).toBe(
        0.7
    );
});

it('disconnects the observer on unmounted', () => {
    const { unmount } = setup();

    unmount();

    expect(mockIntersectionObserver.disconnect).toHaveBeenCalledOnce();
});
