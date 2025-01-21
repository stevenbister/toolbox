import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './dialog';

/**
 * Work around for missing showModal and close methods on HTMLDialogElement in JSDOM
 * @see https://github.com/jsdom/jsdom/issues/3294
 */
if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
        this.open = true;
    };
}
if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (returnValue) {
        this.open = false;
        this.returnValue = returnValue!;
    };
}

const mockDialogContent = {
    trigger: 'Open dialog',
    title: 'Dialog title',
    close: 'Close dialog',
};

const setup = () => {
    return {
        user: userEvent.setup(),
        ...render(
            <Dialog>
                <Dialog.Trigger>{mockDialogContent.trigger}</Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Close>{mockDialogContent.close}</Dialog.Close>
                    <Dialog.Title>{mockDialogContent.title}</Dialog.Title>
                </Dialog.Content>
            </Dialog>
        ),
    };
};

beforeEach(() => vi.resetAllMocks());

describe('Provider', () => {
    beforeAll(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('throws error if subcomponents are used outside of the main provider', () => {
        expect(() =>
            render(<Dialog.Trigger>Trigger</Dialog.Trigger>)
        ).toThrowError('useDialogContext was used outside of its provider');
    });
});

it('renders the component with the correct roles', async () => {
    setup();

    expect(
        screen.getByRole('button', { name: mockDialogContent.trigger })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('dialog', {
            hidden: true,
        })
    ).toBeInTheDocument();
});

it('opens the dialog when the trigger is clicked', async () => {
    const { user } = setup();

    await user.click(
        screen.getByRole('button', { name: mockDialogContent.trigger })
    );

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(
        screen.getByRole('heading', { name: mockDialogContent.title })
    ).toBeVisible();
});

it('closes the dialog when the close button is clicked', async () => {
    const { user } = setup();

    await user.click(
        screen.getByRole('button', { name: mockDialogContent.trigger })
    );

    await user.click(
        screen.getByRole('button', { name: mockDialogContent.close })
    );

    expect(
        screen.getByRole('heading', {
            name: mockDialogContent.title,
            hidden: true,
        })
    ).not.toBeVisible();
});
