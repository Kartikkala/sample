'use client';

import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/react-query';
import { trpc } from './client';
import { useState } from 'react';

export function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        }),
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
        </trpc.Provider>
    );
}