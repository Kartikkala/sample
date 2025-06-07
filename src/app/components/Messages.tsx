'use client';

import { useAppSelector } from '@/store/hooks';

export default function Messages() {
  const currentChat = useAppSelector((state) => 
    state.chat.chats.find(chat => chat.id === state.chat.currentChatId)
  );

  return (
    <div className="container w-100 bg-secondary d-flex justify-content-center align-items-center flex-grow-1">
      <div className="w-100 p-3">
        {(!currentChat || currentChat.messages.length === 0) && (
          <p className="text-muted text-center">No messages yet. Start a conversation!</p>
        )}
        {currentChat?.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-2 mb-2 ${msg.isUser ? 'bg-primary' : 'bg-secondary'}`}
            style={{
              borderRadius: '10px',
              width : 'fit-content',
              marginLeft : msg.isUser ? 'auto' : '0'
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}
