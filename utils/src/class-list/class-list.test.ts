import { classList } from './class-list';

test('joins class names together', () => {
    expect(classList('foo', 'bar', 'baz')).toEqual('foo bar baz');
    expect(classList('foo', '', 'bar', 'baz')).toEqual('foo bar baz');
    expect(classList('foo', '', undefined, null, 'bar')).toEqual('foo bar');
});
