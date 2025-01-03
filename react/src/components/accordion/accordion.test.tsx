import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, type AccordionProps } from './accordion';

const setup = (props?: Partial<AccordionProps>) => ({
    user: userEvent.setup(),
    ...render(
        <Accordion {...props}>
            <Accordion.Item name="ac-one">
                <Accordion.Trigger>Accordion one</Accordion.Trigger>
                <Accordion.Panel>Accordion panel one</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item name="ac-two">
                <Accordion.Trigger>Accordion two</Accordion.Trigger>
                <Accordion.Panel>Accordion panel two</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item name="ac-three">
                <Accordion.Trigger>Accordion three</Accordion.Trigger>
                <Accordion.Panel>Accordion panel three</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    ),
});

beforeEach(() => vi.resetAllMocks());

describe('Provider', () => {
    beforeAll(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('throws error if subcomponents are used outside of the main provider', () => {
        expect(() =>
            render(<Accordion.Trigger>Trigger</Accordion.Trigger>)
        ).toThrowError('useAccordionContext was used outside of its provider');
    });

    it('throws error if subcomponents are used outside of the item provider', () => {
        expect(() =>
            render(
                <Accordion>
                    <Accordion.Trigger>Trigger</Accordion.Trigger>
                </Accordion>
            )
        ).toThrowError(
            'useAccordionItemContext was used outside of its provider'
        );
    });
});

it('renders the component with the correct roles', () => {
    setup();

    const btns = screen.getAllByRole('button');
    const panels = screen.getAllByRole('region', {
        hidden: true,
    });

    expect(screen.getAllByRole('heading')).toHaveLength(3);
    expect(btns).toHaveLength(3);
    expect(panels).toHaveLength(3);

    btns.forEach((btn, i) => {
        expect(btn).toHaveAttribute('id', `:r${i}:trigger`);
        expect(btn).toHaveAttribute('aria-controls', `:r${i}:panel`);
    });

    panels.forEach((panel, i) => {
        expect(panel).toHaveAttribute('id', `:r${i}:panel`);
        expect(panel).toHaveAttribute('aria-labelledby', `:r${i}:trigger`);
    });
});

it('sets the correct aria attributes when open', () => {
    setup({ defaultOpen: ['ac-one'] });

    const btn1 = screen.getByRole('button', { name: 'Accordion one' });
    const btn2 = screen.getByRole('button', { name: 'Accordion two' });
    const btn3 = screen.getByRole('button', { name: 'Accordion three' });

    const panel1 = screen.getByRole('region', { name: 'Accordion one' });

    expect(btn1).toHaveAttribute('aria-expanded', 'true');
    expect(panel1).toBeVisible();

    expect(btn2).toHaveAttribute('aria-expanded', 'false');

    expect(btn3).toHaveAttribute('aria-expanded', 'false');
});

it('only opens one panel at a time when type is single', async () => {
    const { user } = setup({ type: 'single' });

    await user.click(screen.getByRole('button', { name: 'Accordion one' }));

    const panel1 = screen.getByRole('region', { name: 'Accordion one' });
    expect(panel1).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Accordion two' }));
    expect(panel1).not.toBeVisible();
    expect(screen.getByRole('region', { name: 'Accordion two' })).toBeVisible();
});

it('opens multiple panels when type is multiple', async () => {
    const { user } = setup({ type: 'multiple' });

    await user.click(screen.getByRole('button', { name: 'Accordion one' }));
    const panel1 = screen.getByRole('region', { name: 'Accordion one' });
    expect(panel1).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Accordion two' }));
    const panel2 = screen.getByRole('region', { name: 'Accordion two' });
    expect(panel1).toBeVisible();
    expect(panel2).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Accordion three' }));
    expect(panel1).toBeVisible();
    expect(panel2).toBeVisible();
    expect(
        screen.getByRole('region', { name: 'Accordion three' })
    ).toBeVisible();
});

it('cannot close panels when collapsible is false', async () => {
    const { user } = setup({ defaultOpen: ['ac-one'], collapsible: false });

    const btn1 = screen.getByRole('button', { name: 'Accordion one' });
    const btn2 = screen.getByRole('button', { name: 'Accordion two' });
    const panel1 = screen.getByRole('region', { name: 'Accordion one' });

    expect(btn1).toHaveAttribute('aria-disabled', 'true');
    expect(panel1).toBeVisible();

    await user.click(btn1);
    expect(panel1).toBeVisible();

    await user.click(btn2);
    expect(panel1).not.toBeVisible();
    expect(screen.getByRole('region', { name: 'Accordion two' })).toBeVisible();
});

it('can be navigated with keyboard', async () => {
    const { user } = setup({ type: 'multiple' });

    await user.tab();
    expect(screen.getByRole('button', { name: 'Accordion one' })).toHaveFocus();

    await user.keyboard('[Enter]');
    expect(screen.getByRole('region', { name: 'Accordion one' })).toBeVisible();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Accordion two' })).toHaveFocus();

    await user.keyboard('[Space]');
    expect(screen.getByRole('region', { name: 'Accordion two' })).toBeVisible();
});
