import { render, screen } from '@testing-library/react';
import {
    Icon,
    SpritesheetProvider,
    type IconProps,
    type SpritesheetProviderProps,
} from './icon';

const mockSpritesheetPath = './spritesheet.svg';

const defaultIconProps: IconProps = {
    spriteId: 'icon-test',
};

const setup = (
    props?: Partial<SpritesheetProviderProps>,
    iconProps?: Partial<IconProps>
) => ({
    ...render(
        <SpritesheetProvider {...props}>
            <Icon {...defaultIconProps} {...iconProps} data-testid="icon" />
        </SpritesheetProvider>
    ),
});

beforeEach(() => vi.resetAllMocks());

describe('Icon', () => {
    it('renders an SVG element with the correct attributes', () => {
        setup();

        const svgElement = screen.getByTestId('icon');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveAttribute('width', '100');
        expect(svgElement).toHaveAttribute('height', '100');
        expect(svgElement).toHaveAttribute('viewBox', '0 0 100 100');

        const useElement = svgElement.querySelector('use');
        expect(useElement).toBeInTheDocument();
        expect(useElement).toHaveAttribute(
            'href',
            `${mockSpritesheetPath}#${defaultIconProps.spriteId}`
        );
    });

    it('throws an error if used outside SpritesheetProvider', () => {
        const consoleErrorMock = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        expect(() => render(<Icon spriteId="icon-test" />)).toThrowError(
            'useSpritesheetContext was used outside of its Provider'
        );

        consoleErrorMock.mockRestore();
    });

    it('allows passing additional props to the SVG element', () => {
        setup(
            {},
            {
                className: 'custom-class',
            }
        );

        expect(screen.getByTestId('icon')).toHaveClass('custom-class');
    });
});

describe('SpritesheetProvider', () => {
    it('uses a custom spriteSheetPath when provided', () => {
        const altMockSpritesheetPath = '/custom/spritesheet.svg';
        setup({ spriteSheetPath: altMockSpritesheetPath });

        const svgElement = screen.getByTestId('icon');
        const useElement = svgElement.querySelector('use');
        expect(useElement).toHaveAttribute(
            'href',
            `${altMockSpritesheetPath}#${defaultIconProps.spriteId}`
        );
    });
});
