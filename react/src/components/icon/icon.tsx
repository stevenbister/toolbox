import {
    ComponentPropsWithoutRef,
    ReactNode,
    createContext,
    useContext,
} from 'react';

export interface IconProps extends ComponentPropsWithoutRef<'svg'> {
    spriteId: string;
    width?: number;
    height?: number;
}

export const Icon = (props: IconProps) => {
    const { spriteId, width = 100, height = 100, ...rest } = props;
    const { spriteSheetPath } = useSpritesheetContext();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            {...rest}
        >
            <use href={`${spriteSheetPath}#${spriteId}`} />
        </svg>
    );
};

const SpritesheetContext = createContext<
    | {
          spriteSheetPath: string | undefined;
      }
    | undefined
>(undefined);

const useSpritesheetContext = () => {
    const context = useContext(SpritesheetContext);

    if (context === undefined) {
        throw new Error(
            'useSpritesheetContext was used outside of its Provider'
        );
    }

    return context;
};

export interface SpritesheetProviderProps {
    children?: ReactNode;
    spriteSheetPath?: string;
}
export const SpritesheetProvider = (props: SpritesheetProviderProps) => {
    const { children, spriteSheetPath = './spritesheet.svg' } = props;

    return (
        <SpritesheetContext.Provider
            value={{
                spriteSheetPath,
            }}
        >
            {children}
        </SpritesheetContext.Provider>
    );
};
