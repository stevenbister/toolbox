import {
    createContext,
    useContext,
    useId,
    useRef,
    type ComponentPropsWithoutRef,
    type MouseEvent,
    type MutableRefObject,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import { useScrollLock } from '../../hooks/use-scroll-lock/use-scroll-lock';

interface DialogContextParams {
    dialogRef: MutableRefObject<HTMLDialogElement | null>;
    titleId: string;
    handleOpen: <T extends SyntheticEvent | Event>(e: T) => void;
    handleClose: <T extends SyntheticEvent | Event>(e: T) => void;
}

const DialogContext = createContext<DialogContextParams | undefined>(undefined);

const useDialogContext = () => {
    const context = useContext(DialogContext);

    if (context === undefined) {
        throw new Error('useDialogContext was used outside of its provider');
    }

    return context;
};

export interface DialogProps {
    children: ReactNode;
}

export const Dialog = ({ children }: DialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const id = useId();
    const titleId = `${id}title`;

    const { lock, unlock } = useScrollLock();

    const handleOpen = () => {
        dialogRef.current?.showModal();
        lock();
    };

    const handleClose = () => {
        dialogRef.current?.close();
        unlock();
    };

    return (
        <DialogContext.Provider
            value={{
                dialogRef,
                titleId,
                handleOpen,
                handleClose,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/
interface DialogContentProps extends ComponentPropsWithoutRef<'dialog'> {}

const DialogContent = ({ children, ...rest }: DialogContentProps) => {
    const { dialogRef, titleId } = useDialogContext();

    return (
        <dialog {...rest} aria-labelledby={titleId} ref={dialogRef}>
            {children}
        </dialog>
    );
};

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/
interface DialogTitleProps extends ComponentPropsWithoutRef<'h2'> {}

export const DialogTitle = ({ children, ...rest }: DialogTitleProps) => {
    const { titleId } = useDialogContext();

    return (
        <h2 {...rest} id={titleId}>
            {children}
        </h2>
    );
};

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/
interface DialogCloseProps extends ComponentPropsWithoutRef<'button'> {}

const DialogClose = ({ children, ...rest }: DialogCloseProps) => {
    const { handleClose } = useDialogContext();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        handleClose(e);
        rest.onClick?.(e);
    };

    return (
        <button {...rest} type="button" onClick={handleClick}>
            {children}
        </button>
    );
};

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/
interface DialogTriggerProps extends ComponentPropsWithoutRef<'button'> {}

const DialogTrigger = ({ children, ...rest }: DialogTriggerProps) => {
    const { handleOpen } = useDialogContext();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        handleOpen(e);
        rest.onClick?.(e);
    };

    return (
        <button {...rest} type="button" onClick={handleClick}>
            {children}
        </button>
    );
};

Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogClose;
Dialog.Title = DialogTitle;
Dialog.Content = DialogContent;
