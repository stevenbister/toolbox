import { getUniqueObjects } from './get-unique-objects';

test('removes duplicate objects from the array', () => {
    const objects = [
        { id: 1, text: 'lorem ipsum' },
        { id: 2, text: 'lorem ipsum' },
        { id: 3, text: 'lorem ipsum' },
        { id: 4, text: 'lorem ipsum' },
        { id: 1, text: 'lorem ipsum' },
        { id: 5, text: 'lorem ipsum' },
        { id: 6, text: 'lorem ipsum' },
        { id: 3, text: 'lorem ipsum' },
        { id: 6, text: 'lorem ipsum' },
        { id: 17, text: 'lorem ipsum' },
        { id: 61, text: 'lorem ipsum' },
        { id: 18, text: 'lorem ipsum' },
    ];

    const uniqueObjects = getUniqueObjects(objects, 'id');

    expect(uniqueObjects).toHaveLength(9);

    expect(uniqueObjects).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: expect.any(Number) }),
        ])
    );
});

test('returns an empty array when the input array is empty', () => {
    const objects: any[] = [];

    expect(getUniqueObjects(objects, 'id')).toEqual([]);
});

test('returns the same array when there are no duplicate objects', () => {
    const objects = [
        { id: 1, text: 'lorem ipsum' },
        { id: 2, text: 'lorem ipsum' },
        { id: 3, text: 'lorem ipsum' },
        { id: 4, text: 'lorem ipsum' },
    ];

    expect(getUniqueObjects(objects, 'id')).toEqual(objects);
});
