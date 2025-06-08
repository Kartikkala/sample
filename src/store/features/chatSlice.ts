import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { trpc } from '@/app/_trpc/trpcVanilla';


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
  content?: string;
  imageData?: string;
  is_user: boolean;
  created_at: string;
}


export interface Model {
  id: string;
  name: string;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isMenuOpen: boolean;
  loading: boolean;
  error: string | null;
  models: Model[];
  selectedModel: Model;
}

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  isMenuOpen: false,
  loading: false,
  error: null,
  models: [],
  selectedModel: { id: 'gemini-pro', name: 'Gemini Pro' }
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (userId: string) => {
    const chats = await trpc.chat.getChats.query({ userId });
    return chats;
  }
);

export const fetchModels = createAsyncThunk(
  'chat/fetchModels',
  async () => {
    const models = await trpc.chat.getModels.query();
    return models;
  }
);

export const createNewChat = createAsyncThunk(
  'chat/createNewChat',
  async ({ userId }: { userId: string }) => {
    const chat = await trpc.chat.createChat.mutate({ userId });
    return chat;
  }
);

export const addMessage = createAsyncThunk(
  'chat/addMessage',
  async ({ chatId, content, imageData, isUser }: { 
    chatId: string; 
    content?: string; 
    imageData?: string;
    isUser: boolean 
  }) => {
    const message = await trpc.chat.addMessage.mutate({ chatId, content, imageData, isUser });
    return { chatId, message };
  }
);


export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<Model>) => {
      state.selectedModel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chats';
      })
      // Fetch Models
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
        if (action.payload.length > 0) {
          state.selectedModel = action.payload[0];
        }
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch models';
      })
      // Create New Chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = [action.payload, ...state.chats];
        state.currentChatId = action.payload.id;
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create chat';
      })
      // Add Message
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.loading = false;
        const chat = state.chats.find(c => c.id === action.payload.chatId);
        if (chat) {
          if (!chat.messages) {
            chat.messages = [];
          }
          chat.messages.push(action.payload.message);
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add message';
      });
  }
});

export const { toggleMenu, setCurrentChat, setSelectedModel } = chatSlice.actions;
export default chatSlice.reducer; 