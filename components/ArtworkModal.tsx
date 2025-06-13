import React, { useEffect, useRef } from 'react';
import { Artwork } from '../types';
import CloseIcon from './icons/CloseIcon';
import ContactForm from './ContactForm'; // Import ContactForm

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the close button when the modal opens
    closeButtonRef.current?.focus();
  }, []);
  
  const formattedDate = new Date(artwork.uploadDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-slate-700 p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeInScaleUp custom-scrollbar"
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
          ref={closeButtonRef}
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-pink-400 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          aria-label="Close artwork details"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        {/* Changed from md:flex-row to always flex-col */}
        <div className="flex flex-col gap-6">
          {/* Image container with white border - removed md:w-1/2 */}
          <div className="w-full flex-shrink-0 aspect-video bg-white p-1 rounded-md shadow-lg">
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-contain" 
            />
          </div>
          {/* Details container - removed md:w-1/2 */}
          <div className="w-full flex flex-col">
            <h2 id="modal-title" className="text-3xl font-bold text-pink-400 mb-3">
              {artwork.title}
            </h2>
            <p className="text-sm text-slate-200 mb-4">
              Uploaded: {formattedDate}
            </p>
            {artwork.description && (
              <div id="modal-description" className="text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                <p className="font-semibold mb-1 text-slate-200">Description:</p>
                <p>{artwork.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Separator and Contact Form */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <ContactForm />
        </div>
        
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #334155; /* slate-700 from modal, adjusted for track on slate-700 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #64748b; /* slate-500 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; /* slate-400 */
        }
      `}</style>
    </div>
  );
};

export default ArtworkModal;