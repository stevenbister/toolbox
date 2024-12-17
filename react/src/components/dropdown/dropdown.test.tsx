import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DropdownItemProps, DropdownProps } from './dropdown';
import { Dropdown } from './dropdown';

vi.mock(import('react'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useId: () => ':mocked-id:',
    };
});
const mockButtonId = ':mocked-id:trigger';
const mockMenuId = ':mocked-id:menu';

const arrows = ['ArrowDown', 'ArrowUp'] as const;

const setup = (
    props?: Partial<DropdownProps>,
    itemProps?: Partial<DropdownItemProps>
) => ({
    user: userEvent.setup(),
    ...render(
        <Dropdown {...props}>
            <Dropdown.Trigger>Trigger</Dropdown.Trigger>

            <Dropdown.Menu>
                <Dropdown.Item id="1" {...itemProps}>
                    Item 1
                </Dropdown.Item>
                <Dropdown.Item id="2" {...itemProps}>
                    Item 2
                </Dropdown.Item>
                <Dropdown.Item id="3" {...itemProps}>
                    Item 3
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    ),
});

beforeEach(() => vi.resetAllMocks());

it('throws error if subcomponents are used outside of the provider', () => {
    expect(() =>
        render(<Dropdown.Trigger>Trigger</Dropdown.Trigger>)
    ).toThrowError('useDropdownContext was used outside of its Provider');
});

it('renders the components with the correct roles', async () => {
    setup({ isOpen: true });

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
});

it.each(['open', 'closed'])(
    'renders with the correct aria attributes and ids when %s',
    (state) => {
        setup({ isOpen: state === 'open' });

        const button = screen.getByRole('button');

        expect(button).toHaveAttribute('id', mockButtonId);
        expect(button).toHaveAttribute(
            'aria-expanded',
            state === 'open' ? 'true' : 'false'
        );
        expect(button).toHaveAttribute('aria-haspopup', 'true');

        if (state === 'open') {
            const menu = screen.getByRole('menu');

            expect(button).toHaveAttribute('aria-controls', mockMenuId);
            expect(menu).toHaveAttribute('id', mockMenuId);
            expect(menu).toHaveAttribute('aria-labelledBy', mockButtonId);
        }
    }
);

it('labels the dropdown menu correctly', () => {
    setup({ isOpen: true });

    expect(screen.getByRole('menu')).toHaveAccessibleName('Trigger');
});

it.each(['Enter', 'Space'])(
    "does not open the menu with %s if the trigger isn't focused",
    async (key) => {
        const { user } = setup();

        const button = screen.getByRole('button');

        await user.keyboard(`[${key}]`);

        expect(button).toHaveAttribute('aria-expanded', 'false');
    }
);

it.each([
    {
        action: 'button is clicked',
        key: 'click',
    },
    {
        action: 'enter button is pressed',
        key: 'Enter',
    },
    {
        action: 'space bar is pressed',
        key: 'Space',
    },
])(
    'sets the correct aria attributes and focuses the first item when the $action',
    async ({ key }) => {
        const { user } = setup();

        const button = screen.getByRole('button');

        switch (key) {
            case 'click':
                await user.click(button);
                break;
            case 'Enter':
            case 'Space':
                button.focus();
                await user.keyboard(`[${key}]`);
                break;
        }

        const firstItem = screen.getByRole('menuitem', {
            name: 'Item 1',
        });

        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(firstItem).toHaveFocus();
        expect(firstItem).toHaveAttribute('tabindex', '0');

        expect(
            screen.getByRole('menuitem', { name: 'Item 2' })
        ).toHaveAttribute('tabindex', '-1');
        expect(
            screen.getByRole('menuitem', { name: 'Item 3' })
        ).toHaveAttribute('tabindex', '-1');
    }
);

it.each(['open', 'closed'])(
    'calls onOpenChange when the menu is %s',
    async (state) => {
        const onOpenChange = vi.fn();
        const { user } = setup({ isOpen: state === 'open', onOpenChange });

        await user.click(screen.getByRole('button'));

        expect(onOpenChange).toHaveBeenCalledTimes(1);
    }
);

it.each(arrows)('opens the dropdown with the %s key', async (direction) => {
    const { user } = setup();

    const button = screen.getByRole('button');
    button.focus();

    await user.keyboard(`[${direction}]`);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(
        screen.getAllByRole('menuitem')[direction === 'ArrowDown' ? 0 : 2]
    ).toHaveFocus();
});

it.each(arrows)('navigates the items with the %s key', async (direction) => {
    const { user } = setup({ isOpen: true });

    await user.keyboard(`[${direction}]`);

    const menuItems = screen.getAllByRole('menuitem');

    expect(menuItems[direction === 'ArrowDown' ? 1 : 2]).toHaveFocus();

    await user.keyboard(`[${direction}]`);

    expect(menuItems[direction === 'ArrowDown' ? 2 : 1]).toHaveFocus();

    await user.keyboard(`[${direction}]`);

    expect(menuItems[0]).toHaveFocus();
});

it('closes the dropdown with the escape key', async () => {
    const { user } = setup({ isOpen: true });

    await user.keyboard('[Escape]');

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
});

it.each([
    {
        action: 'item is clicked',
        key: 'click',
    },
    {
        action: 'enter button is pressed',
        key: 'Enter',
    },
    {
        action: 'space bar is pressed',
        key: 'Space',
    },
])('closes the dropdown when $action', async ({ key }) => {
    const { user } = setup({ isOpen: true });

    switch (key) {
        case 'click':
            await user.click(
                screen.getByRole('menuitem', {
                    name: 'Item 1',
                })
            );
            break;
        case 'Enter':
        case 'Space':
            await user.keyboard(`[${key}]`);
            break;
    }

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
});

it.each([
    {
        action: 'item is clicked',
        key: 'click',
    },
    {
        action: 'enter button is pressed',
        key: 'Enter',
    },
    {
        action: 'space bar is pressed',
        key: 'Space',
    },
])('is calls onSelect when the $action', async ({ key }) => {
    const onSelect = vi.fn();
    const { user } = setup({ isOpen: true }, { onSelect });

    switch (key) {
        case 'click':
            await user.click(
                screen.getByRole('menuitem', {
                    name: 'Item 1',
                })
            );
            break;
        case 'Enter':
        case 'Space':
            await user.keyboard(`[${key}]`);
            break;
    }

    expect(onSelect).toHaveBeenCalledTimes(1);
});
