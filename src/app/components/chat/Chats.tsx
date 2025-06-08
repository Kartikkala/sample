'use client';

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
      className={`position-fixed top-0 start-0 vh-100 bg-dark text-white p-3 shadow transition-transform ${
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
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => dispatch(toggleMenu())}
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 011 0L8 6.293l2.354-2.647a.5.5 0 111 .708L9.707 7l2.647 2.354a.5.5 0 01-.708 1L8 7.707 5.646 10.06a.5.5 0 11-.708-.708L6.293 7 3.646 4.646a.5.5 0 011-.708z" />
          </svg>
        </button>
      </div>

      <div className="d-grid gap-2 mb-4">
        <button 
          className="btn btn-secondary text-start"
          onClick={handleNewChat}
        >
          New Chat
        </button>
      </div>

      <hr className="border-secondary" />

      <div className="d-grid gap-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`btn text-start ${
              chat.id === currentChatId 
                ? 'btn-primary' 
                : 'btn-outline-light'
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
