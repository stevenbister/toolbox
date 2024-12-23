// https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/
import type { ComponentPropsWithoutRef } from 'react';

export type Roles = 'alert' | 'status';

export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
    role?: Roles;
}

export const Alert = ({ children, role = 'alert', ...rest }: AlertProps) => (
    <div role={role} {...rest}>
        {children}
    </div>
);

export const AlertTitle = ({
    children,
    ...rest
}: ComponentPropsWithoutRef<'h2'>) => <h2 {...rest}>{children}</h2>;

export const AlertDescription = ({
    children,
    ...rest
}: ComponentPropsWithoutRef<'p'>) => <p {...rest}>{children}</p>;

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
