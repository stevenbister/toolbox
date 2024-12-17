// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-actions/
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
    type KeyboardEvent,
    type MutableRefObject,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import { useClickOutside } from '../../hooks/use-click-outside/use-click-outside';

type Arrows = 'ArrowUp' | 'ArrowDown';

interface DropdownContextParams {
    _isOpen: boolean;
    handleOpenChange: <T extends SyntheticEvent | Event>(e: T) => void;
    handleItemFocus: (ref: HTMLLIElement | null) => void;
    triggerId: string;
    triggerRef: MutableRefObject<HTMLButtonElement | null>;
    menuId: string;
    items: HTMLLIElement[];
    activeItem: HTMLLIElement | null;
    registerItem: (ref: HTMLLIElement) => void;
    unregisterItem: (id: string) => void;
    lastArrowPressed: Arrows | undefined;
    setLastArrowPressed: (direction: Arrows | undefined) => void;
}

const DropdownContext = createContext<DropdownContextParams | undefined>(
    undefined
);

const useDropdownContext = () => {
    const context = useContext(DropdownContext);

    if (context === undefined) {
        throw new Error('useDropdownContext was used outside of its Provider');
    }

    return context;
};

export interface DropdownProps {
    children: ReactNode;
    isOpen?: boolean;
    onOpenChange?: () => void;
}

export const Dropdown = ({
    children,
    isOpen = false,
    onOpenChange,
}: DropdownProps) => {
    const [_isOpen, setIsOpen] = useState<boolean>(isOpen);

    const id = useId();
    const triggerId = `${id}trigger`;
    const menuId = `${id}menu`;

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const [items, setItems] = useState<HTMLLIElement[]>([]);
    const [activeItem, setActiveItem] =
        useState<DropdownContextParams['activeItem']>(null);
    const [lastArrowPressed, setLastArrowPressed] =
        useState<DropdownContextParams['lastArrowPressed']>(undefined);

    const registerItem = useCallback((item: HTMLLIElement) => {
        setItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
    }, []);

    const unregisterItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleOpenChange = <T extends SyntheticEvent | Event>(e: T) => {
        e.preventDefault();

        setIsOpen(!_isOpen);
        onOpenChange?.();

        if (!_isOpen) setLastArrowPressed(undefined);
    };

    const handleItemFocus = (item: HTMLLIElement | null) => {
        item?.focus();
        setActiveItem(item);
    };

    useClickOutside(rootRef, (e) => {
        if (!_isOpen) return;

        handleOpenChange(e);
        triggerRef.current?.focus();
    });

    return (
        <DropdownContext.Provider
            value={{
                _isOpen,
                handleOpenChange,
                handleItemFocus,
                triggerId,
                triggerRef,
                menuId,
                items,
                activeItem,
                registerItem,
                unregisterItem,
                lastArrowPressed,
                setLastArrowPressed,
            }}
        >
            <div ref={rootRef}>{children}</div>
        </DropdownContext.Provider>
    );
};

const DropdownTrigger = ({
    children,
    ...rest
}: ComponentPropsWithoutRef<'button'>) => {
    const {
        _isOpen,
        handleOpenChange,
        triggerId,
        menuId,
        items,
        triggerRef,
        setLastArrowPressed,
    } = useDropdownContext();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            e.preventDefault();
            handleOpenChange(e);
            setLastArrowPressed(e.code);
        }
    };

    return (
        <button
            {...rest}
            id={triggerId}
            aria-controls={items.length > 0 ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={_isOpen}
            onClick={handleOpenChange}
            onMouseDown={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            ref={triggerRef}
        >
            {children}
        </button>
    );
};

const DropdownMenu = ({
    children,
    ...rest
}: ComponentPropsWithoutRef<'ul'>) => {
    const menuRef = useRef<HTMLUListElement>(null);
    const { _isOpen, triggerId, menuId } = useDropdownContext();

    if (!_isOpen) return null;

    return (
        <ul
            {...rest}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            tabIndex={-1}
            ref={menuRef}
        >
            {children}
        </ul>
    );
};

export interface DropdownItemProps extends ComponentPropsWithoutRef<'li'> {
    onSelect?: () => void;
}

const DropdownItem = ({ children, onSelect, ...rest }: DropdownItemProps) => {
    const id = useId();
    const itemId = rest.id ?? `${id}item`;

    const itemRef = useRef<HTMLLIElement | null>(null);

    const {
        _isOpen,
        handleOpenChange,
        handleItemFocus,
        items,
        lastArrowPressed,
        registerItem,
        unregisterItem,
        activeItem,
        triggerRef,
    } = useDropdownContext();

    useEffect(() => {
        registerItem(itemRef.current!);

        return () => unregisterItem(itemId);
    }, [itemId, registerItem, unregisterItem]);

    useEffect(() => {
        if (!_isOpen) return;

        switch (lastArrowPressed) {
            case 'ArrowDown':
                handleItemFocus(items[0]);
                break;
            case 'ArrowUp':
                handleItemFocus(items[items.length - 1]);
                break;
            default:
                handleItemFocus(items[0]);
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastArrowPressed, _isOpen, items]);

    const handleItemSelect = <T extends SyntheticEvent>(e: T) => {
        handleOpenChange(e);
        onSelect?.();
        triggerRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!_isOpen || items.length === 0) return;

        const currentIndex = items.findIndex(
            (item) => item.id === activeItem?.id
        );

        switch (e.code) {
            case 'ArrowDown': {
                const nextIndex = (currentIndex + 1) % items.length;
                handleItemFocus(items[nextIndex]);
                break;
            }
            case 'ArrowUp': {
                const prevIndex =
                    (currentIndex - 1 + items.length) % items.length;
                handleItemFocus(items[prevIndex]);
                break;
            }
            case 'Escape':
                triggerRef.current?.focus();
                handleOpenChange(e);
                break;
            case 'Enter':
            case 'Space':
                handleItemSelect(e);
                break;
            default:
                break;
        }
    };

    return (
        <li
            {...rest}
            id={itemId}
            role="menuitem"
            tabIndex={activeItem?.id === itemId ? 0 : -1}
            data-focused={activeItem?.id === itemId}
            onMouseOver={() => {
                handleItemFocus(itemRef.current);
            }}
            onClick={handleItemSelect}
            onKeyDown={handleKeyDown}
            ref={itemRef}
        >
            {children}
        </li>
    );
};

Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
