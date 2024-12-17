import { getObjectProperty } from '../get-object-property/get-object-property';

/**
 * Filter elements in array1 that are not present in array2 based on the identifier value returned by getIdentifier function.
 *
 * @param array1 - The first array to compare.
 * @param array2 - The second array to compare against.
 * @param getIdentifier - A function that returns the identifier value for a given element.
 * @return An array of elements from array1 that are not present in array2 based on the identifier value.
 */
const getDifferenceBetweenArraysHelper = <T>(
    array1: T[],
    array2: T[],
    getIdentifier: (value: T) => unknown
) => {
    return array1.filter((value) => {
        const identifierValue = getIdentifier(value);

        if (!identifierValue) !array2.includes(value);

        return !array2.some(
            (otherValue) => getIdentifier(otherValue) === identifierValue
        );
    });
};

/**
 * Retrieves the identifier of the given value if it's an object, otherwise returns the value itself.
 *
 * @param value - the value to retrieve the identifier from
 * @return the identifier of the value if it's an object, otherwise the value itself
 */
export const getDifferenceBetweenArrays = <T>(
    array1: T[],
    array2: T[],
    identifier?: string
): T[] => {
    /**
     * Retrieves the identifier of the given value if it's an object, otherwise returns the value itself.
     *
     * @param value - the value to retrieve the identifier from
     * @return the identifier of the value if it's an object, otherwise the value itself
     */
    const getIdentifier = (value: T) => {
        if (value !== null && typeof value === 'object') {
            return identifier && getObjectProperty(value, identifier);
        }

        return value;
    };

    return getDifferenceBetweenArraysHelper(array1, array2, getIdentifier);
};
