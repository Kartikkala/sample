import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { askGemini } from './gemini';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure
    .query(async () => {
      return { greeting: `Hello` };
    }),
  askGemini: t.procedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      return { response: await askGemini(input.prompt) };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
