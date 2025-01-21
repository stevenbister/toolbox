import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch, type SwitchProps } from './switch';

const mockLabel = 'switch';
const mockOnCheckedChange = vi.fn();

const setup = (props?: Partial<SwitchProps>) => ({
    user: userEvent.setup(),
    ...render(<Switch {...props} />),
});

beforeEach(() => vi.resetAllMocks());

it('renders the component with the correct roles', () => {
    setup({
        children: mockLabel,
    });

    expect(screen.getByRole('switch')).toHaveAccessibleName(mockLabel);
});

it('toggles the switch when clicked', async () => {
    const { user } = setup();
    const toggle = screen.getByRole('switch');

    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAttribute('data-checked', 'false');

    await user.click(toggle);

    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute('data-checked', 'true');
});

it('calls onCheckedChange when the switch is toggled', async () => {
    const { user } = setup({
        onCheckedChange: mockOnCheckedChange,
    });

    await user.click(screen.getByRole('switch'));

    expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
});
