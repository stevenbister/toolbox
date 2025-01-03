import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, type TabsProps } from './tabs';

vi.mock(import('react'), async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useId: () => ':mocked-id:',
    };
});
const mockTriggerId = ':mocked-id:-trigger';
const mockPanelId = ':mocked-id:-panel';

const setup = (props?: Partial<TabsProps>) => ({
    user: userEvent.setup(),
    ...render(
        <Tabs {...props}>
            <Tabs.List>
                <Tabs.Trigger>Tab 1</Tabs.Trigger>
                <Tabs.Trigger>Tab 2</Tabs.Trigger>
                <Tabs.Trigger>Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel>Panel 1</Tabs.Panel>
            <Tabs.Panel>Panel 2</Tabs.Panel>
            <Tabs.Panel>Panel 3</Tabs.Panel>
        </Tabs>
    ),
});

beforeEach(() => vi.resetAllMocks());

describe('Provider', () => {
    beforeAll(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('throws error if subcomponents are used outside of the main provider', () => {
        expect(() => render(<Tabs.Trigger>Trigger</Tabs.Trigger>)).toThrowError(
            'useTabsContext was used outside of its provider'
        );
    });
});

it('renders the component with the correct roles', () => {
    setup();

    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', {
        hidden: true,
    });

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(tabs).toHaveLength(3);
    expect(panels).toHaveLength(3);

    tabs.forEach((tab, i) => {
        expect(tab).toHaveAttribute('id', `${mockTriggerId}-${i}`);
        expect(tab).toHaveAttribute('aria-controls', `${mockPanelId}-${i}`);
    });

    panels.forEach((panel, i) => {
        expect(panel).toHaveAttribute('id', `${mockPanelId}-${i}`);
        expect(panel).toHaveAttribute(
            'aria-labelledby',
            `${mockTriggerId}-${i}`
        );
    });
});

it('renders with the correct attributes when a panel is open', async () => {
    const { user } = setup({ defaultOpen: 1 });

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(tab2).toHaveAttribute('tabindex', '0');

    expect(screen.getByRole('tabpanel', { name: 'Tab 2' })).toBeVisible();

    await user.click(tab3);

    expect(tab3).toHaveAttribute('aria-selected', 'true');
    expect(tab3).toHaveAttribute('tabindex', '0');

    expect(screen.getByRole('tabpanel', { name: 'Tab 3' })).toBeVisible();
});

it.each(['ArrowRight', 'ArrowLeft'])(
    'opens the correct panel when navigated to using the %s key',
    async (arrow) => {
        const { user } = setup();

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

        tab1.focus();

        await user.keyboard(`[${arrow}]`);
        expect(arrow === 'ArrowRight' ? tab2 : tab3).toHaveAttribute(
            'aria-selected',
            'true'
        );
        expect(arrow === 'ArrowRight' ? tab2 : tab3).toHaveAttribute(
            'tabindex',
            '0'
        );

        await user.keyboard(`[${arrow}]`);
        expect(arrow === 'ArrowRight' ? tab3 : tab2).toHaveAttribute(
            'aria-selected',
            'true'
        );
        expect(arrow === 'ArrowRight' ? tab3 : tab2).toHaveAttribute(
            'tabindex',
            '0'
        );

        await user.keyboard(`[${arrow}]`);
        expect(tab1).toHaveAttribute('aria-selected', 'true');
        expect(tab1).toHaveAttribute('tabindex', '0');
    }
);
