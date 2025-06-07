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

interface Model {
  id: number;
  name: string;
  value: string;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isMenuOpen: boolean;
  models: Model[];
  selectedModel: Model;
}

const models: Model[] = [
  {
    id: 1,
    name: "GPT-4",
    value: "gpt-4"
  },
  {
    id: 2,
    name: "GPT-4o",
    value: "gpt-4o"
  },
];

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  isMenuOpen: false,
  models: models,
  selectedModel: models[0], // Default to first model
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
    setSelectedModel: (state, action: PayloadAction<Model>) => {
      state.selectedModel = action.payload;
    },
  },
});

export const {
  toggleMenu,
  createNewChat,
  setCurrentChat,
  addMessage,
  updateChatTitle,
  setSelectedModel,
} = chatSlice.actions;

export default chatSlice.reducer; 