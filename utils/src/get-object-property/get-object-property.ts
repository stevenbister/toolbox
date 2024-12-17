/**
 * Retrieves a nested property from an object based on a provided path.
 *
 * @param obj - The object to retrieve the property from.
 * @param path - The path to the nested property.
 * @return The value of the nested property at the specified path.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectProperty = <T extends Record<string, any>>(
    obj: T,
    path: string
) => {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        result = result[key];
    }

    return result;
};
