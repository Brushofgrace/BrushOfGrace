import React from 'react';

// HeaderProps is simplified as onArtUpload and isUploading are removed
interface HeaderProps {
  // No props needed for now if upload is on a separate page
}

const Header: React.FC<HeaderProps> = () => {
  // Removed refs and state related to file input, password modal, and uploading

  const handleTitleClick = () => {
    window.location.reload();
  }

  // Removed all event handlers related to upload and password modal

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
        
        {/* The div containing the "Admin Upload" link has been removed. */}
        {/* A placeholder or different navigation could go here if needed in the future,
            but for now, this area is empty as requested. */}
            
      </header>
      {/* PasswordModal is removed */}
    </>
  );
};

export default Header;