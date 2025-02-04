export const REGEX_MATCH_NON_NUMERIC = /\D/g;

export const monthYearMask = (value: string) => {
    const numberVal = value?.replace(REGEX_MATCH_NON_NUMERIC, '').slice(0, 4);
    const splitNumbers = numberVal?.match(/.{1,2}/g) ?? [];

    return splitNumbers.join('/');
};
