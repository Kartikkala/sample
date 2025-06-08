'use client';

import { IoCreate } from "react-icons/io5";
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMenu, createNewChat, setCurrentChat, fetchChats } from '@/store/features/chatSlice';
import { useUser } from '@auth0/nextjs-auth0';
import { RootState } from '@/store/store';

export default function Chats() {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { isMenuOpen, chats, currentChatId } = useAppSelector((state: RootState) => state.chat);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.sub) {
      dispatch(fetchChats(user.sub));
    }
  }, [dispatch, user?.sub]);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      dispatch(toggleMenu());
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, dispatch]);

  const handleNewChat = () => {
    if (user?.sub) {
      dispatch(createNewChat({ userId: user.sub }));
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`position-fixed top-0 start-0 vh-100 first-background-color first-text-color p-3 shadow transition-transform ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-n100'
      }`}
      style={{
        width: '250px',
        zIndex: 1050,
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 mb-0">Chats</h2>
      </div>

      <div className="d-grid gap-2 mb-4">
        <button 
          className="btn second-background-color first-text-color text-center rounded-pill d-flex align-items-center justify-content-center gap-2"
          onClick={handleNewChat}
        >
          New Chat
          <IoCreate />
        </button>
      </div>

      <hr className="first-border-color" />

      <div className="d-grid gap-2 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`btn text-start first-text-color rounded-pill overflow-hidden text-truncate ${
              chat.id === currentChatId 
                ? 'first-accent-color' 
                : ''
            }`}
            onClick={() => dispatch(setCurrentChat(chat.id))}
          >
            {chat.title || 'New Chat'}
          </button>
        ))}
      </div>
    </div>
  );
}
