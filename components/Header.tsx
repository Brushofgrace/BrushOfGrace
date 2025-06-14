import React, { useRef, useState, useEffect } from 'react';
import PasswordModal from './PasswordModal'; // Import PasswordModal

interface HeaderProps {
  onArtUpload: (file: File) => void;
  isUploading: boolean; // New prop
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


const Header: React.FC<HeaderProps> = ({ onArtUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null); // Ref for the upload button
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Read password from environment variable. Fallback to '1936' if not set.
  const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;

  useEffect(() => {
    if (!UPLOAD_PASSWORD) {
      console.warn("UPLOAD_PASSWORD is not set in environment variables. Falling back to default '1936'. It's recommended to set this for security.");
    }
  }, [UPLOAD_PASSWORD]);

  const handleTitleClick = () => {
    window.location.reload();
  }

  const handleUploadArtClick = () => {
    if (isUploading) return; // Prevent action if already uploading
    setPasswordError(null); // Clear previous errors
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Return focus to the upload button when modal is closed
    uploadButtonRef.current?.focus(); 
  };

  const handlePasswordSubmit = (password: string) => {
    const correctPassword = UPLOAD_PASSWORD || '1936'; // Use env password or fallback
    if (password === correctPassword) {
      setIsPasswordModalOpen(false);
      // Return focus to the upload button briefly before triggering file input
      uploadButtonRef.current?.focus(); 
      setTimeout(() => { // Timeout to allow focus to settle before file dialog
        fileInputRef.current?.click();
      }, 0);
      setPasswordError(null);
    } else {
      setPasswordError("Incorrect password. Please try again.");
      // PasswordModal's own focus logic handles focusing input on error
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

  const logoImageUrl = "./bog_logo.gif"; // Adjust the path as needed

  return (
    <>
      <header 
        className="py-4 px-6 flex justify-between items-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff00cc 0%, #3333ff 50%, #00ffcc 100%)' }}
      >
        <div
          onClick={handleTitleClick}
          onKeyPress={(e) => e.key === 'Enter' && handleTitleClick()}
          className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 rounded"
          tabIndex={0}
          aria-label="Brush Of Grace logo, click to refresh page"
          role="button"
        >
          <img 
            src={logoImageUrl} 
            alt="Brush Of Grace logo" 
            className="h-10 md:h-12 object-contain" // Adjusted height for responsiveness
          />
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            style={hiddenFileInputStyles}
            aria-label="Select art file for upload"
            tabIndex={-1}
            disabled={isUploading} // Disable file input as well
          />
          <button
            ref={uploadButtonRef}
            onClick={handleUploadArtClick}
            className={`font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 ${
              isUploading 
                ? 'bg-slate-500 text-slate-300 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
            aria-label="Upload new artwork"
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Upload Art'}
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