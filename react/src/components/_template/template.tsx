import type { ComponentPropsWithoutRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TEMPLATEProps extends ComponentPropsWithoutRef<'div'> {}

export const TEMPLATE = ({ children, ...rest }: TEMPLATEProps) => (
    <div {...rest}>{children}</div>
);
