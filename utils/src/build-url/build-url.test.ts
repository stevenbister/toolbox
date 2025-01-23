import { buildUrl } from './build-url';

const testCases = [
    {
        description: 'simple query parameters',
        pathname: '/search',
        queries: { term: 'test' },
        expectedUrl: 'http://localhost:3000/search?term=test',
    },
    {
        description: 'multiple query parameters',
        pathname: '/search',
        queries: { term: 'test', page: '2' },
        expectedUrl: 'http://localhost:3000/search?term=test&page=2',
    },
    {
        description: 'special characters',
        pathname: '/search',
        queries: { searchTerm: "a/b c+d'e" },
        expectedUrl: 'http://localhost:3000/search?searchTerm=a%2Fb+c%2Bd%27e',
    },
    {
        description: 'without double-encoding',
        pathname: '/search',
        queries: { searchTerm: 'test%2Fvalue' },
        expectedUrl: 'http://localhost:3000/search?searchTerm=test%2Fvalue',
    },
    {
        description: 'without special characters at the end',
        pathname: '/search',
        queries: { searchTerm: 'vip - 20%' },
        expectedUrl: 'http://localhost:3000/search?searchTerm=vip+-+20%25',
    },
];

it.each(testCases)(
    'constructs URL $description',
    ({ pathname, queries, expectedUrl }) => {
        expect(buildUrl(pathname, queries)).toEqual(expectedUrl);
    }
);
