
import { z } from 'zod';
import { askGemini } from './gemini';
import { chatRouter } from './routers/chat';
import { t } from './trpc_init';

export const appRouter = t.router({
  hello: t.procedure
    .query(async () => {
      return { greeting: `Hello` };
    }),
  askGemini: t.procedure
    .input(z.object({ prompt: z.string(), modelId: z.string() }))
    .mutation(async ({ input }) => {
      return { response: await askGemini(input.prompt, input.modelId) };
    }),
  chat: chatRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
