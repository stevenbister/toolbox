import { act, renderHook } from '@testing-library/react-hooks';
import { useScrollLock, type UseScrollLockOptions } from './use-scroll-lock';

const mockTargetElement = document.createElement('div');
const mockTestId = 'test-target';

const setup = (options?: Partial<UseScrollLockOptions>) => {
    const { target } = options ?? {};

    return {
        ...renderHook(() => useScrollLock({ target })),
    };
};

beforeEach(() => {
    document.body.appendChild(mockTargetElement);

    vi.resetAllMocks();
});

afterEach(() => document.body.removeChild(mockTargetElement));

it('initializes with isLocked as false', () => {
    const { result } = setup();
    const { isLocked } = result.current;

    expect(isLocked).toBe(false);
});

it.each([
    {
        condition: 'document body',
        target: document.body,
    },
    {
        condition: 'target element',
        target: mockTargetElement,
    },
])('locks $condition when lock is called', ({ target }) => {
    const { result } = setup({
        target: target ?? null,
    });

    act(() => result.current.lock());

    expect(target.style.overflow).toBe('hidden');
    expect(result.current.isLocked).toBe(true);
});

it('unlocks scroll when unlock is called', () => {
    const { result } = setup();

    act(() => result.current.lock());

    act(() => result.current.unlock());

    expect(document.body.style.overflow).toBe('');
    expect(result.current.isLocked).toBe(false);
});

it('handles target as a query selector string', () => {
    mockTargetElement.id = mockTestId;

    const { result } = setup({ target: `#${mockTestId}` });

    act(() => result.current.lock());

    expect(mockTargetElement.style.overflow).toBe('hidden');
    expect(result.current.isLocked).toBe(true);

    act(() => result.current.unlock());

    expect(mockTargetElement.style.overflow).toBe('');
});

it('cleans up and unlock on unmount', () => {
    const { result, unmount } = setup();

    act(() => result.current.lock());

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
});
