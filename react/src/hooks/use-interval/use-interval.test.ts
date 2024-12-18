import { act, renderHook } from '@testing-library/react-hooks';
import { useInterval } from './use-interval';

const mockCallback = vi.fn();

const defaultTime = 1000;

interface Params {
    callback?: () => void;
    delay?: number | null;
}

const setup = ({
    callback: cb = mockCallback,
    delay: d = defaultTime,
}: Params) => ({
    ...renderHook<Params, unknown>(
        ({ callback, delay }) =>
            useInterval(callback ?? cb, delay !== undefined ? delay : d),
        {
            initialProps: {
                callback: cb,
                delay: d,
            },
        }
    ),
});

beforeAll(() => vi.useFakeTimers());
afterAll(() => vi.useRealTimers());

beforeEach(() => vi.resetAllMocks());

it('calls the callback function repeatedly with the specified delay', async () => {
    setup({});

    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('stops the interval when the delay is set to null', async () => {
    setup({ delay: null });

    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });

    expect(mockCallback).not.toHaveBeenCalled();
});

it('updates the interval delay when it changes', () => {
    const { rerender } = setup({});

    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    rerender({ delay: defaultTime * 0.5 });
    act(() => {
        vi.advanceTimersByTime(defaultTime * 1.5);
    });
    expect(mockCallback).toHaveBeenCalledTimes(4); // 3 additional calls for 500ms intervals
});

it('stops the interval when unmounted', () => {
    const { unmount } = setup({});

    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
        vi.advanceTimersByTime(defaultTime * 2);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('uses the latest callback function', () => {
    const updatedCallback = vi.fn();
    const { rerender } = setup({});

    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).not.toHaveBeenCalled();

    rerender({ callback: updatedCallback });
    act(() => {
        vi.advanceTimersByTime(defaultTime);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).toHaveBeenCalledTimes(1);
});
