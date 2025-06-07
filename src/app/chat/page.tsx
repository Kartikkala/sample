'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, createNewChat } from '@/store/features/chatSlice';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) =>
    state.chat.chats.find(chat => chat.id === state.chat.currentChatId)
  );
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // ✅ Auto-grow textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; // Grow up to 160px
    }
  }, [input]);

  return (
    <div className="container">
      <form className="input-group" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          rows={1}
          style={{
            resize: 'none',
            overflow: 'hidden',
            maxHeight: '160px', // Optional hard cap
          }}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
