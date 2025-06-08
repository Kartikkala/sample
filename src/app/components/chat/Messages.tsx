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
        height: 'calc(100vh - 150px)', // Adjust this value based on your layout
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <div className="w-100 p-3">
        {(!currentChat || !currentChat.messages?.length) && (
          <p className="text-muted text-center">No messages yet. Start a conversation!</p>
        )}
        {currentChat?.messages?.map((msg) => (
          <div 
            key={msg.id} 
            className="mb-3"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.is_user ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            {msg.content && (
              <div 
                className={`p-3 ${msg.is_user ? 'bg-primary text-white' : 'bg-secondary'}`}
                style={{
                  borderRadius: '10px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}
              </div>
            )}
            {msg.imageData && (
              <div 
                className="mt-2"
                style={{
                  maxWidth: '80%',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={msg.imageData} 
                  alt="Generated image" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    display: 'block'
                  }}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
      </div>
    </div>
  );
}
