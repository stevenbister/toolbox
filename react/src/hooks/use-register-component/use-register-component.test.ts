import { act, renderHook } from '@testing-library/react-hooks';
import { useRegisterComponent } from './use-register-component';

const mockSetState = vi.fn();
const mockElement = document.createElement('div');
mockElement.id = 'test-id';

const setup = () => ({
    ...renderHook(() => useRegisterComponent(mockSetState)),
});

beforeEach(() => vi.resetAllMocks());

it('adds a new item to the state', () => {
    const { result } = setup();
    act(() => result.current.registerItem(mockElement));

    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    expect(mockSetState.mock.calls[0][0]([])).toContain(mockElement);
});

it('removes an item from the state', () => {
    const { result } = setup();

    act(() => result.current.registerItem(mockElement));
    act(() => result.current.unregisterItem(mockElement.id));

    expect(mockSetState).toHaveBeenCalledTimes(2);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    const newState = mockSetState.mock.calls[1][0]([mockElement]);
    expect(newState).not.toContain(mockElement);
});

it('does not throw an error when trying to remove a non-existent item', () => {
    const { result } = setup();

    expect(() =>
        act(() => result.current.unregisterItem('non-existent-id'))
    ).not.toThrow();
});
