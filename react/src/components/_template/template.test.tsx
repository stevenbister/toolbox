import { render, screen } from '@testing-library/react';
import { TEMPLATE, type TEMPLATEProps } from './template';

const setup = (props?: Partial<TEMPLATEProps>) =>
    render(<TEMPLATE {...props} />);

beforeEach(() => vi.resetAllMocks());

it('renders the component', () => {
    setup({
        children: 'Hello World',
    });

    expect(screen.getByText('Hello World')).toBeInTheDocument();
});
