'use client';

import { useAppSelector } from '@/store/hooks';
import { useEffect, useRef } from 'react';

export default function Messages() {
  const currentChat = useAppSelector((state) => 
    state.chat.chats.find(chat => chat.id === state.chat.currentChatId)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]); // Scroll when messages change

  return (
    <div 
      className="container w-100 bg-secondary d-flex justify-content-center align-items-start flex-grow-1"
      style={{
        height: 'calc(100vh - 200px)', // Adjust this value based on your layout
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div className="w-100 p-3">
        {(!currentChat || currentChat.messages.length === 0) && (
          <p className="text-muted text-center">No messages yet. Start a conversation!</p>
        )}
        {currentChat?.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-2 mb-2 ${msg.isUser ? 'bg-primary' : 'bg-secondary'} `}
            style={{
              borderRadius: '10px',
              width: 'fit-content',
              marginLeft: msg.isUser ? 'auto' : '0',
              maxWidth: '80%',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
      </div>
    </div>
  );
}
