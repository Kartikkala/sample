import { supabase } from '@/lib/supabase';

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}

export const chatService = {
  async createChat(userId: string, title: string = 'New Chat'): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id: userId, title }])
      .select()
      .single();

    if (error) throw error;
    return { ...data, messages: [] };
  },

  async getChats(userId: string): Promise<Chat[]> {
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (chatsError) throw chatsError;

    // Fetch messages for each chat
    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) => {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        return { ...chat, messages: messages || [] };
      })
    );

    return chatsWithMessages;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addMessage(chatId: string, content: string, isUser: boolean): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, content, is_user: isUser }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChatTitle(chatId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', chatId);

    if (error) throw error;
  },

  async deleteChat(chatId: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
  }
}; 