import { trim } from './trim';

it('removes whitespaces', () => {
    expect(trim('Lorem ipsum')).toBe('Loremipsum');
});
