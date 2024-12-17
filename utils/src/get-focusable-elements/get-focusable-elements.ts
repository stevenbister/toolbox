/**
 * Returns back a NodeList of focusable elements that exist within the passed parent HTMLElement
 *
 * @param parent The parent HTMLElement to search within
 * @returns A NodeList of focusable elements
 */
export const getFocusableElements = (parent: HTMLElement) => {
    if (!parent) {
        console.warn('You need to pass a parent HTMLElement');
        return [];
    }

    const focusableElements = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"]):not([disabled])',
        'details:not([disabled])',
        'summary:not(:disabled)',
        'a[href]',
    ];

    const elements: NodeListOf<HTMLElement> = parent.querySelectorAll(
        focusableElements.join(',')
    );

    // Return as an array rather than a nodelist so we can use all array properties
    return [...elements];
};
