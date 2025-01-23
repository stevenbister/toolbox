type SearchEntries = {
    [key: string]: string | undefined;
};

export function buildUrl(pathname: string, queries: SearchEntries) {
    const url = new URL(pathname, window.location.origin);

    Object.entries(queries).forEach(([key, value]) => {
        if (typeof value === 'string') {
            try {
                const decodedValue = decodeURIComponent(value);
                url.searchParams.set(key, decodedValue);
            } catch (error) {
                url.searchParams.set(key, value);
            }
        }
    });

    return url.href;
}
