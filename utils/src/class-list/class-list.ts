import type { Maybe } from '../../../types/maybe';

/**
 * Joins a list of classes together, filtering out the falsy values
 *
 * @param classes A comma separated list of classNames
 * @returns A string of classNames
 * @example classNames('foo', 'bar', 'baz')
 */
export const classList = (...classes: Maybe<string>[]) =>
    classes
        .filter((className) => className)
        .join(' ')
        .trim();
