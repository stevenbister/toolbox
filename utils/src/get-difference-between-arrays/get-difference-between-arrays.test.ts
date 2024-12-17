import { getDifferenceBetweenArrays } from './get-difference-between-arrays';

test('returns the difference between two arrays of values', () => {
    const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const array2 = [1, 2, 3, 4, 5, 6, 7, 8];

    const difference = getDifferenceBetweenArrays(array1, array2);
    expect(difference).toHaveLength(1);
});

test('returns the difference between two arrays of objects', () => {
    const array1 = [
        {
            id: 1,
            name: 'John',
            age: 24,
        },
        {
            id: 2,
            name: 'Jane',
            age: 22,
        },
        {
            id: 3,
            name: 'Joe',
            age: 26,
        },
        {
            id: 4,
            name: 'Jill',
            age: 28,
        },
    ];

    const array2 = [
        {
            id: 1,
            name: 'John',
            age: 24,
        },
        {
            id: 2,
            name: 'Jane',
            age: 22,
        },
        {
            id: 3,
            name: 'Joe',
            age: 26,
        },
    ];

    const difference = getDifferenceBetweenArrays(array1, array2, 'id');

    expect(difference).toHaveLength(1);

    expect(difference).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 4 })])
    );
});

test('returns the difference between two arrays of objects with a nested identifier', () => {
    const array1 = [
        {
            name: 'John',
            age: 24,
            nested: {
                id: 1,
            },
        },
        {
            name: 'Jane',
            age: 22,
            nested: {
                id: 2,
            },
        },
        {
            name: 'Joe',
            age: 26,
            nested: {
                id: 3,
            },
        },
        {
            name: 'Jill',
            age: 28,
            nested: {
                id: 4,
            },
        },
    ];

    const array2 = [
        {
            name: 'John',
            age: 24,
            nested: {
                id: 1,
            },
        },
        {
            name: 'Jane',
            age: 22,
            nested: {
                id: 2,
            },
        },
        {
            name: 'Joe',
            age: 26,
            nested: {
                id: 3,
            },
        },
    ];

    const difference = getDifferenceBetweenArrays(array1, array2, 'nested.id');

    expect(difference).toHaveLength(1);

    expect(difference).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'Jill' })])
    );
});
