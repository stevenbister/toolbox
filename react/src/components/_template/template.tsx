import type { ComponentPropsWithoutRef } from 'react';

export interface TEMPLATEProps extends ComponentPropsWithoutRef<'div'> {}

export const TEMPLATE = ({ children, ...rest }: TEMPLATEProps) => (
    <div {...rest}>{children}</div>
);
