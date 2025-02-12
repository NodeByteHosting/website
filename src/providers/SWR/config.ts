import useSWR, { SWRConfig, SWRConfiguration } from 'swr';

const defaultFetcher = (url: string) => fetch(url).then((res) => res.json());

export const createSWRConfig = (fetcher = defaultFetcher): SWRConfiguration => ({
    fetcher,
});

export const useCustomSWR = (key: string | any[], fetcher?: any, config?: SWRConfiguration) => {
    return useSWR(key, fetcher, config);
};