import type { ComponentPropsWithoutRef } from 'react';

export interface BreadcrumbItem {
    label: string;
    href: string;
}

export interface BreadcrumbProps
    extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
    items: BreadcrumbItem[];
    label?: string;
}

export const Breadcrumb = ({
    items,
    label = 'Breadcrumbs',
    ...rest
}: BreadcrumbProps) => (
    <nav {...rest} aria-label={label}>
        <ol>
            {items.map(({ label, href }, i) => (
                <BreadcrumbItem
                    href={href}
                    index={i}
                    isCurrentPage={i === items.length - 1}
                    key={href}
                >
                    {label}
                </BreadcrumbItem>
            ))}
        </ol>
    </nav>
);

interface BreadcrumbItemProps
    extends ComponentPropsWithoutRef<'li'>,
        Omit<BreadcrumbItem, 'label'> {
    index: number;
    isCurrentPage?: boolean;
}

const BreadcrumbItem = ({
    children,
    href,
    index,
    isCurrentPage,
    ...rest
}: BreadcrumbItemProps) => (
    <li {...rest}>
        {index !== 0 && <BreadcrumbSpacer />}

        <a href={href} aria-current={isCurrentPage ? 'page' : undefined}>
            {children}
        </a>
    </li>
);

const BreadcrumbSpacer = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        data-testid="breadcrumb-spacer"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 5l-10 14" />
    </svg>
);
