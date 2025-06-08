// src/utils/trpcVanilla.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "@/server/trpc"; // adjust the path

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc', // Update this if you're on a different port or domain
    }),
  ],
});
