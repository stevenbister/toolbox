import { render, screen } from '@testing-library/react';
import { Button, type ButtonProps } from './button';

const setup = (props?: Partial<Omit<ButtonProps, 'children'>>) =>
    render(<Button {...props}>Button</Button>);

beforeEach(() => vi.resetAllMocks());

it.each(['button', 'link'])('renders the component as a %s', (type) => {
    setup({
        as: type === 'link' ? 'a' : type,
        href: type === 'link' ? '/' : undefined,
    });

    expect(screen.getByRole(type)).toBeInTheDocument();
});
