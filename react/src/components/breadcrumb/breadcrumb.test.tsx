import { render, screen } from '@testing-library/react';
import { Breadcrumb, type BreadcrumbProps } from './breadcrumb';
import { mockItems } from './mock';

const customLabel = 'Custom label';

const setup = (props?: Partial<BreadcrumbProps>) =>
    render(<Breadcrumb {...props} items={mockItems} />);

beforeEach(() => vi.resetAllMocks());

it('renders the component correctly with all of the items', () => {
    setup();

    expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Breadcrumbs'
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(mockItems.length);
    expect(screen.getAllByRole('link')).toHaveLength(mockItems.length);
});

it('renders all links with the correct label and href', () => {
    setup();

    mockItems.forEach(({ href }, i) => {
        expect(screen.getAllByRole('link')[i]).toHaveTextContent(
            mockItems[i].label
        );
        expect(screen.getAllByRole('link')[i]).toHaveAttribute('href', href);
    });
});

it('renders the component with custom aria label', () => {
    setup({
        label: customLabel,
    });

    expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        customLabel
    );
});

it('renders the last item as current page', () => {
    setup();

    expect(screen.getAllByRole('link')[mockItems.length - 1]).toHaveAttribute(
        'aria-current',
        'page'
    );
});
