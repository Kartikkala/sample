'use client';

import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '@/store/features/chatSlice';
import { RootState } from '@/store/store';

export default function Navbar() {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.chat.isMenuOpen);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => dispatch(toggleMenu())}
          className="btn btn-outline-light rounded-circle"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-4.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm0-4.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11z"
            />
          </svg>
        </button>

        {/* App Title */}
        <span className="navbar-brand mb-0 h1">ChatGPT Clone</span>

        {/* Empty space for alignment */}
        <div style={{ width: '40px' }}></div>
      </div>
    </nav>
  );
}
