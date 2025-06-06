'use client';

import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleMenu } from '@/store/features/chatSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Navbar() {
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      dispatch(toggleMenu());
    }
  };

  const isMenuOpen = useSelector((state: RootState) => state.chat.isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, dispatch]);

  return (
    <nav className="bg-gray-900 text-white p-4 relative">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu Button */}  
        <button
          onClick={() => dispatch(toggleMenu())}
          className="p-1 rounded-xl border hover:bg-gray-800 focus:outline-none">
          Button
        </button>

        {/* App Title */}
        <h1 className="text-xl font-bold">ChatGPT Clone</h1>
        <div className="w-6"></div>
      </div>
    </nav>
  );
}
