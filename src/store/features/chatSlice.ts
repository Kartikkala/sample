import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isMenuOpen: boolean;
}

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  isMenuOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    createNewChat: (state) => {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
      };
      state.chats.push(newChat);
      state.currentChatId = newChat.id;
    },
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Omit<Message, 'id' | 'timestamp'> }>) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.messages.push({
          ...message,
          id: Date.now().toString(),
          timestamp: Date.now(),
        });
      }
    },
    updateChatTitle: (state, action: PayloadAction<{ chatId: string; title: string }>) => {
      const { chatId, title } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.title = title;
      }
    },
  },
});

export const {
  toggleMenu,
  createNewChat,
  setCurrentChat,
  addMessage,
  updateChatTitle,
} = chatSlice.actions;

export default chatSlice.reducer; 