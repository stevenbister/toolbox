// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
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
} from 'react';
import { useRegisterComponent } from '../../hooks/use-register-component/use-register-component';

interface TabsContextParams {
    triggers: HTMLButtonElement[];
    registerTriggers: (ref: HTMLButtonElement) => void;
    unregisterTriggers: (id: string) => void;
    registerPanels: (ref: HTMLDivElement) => void;
    unregisterPanels: (id: string) => void;
    id: string;
    getItemIndex: (
        item: HTMLButtonElement | HTMLDivElement
    ) => number | undefined;
    openItem: number;
    setOpenItem: (index: number) => void;
    handleItemFocus: (item: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextParams | undefined>(undefined);

const useTabsContext = () => {
    const context = useContext(TabsContext);

    if (context === undefined) {
        throw new Error('useTabsContext was used outside of its provider');
    }

    return context;
};

export interface TabsProps extends ComponentPropsWithoutRef<'div'> {
    defaultOpen?: number;
}

export const Tabs = ({ children, defaultOpen = 0, ...rest }: TabsProps) => {
    const id = useId();

    const [triggers, setTriggers] = useState<HTMLButtonElement[]>([]);
    const [panels, setPanels] = useState<HTMLDivElement[]>([]);

    const [openItem, setOpenItem] = useState<number>(defaultOpen);

    const {
        registerItem: registerTriggers,
        unregisterItem: unregisterTriggers,
    } = useRegisterComponent(setTriggers);
    const { registerItem: registerPanels, unregisterItem: unregisterPanels } =
        useRegisterComponent(setPanels);

    const getItemIndex = useCallback(
        (item: HTMLButtonElement | HTMLDivElement) => {
            if (item instanceof HTMLButtonElement) {
                return triggers.indexOf(item);
            }

            if (item instanceof HTMLDivElement) {
                return panels.indexOf(item);
            }
        },
        [panels, triggers]
    );

    const handleItemFocus = (item: HTMLButtonElement | null) => {
        if (!item) return;

        item?.focus();
        setOpenItem(getItemIndex(item) ?? 0);
    };

    return (
        <TabsContext.Provider
            value={{
                triggers,
                registerTriggers,
                unregisterTriggers,
                registerPanels,
                unregisterPanels,
                id,
                getItemIndex,
                openItem,
                setOpenItem,
                handleItemFocus,
            }}
        >
            <div {...rest}>{children}</div>
        </TabsContext.Provider>
    );
};

/* -------------------------------------------------------------------------------------------------
 * TabList
 * -----------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TabListProps extends ComponentPropsWithoutRef<'div'> {}

export const TabList = ({ children, ...rest }: TabListProps) => {
    return (
        <div {...rest} role="tablist">
            {children}
        </div>
    );
};

/* -------------------------------------------------------------------------------------------------
 * TabTrigger
 * -----------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TabTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export const TabTrigger = ({ children, ...rest }: TabTriggerProps) => {
    const {
        triggers,
        registerTriggers,
        unregisterTriggers,
        id,
        getItemIndex,
        openItem,
        setOpenItem,
        handleItemFocus,
    } = useTabsContext();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const index = getItemIndex(triggerRef.current!) ?? 0;
    const triggerId = `${id}-trigger-${index}`;
    const panelId = `${id}-panel-${index}`;

    const isActive = openItem === index;

    useEffect(() => {
        registerTriggers(triggerRef.current!);

        return () => unregisterTriggers(triggerId);
    }, [registerTriggers, triggerId, unregisterTriggers]);

    const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowRight':
                handleItemFocus(triggers[index + 1] ?? triggers[0]);
                break;
            case 'ArrowLeft':
                handleItemFocus(
                    triggers[index - 1] ?? triggers[triggers.length - 1]
                );
                break;
            default:
                break;
        }
    };

    return (
        <button
            {...rest}
            role="tab"
            id={triggerId}
            ref={triggerRef}
            aria-controls={panelId}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
                rest.onClick?.(e);
                setOpenItem(index);
            }}
            onKeyDown={handleKeyDown}
        >
            {children}
        </button>
    );
};

/* -------------------------------------------------------------------------------------------------
 * TabPanel
 * -----------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TabPanelProps extends ComponentPropsWithoutRef<'div'> {}

export const TabPanel = ({ children, ...rest }: TabPanelProps) => {
    const { registerPanels, unregisterPanels, id, getItemIndex, openItem } =
        useTabsContext();
    const panelRef = useRef<HTMLDivElement>(null);
    const index = getItemIndex(panelRef.current!);
    const triggerId = `${id}-trigger-${index}`;
    const panelId = `${id}-panel-${index}`;

    const isActive = openItem === index;

    useEffect(() => {
        registerPanels(panelRef.current!);

        return () => unregisterPanels(panelId);
    }, [panelId, registerPanels, unregisterPanels]);

    return (
        <div
            {...rest}
            role="tabpanel"
            id={panelId}
            aria-labelledby={triggerId}
            tabIndex={0}
            ref={panelRef}
            hidden={!isActive}
        >
            {isActive && children}
        </div>
    );
};

Tabs.List = TabList;
Tabs.Trigger = TabTrigger;
Tabs.Panel = TabPanel;
