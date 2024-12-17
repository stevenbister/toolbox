/**
 * Get unique objects from an array based on the provided identifier.
 *
 * @param array - The array from which to retrieve unique objects
 * @param identifier - The key to identify uniqueness within the objects
 * @return An array containing only unique objects
 */
export const getUniqueObjects = <T extends object>(
    array: T[],
    identifier: keyof T
): T[] => {
    const unique: T[] = [
        ...new Map(array.map((item) => [item[identifier], item])).values(),
    ];

    return unique;
};
