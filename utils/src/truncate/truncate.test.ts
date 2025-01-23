import { truncate } from './truncate';

const longString = 'Lorem ipsum dolor';
const shortString = 'bye';

it('truncates if the string is longer than the given length', () => {
    expect(truncate(longString, 11)).toBe('Lorem ipsum...');
});

it('does not truncate if the string is equal to the given length', () => {
    expect(truncate(longString, longString.length)).toBe(longString);
});

it('does not truncate if the string is shorter than the given length', () => {
    expect(truncate(shortString, 5)).toBe(shortString);
});

it('does not truncate a string if the limit is negative', () => {
    expect(truncate(longString, -1)).toBe(longString);
});
