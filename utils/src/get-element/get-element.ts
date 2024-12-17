/**
 * A wrapper around document.querySelector
 *
 * @param selector A string containing one or more selectors to match. This string must be a valid CSS selector string.
 * @param node The node you want to search in. Default is document.
 * @returns An Element object representing the first element in the document that matches the specified set of CSS selectors,
 *          or null is returned if there are no matches.
 */
export const getElement = (
    selector: string,
    node: Document | HTMLElement = document
) => {
    return node.querySelector<HTMLElement>(selector);
};

/**
 * A wrapper around document.querySelectorAll which returns an array of elements instead of a NodeList.
 *
 * @param selector A string containing one or more selectors to match. This string must be a valid CSS selector string.
 *                 Multiple selectors may be specified by separating them using commas.
 * @param node The node you want to search in. Default is document.
 * @returns An array containing one Element object for each element that matches at least one of the specified selectors,
 *          or an empty Array in case of no matches.
 */
export const getAllElements = (
    selector: string,
    node: Document | HTMLElement = document
) => {
    return [...node.querySelectorAll<HTMLElement>(selector)];
};
