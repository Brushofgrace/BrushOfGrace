import React, { useRef, useState, useEffect } from 'react';
import PasswordModal from './PasswordModal'; // Import PasswordModal

interface HeaderProps {
  onArtUpload: (file: File) => void;
}

const hiddenFileInputStyles: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px', // To prevent the 1px box from affecting layout
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: '0',
  whiteSpace: 'nowrap', // Ensure content doesn't cause unexpected line breaks
};


const Header: React.FC<HeaderProps> = ({ onArtUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null); // Ref for the upload button
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleTitleClick = () => {
    window.location.reload();
  }

  const handleUploadArtClick = () => {
    setPasswordError(null); // Clear previous errors
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Return focus to the upload button when modal is closed
    uploadButtonRef.current?.focus(); 
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === '1936') {
      setIsPasswordModalOpen(false);
      // Return focus to the upload button briefly before triggering file input
      uploadButtonRef.current?.focus(); 
      setTimeout(() => { // Timeout to allow focus to settle before file dialog
        fileInputRef.current?.click();
      }, 0);
      setPasswordError(null);
    } else {
      setPasswordError("Incorrect password. Please try again.");
      // Explicitly focus the password input again on error for better UX
      // This will be handled by PasswordModal's own focus logic if it re-renders with error
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onArtUpload(file);
      // Reset file input to allow selecting the same file again if needed
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPasswordModalOpen) {
        handleClosePasswordModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPasswordModalOpen]);


  return (
    <>
      <header 
        className="py-4 px-6 flex justify-between items-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff00cc 0%, #3333ff 50%, #00ffcc 100%)' }} // Updated vibrant gradient
      >
        <h1 
          className="text-4xl font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleTitleClick}
          aria-label="Brush Of Grace, click to refresh page"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleTitleClick()}
        >
          Brush Of Grace
        </h1>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            style={hiddenFileInputStyles} // Use inline styles to hide
            aria-label="Select art file for upload"
            tabIndex={-1} // Ensure it's not focusable directly
          />
          <button
            ref={uploadButtonRef} // Assign ref to the button
            onClick={handleUploadArtClick}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
            aria-label="Upload new artwork"
          >
            Upload Art
          </button>
        </div>
      </header>
      {isPasswordModalOpen && (
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          onSubmit={handlePasswordSubmit}
          errorMessage={passwordError}
        />
      )}
    </>
  );
};

export default Header;