import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chatSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); 