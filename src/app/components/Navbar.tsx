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
    <nav className="navbar navbar-dark bg-dark"
    style={{
      position: 'relative',
    }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => dispatch(toggleMenu())}
          className="p-0 bg-transparent border-0"
          style={{ height: '20px', width: '20px' }}
          aria-label="Toggle sidebar"
        >
          <HamburgerMenuButton isMenuOpen={isMenuOpen} />
        </button>

        {/* App Title */}
        <span className="navbar-brand mb-0 h1">ChatGPT Clone</span>

        {/* Empty space for alignment */}
        <span style={{ width: "2%" }}></span>
      </div>
    </nav>
  );
}

function HamburgerMenuButton({ isMenuOpen }: { isMenuOpen: boolean }) {
  return (
    <div className="hamburger-icon" style={{ width: '24px', height: '18px', position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          height: '2px',
          width: '100%',
          backgroundColor: 'white',
          top: isMenuOpen ? '8px' : '0',
          transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: '0.3s',
        }}
      ></span>
      <span
        style={{
          position: 'absolute',
          height: '2px',
          width: '100%',
          backgroundColor: 'white',
          top: '8px',
          opacity: isMenuOpen ? 0 : 1,
          transition: '0.3s',
        }}
      ></span>
      <span
        style={{
          position: 'absolute',
          height: '2px',
          width: '100%',
          backgroundColor: 'white',
          top: isMenuOpen ? '8px' : '16px',
          transform: isMenuOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
          transition: '0.3s',
        }}
      ></span>
    </div>
  );
}

