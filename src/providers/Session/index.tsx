'use client';

import { SessionProvider } from 'next-auth/react';

const NodeByteSession = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NodeByteSession;