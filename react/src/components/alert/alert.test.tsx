import { render, screen } from '@testing-library/react';
import { Alert, type AlertProps, type Roles } from './alert';

const setup = (props?: Partial<AlertProps>) =>
    render(
        <Alert {...props}>
            <Alert.Title>Alert title</Alert.Title>
            <Alert.Description>Alert description</Alert.Description>
        </Alert>
    );

beforeEach(() => vi.resetAllMocks());

it.each(['alert', 'status'] as Roles[])(
    'renders the component with the %s role',
    async (role) => {
        setup({ role });

        expect(screen.getByRole(role)).toBeInTheDocument();
    }
);
