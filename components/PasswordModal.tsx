import React, { useState, useEffect, useRef } from 'react';
import CloseIcon from './icons/CloseIcon';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  errorMessage: string | null;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, errorMessage }) => {
  const [password, setPassword] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const unlockButtonRef = useRef<HTMLButtonElement>(null); // Ref for Unlock button

  useEffect(() => {
    if (isOpen) {
      setPassword(''); // Clear password on open
      // Focus the password input when the modal opens
      setTimeout(() => passwordInputRef.current?.focus(), 50); // Small delay for transition
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    // Do not clear password here, Header component will decide if it was correct
    // and if it was, the modal closes. If incorrect, error message shown and user can edit.
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  
  // Trap focus within the modal
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKeyPress);
    return () => {
      document.removeEventListener('keydown', handleTabKeyPress);
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-slate-800 p-6 rounded-lg shadow-2xl max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeInScaleUp"
        style={{
          animationName: 'modalFadeInScaleUpAnimation',
          animationDuration: '0.3s',
          animationFillMode: 'forwards',
        }}
      >
        <style>
          {`
            @keyframes modalFadeInScaleUpAnimation {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-pink-400 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          aria-label="Close password dialog"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <h2 id="password-modal-title" className="text-2xl font-semibold text-pink-400 mb-4 text-center">
          Password Required
        </h2>
        <p className="text-slate-300 mb-6 text-center text-sm">
          Please enter the password to upload artwork.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password-input" className="sr-only">
              Password
            </label>
            <input
              ref={passwordInputRef}
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700 border ${errorMessage ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-200 transition-colors`}
              placeholder="Enter password"
              required
              aria-describedby={errorMessage ? "password-error-message" : undefined}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && (
              <p id="password-error-message" className="mt-2 text-xs text-red-400 text-center" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto flex-1 order-2 sm:order-1 py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 transition-colors"
            >
              Cancel
            </button>
            <button
              ref={unlockButtonRef}
              type="submit"
              className="w-full sm:w-auto flex-1 order-1 sm:order-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;