import { SWRConfig } from 'swr';
import { createSWRConfig } from './config';
import { ReactNode } from 'react';

interface SWRProviderProps {
    children: ReactNode;
    fetcher?: any;
}

const SWRProvider: React.FC<SWRProviderProps> = ({ children, fetcher }) => {
    const swrConfig = createSWRConfig(fetcher);

    return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
};

export default SWRProvider;