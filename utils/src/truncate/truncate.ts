/**
 * Truncates a string to a given length
 */
export const truncate = (str: string, length: number) => {
    if (str.length <= length || length <= 0) return str;

    return str.slice(0, length).trim() + '...';
};
