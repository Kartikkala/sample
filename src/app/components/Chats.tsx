'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMenu } from '@/store/features/chatSlice';

export default function Chats() {
  const dispatch = useAppDispatch();
  const { isMenuOpen } = useAppSelector((state) => state.chat);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        dispatch(toggleMenu());
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, dispatch]);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            onClick={() => dispatch(toggleMenu())}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <button className="w-full text-left p-2 rounded-md hover:bg-gray-700">
            New Chat
          </button>
          <div className="border-t border-gray-700 my-4"></div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded-md hover:bg-gray-700">
              Chat History 1
            </button>
            <button className="w-full text-left p-2 rounded-md hover:bg-gray-700">
              Chat History 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}