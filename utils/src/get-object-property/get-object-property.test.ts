import { getObjectProperty } from './get-object-property';

test('returns the value of a top-level property', () => {
    const obj = { foo: 'bar' };
    const result = getObjectProperty(obj, 'foo');

    expect(result).toBe('bar');
});

test('returns the value of a nested property', () => {
    const obj = { foo: { bar: 'baz' } };
    const result = getObjectProperty(obj, 'foo.bar');

    expect(result).toBe('baz');
});

test('returns undefined when the property does not exist', () => {
    const obj = { foo: 'bar' };
    const result = getObjectProperty(obj, 'baz');

    expect(result).toBeUndefined();
});

test('returns undefined when the path is empty', () => {
    const obj = { foo: 'bar' };
    const result = getObjectProperty(obj, '');

    expect(result).toBeUndefined();
});

test('handles null values', () => {
    const obj = { foo: null };
    const result = getObjectProperty(obj, 'foo');

    expect(result).toBeNull();
});
