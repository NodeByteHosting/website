import useSWR, { SWRConfiguration } from 'swr';

const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());

export const createSWRConfig = (fetcher = defaultFetcher): SWRConfiguration => ({
    fetcher,
});

export const useSWRClient = <T>(key: any, fetcher: (args: any) => Promise<T>, config?: SWRConfiguration) => {
    return useSWR(key, fetcher, config);
};