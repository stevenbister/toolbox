import { act, renderHook } from '@testing-library/react-hooks';
import type { Params } from './use-click-outside';
import { useClickOutside } from './use-click-outside';

const mockCallback = vi.fn();
const mockRef = { current: document.createElement('div') };

const setup = (params?: Partial<Params>) => {
    const { ref, callback } = params ?? {
        ref: mockRef,
        callback: mockCallback,
    };

    return {
        ...renderHook(() => useClickOutside(ref!, callback!)),
    };
};

beforeEach(() => vi.resetAllMocks());

it('calls the callback when clicking outside the ref element', () => {
    setup();

    act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('does not call the callback when clicking inside the ref element', () => {
    setup();

    act(() => {
        mockRef.current.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true })
        );
    });

    expect(mockCallback).not.toHaveBeenCalled();
});

it('removes the event listener when the component is unmounted', () => {
    const { unmount } = setup();

    unmount();

    act(() => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(mockCallback).not.toHaveBeenCalled();
});
