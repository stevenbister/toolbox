import { monthYearMask } from './month-year-mask';

it.each([
    ['0223', '02/23'],
    ['022', '02/2'],
    ['02', '02'],
    ['0', '0'],
    ['02hi', '02'],
])(
    'only returns numbers masked as MM/YY when given a string',
    (input, expected) => {
        expect(monthYearMask(input)).toBe(expected);
    }
);
