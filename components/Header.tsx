import React from 'react';

// Hidden file input styles are no longer needed here
// const hiddenFileInputStyles: React.CSSProperties = { ... };

// HeaderProps is simplified as onArtUpload and isUploading are removed
interface HeaderProps {
  // No props needed for now if upload is on a separate page
}

const Header: React.FC<HeaderProps> = () => {
  // Removed refs and state related to file input, password modal, and uploading
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const uploadButtonRef = useRef<HTMLButtonElement>(null); 
  // const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // const [passwordError, setPasswordError] = useState<string | null>(null);
  // const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;

  // Removed useEffect for UPLOAD_PASSWORD warning as it's handled in admin page

  const handleTitleClick = () => {
    window.location.reload();
  }

  // Removed all event handlers related to upload and password modal:
  // handleUploadArtClick, handleClosePasswordModal, handlePasswordSubmit, handleFileChange

  // Removed useEffect for Escape key on password modal

  const logoImageUrl = "/bog_logo.gif"; 

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
            className="h-20 md:h-24 object-contain"
          />
        </div>
        
        <div>
          {/* Upload button and hidden file input are removed */}
          {/* A placeholder or different navigation could go here if needed */}
           <a 
            href="/admin/" 
            className="font-semibold py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 bg-pink-500 hover:bg-pink-600 text-white"
            aria-label="Go to Admin Upload Page"
          >
            Admin Upload
          </a>
        </div>
      </header>
      {/* PasswordModal is removed */}
    </>
  );
};

export default Header;