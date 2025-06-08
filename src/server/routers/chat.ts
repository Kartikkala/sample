import { z } from 'zod';
import { t } from '../trpc_init';
import { supabase } from '../supabase';
import { availableModels } from '../config/models';

export const chatRouter = t.router({
  getModels: t.procedure
    .query(async () => {
      return availableModels;
    }),
  getChats: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', input.userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch messages for each chat
      const chatsWithMessages = await Promise.all(
        chats.map(async (chat) => {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });

          return {
            ...chat,
            messages: messages || []
          };
        })
      );

      return chatsWithMessages;
    }),

  createChat: t.procedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert([
          {
            user_id: input.userId,
            title: 'New Chat'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { ...chat, messages: [] };
    }),

  addMessage: t.procedure
    .input(z.object({
      chatId: z.string(),
      content: z.string(),
      isUser: z.boolean()
    }))
    .mutation(async ({ input }) => {
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: input.chatId,
            content: input.content,
            is_user: input.isUser
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return message;
    })
}); 