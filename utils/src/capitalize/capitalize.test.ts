import { capitalize } from './capitalize';

it('capitalizes a string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('hello world')).toBe('Hello world');
});
