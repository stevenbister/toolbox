// https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
import {
    createContext,
    useContext,
    useId,
    useReducer,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';

const ACCORDION_TYPES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
} as const;

type AccordionType = (typeof ACCORDION_TYPES)[keyof typeof ACCORDION_TYPES];
type Action = {
    collapsible: boolean;
    name: string;
    accordionType: AccordionType;
};

interface AccordionContextParams {
    type: AccordionType;
    openItems: Set<string>;
    toggleItem: (name: string) => void;
    collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextParams | undefined>(
    undefined
);

const useAccordionContext = () => {
    const context = useContext(AccordionContext);

    if (context === undefined) {
        throw new Error('useAccordionContext was used outside of its provider');
    }

    return context;
};

export interface AccordionProps extends ComponentPropsWithoutRef<'div'> {
    type?: AccordionType;
    collapsible?: boolean;
    defaultOpen?: string[];
}

export const Accordion = ({
    children,
    type = ACCORDION_TYPES.SINGLE,
    collapsible = false,
    defaultOpen,
    ...rest
}: AccordionProps) => {
    const [openItems, dispatch] = useReducer(
        (state: Set<string>, action: Action): Set<string> => {
            const newState = new Set(state);
            const { name, accordionType, collapsible } = action;

            if (accordionType === ACCORDION_TYPES.SINGLE) {
                if (collapsible && newState.has(name)) {
                    newState.clear();
                } else {
                    newState.clear();
                    newState.add(name);
                }
            } else if (accordionType === ACCORDION_TYPES.MULTIPLE) {
                if (newState.has(name)) {
                    if (collapsible) newState.delete(name);
                } else {
                    newState.add(name);
                }
            } else {
                throw new Error(
                    'Invalid accordion type, must be either `single` or `multiple`'
                );
            }

            return newState;
        },
        new Set<string>(defaultOpen ?? [])
    );

    if (
        defaultOpen &&
        defaultOpen.length > 1 &&
        type === ACCORDION_TYPES.SINGLE
    ) {
        throw new Error(
            'Default open items cannot be more than one when type is single'
        );
    }

    const toggleItem = (name: string) =>
        dispatch({ collapsible, name, accordionType: type });

    return (
        <AccordionContext.Provider
            value={{ type, openItems, toggleItem, collapsible }}
        >
            <div {...rest}>{children}</div>
        </AccordionContext.Provider>
    );
};

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/
interface AccordionItemContextParams {
    name: string;
    triggerId: string;
    panelId: string;
    isOpen: boolean;
}

const AccordionItemContext = createContext<
    AccordionItemContextParams | undefined
>(undefined);

const useAccordionItemContext = () => {
    const context = useContext(AccordionItemContext);

    if (context === undefined) {
        throw new Error(
            'useAccordionItemContext was used outside of its provider'
        );
    }

    return context;
};

interface AccordionItemProps {
    children: ReactNode;
    name: string;
}

export const AccordionItem = ({ children, name }: AccordionItemProps) => {
    const { openItems } = useAccordionContext();

    const id = useId();
    const triggerId = `${id}trigger`;
    const panelId = `${id}panel`;

    const isOpen = openItems.has(name);

    return (
        <AccordionItemContext.Provider
            value={{
                triggerId,
                panelId,
                isOpen,
                name,
            }}
        >
            {children}
        </AccordionItemContext.Provider>
    );
};

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AccordionTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export const AccordionTrigger = ({
    children,
    ...rest
}: AccordionTriggerProps) => {
    const { toggleItem, collapsible } = useAccordionContext();
    const { triggerId, panelId, isOpen, name } = useAccordionItemContext();

    return (
        <h2>
            <button
                {...rest}
                id={triggerId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                aria-disabled={isOpen && !collapsible}
                onClick={(e) => {
                    rest.onClick?.(e);
                    toggleItem(name);
                }}
                type="button"
            >
                {children}
            </button>
        </h2>
    );
};

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AccordionPanelProps extends ComponentPropsWithoutRef<'div'> {}

export const AccordionPanel = ({ children, ...rest }: AccordionPanelProps) => {
    const { panelId, triggerId, isOpen } = useAccordionItemContext();

    return (
        <div
            {...rest}
            id={panelId}
            aria-labelledby={triggerId}
            role="region"
            hidden={!isOpen}
        >
            {isOpen && children}
        </div>
    );
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
