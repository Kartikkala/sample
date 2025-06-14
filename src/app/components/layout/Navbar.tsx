'use client';

import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toggleMenu, setSelectedModel, type Model, fetchModels } from '@/store/features/chatSlice';
import { RootState, useAppDispatch } from '@/store/store';

function ModelSelector() {
  const dispatch = useAppDispatch();
  const { models, selectedModel } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const handleModelSelect = (model: Model) => {
    dispatch(setSelectedModel(model));
  };

  return (
    <div className="dropdown" style={{ position: 'absolute', right: '10px', top: '0', bottom: '0', display: 'flex', alignItems: 'center' }}>
      <button 
        className="btn second-background-color first-text-color dropdown-toggle rounded-pill" 
        type="button" 
        id="dropdownMenuButton" 
        data-bs-toggle="dropdown" 
        aria-haspopup="true" 
        aria-expanded="false"
        style={{
          backgroundColor: '',
          border: 'none',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
        }}
      >
        {selectedModel.name}
      </button>
      <div className="dropdown-menu dropdown-menu-end first-background-color" aria-labelledby="dropdownMenuButton">
        {models.map((model) => (
          <button 
            key={model.id}
            className={`dropdown-item text-white ${model.id === selectedModel.id ? 'second-background-color' : ''}`}
            onClick={() => handleModelSelect(model)}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const dispatch = useAppDispatch();
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
    <nav className="navbar navbar-dark first-background-color rounded-bottom"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '0.5rem',
        zIndex: 1000,
      }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button
          onClick={() => dispatch(toggleMenu())}
          className="p-0 bg-transparent border-0"
          style={{ height: '20px', width: '20px' }}
          aria-label="Toggle sidebar"
        >
          <HamburgerMenuButton isMenuOpen={isMenuOpen} />
        </button>
        <span className="navbar-brand mb-0 h1">Gemini</span>
        <span></span>
        <ModelSelector />
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

