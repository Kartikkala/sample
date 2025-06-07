'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, createNewChat } from '@/store/features/chatSlice';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) => 
    state.chat.chats.find(chat => chat.id === state.chat.currentChatId)
  );
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    if (!currentChat) {
      dispatch(createNewChat());
      const newChatId = Date.now().toString();
      
      dispatch(addMessage({
        chatId: newChatId,
        message: {
          content: input,
          isUser: true
        }
      }));
    } else {
      dispatch(addMessage({
        chatId: currentChat.id,
        message: {
          content: input,
          isUser: true
        }
      }));
    }

    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="container">
      <form
        className="input-group"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          Send
        </button>
      </form>
    </div>
  );
}
