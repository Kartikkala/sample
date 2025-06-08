// src/utils/trpcVanilla.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "@/server/trpc"; // adjust the path

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc', // Update this if you're on a different port or domain
    }),
  ],
});
