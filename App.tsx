import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArtworkGallery from './components/ArtworkGallery';
import ArtworkModal from './components/ArtworkModal';
import Footer from './components/Footer'; // Import Footer
import { Artwork } from './types';
import { sampleArtworks } from './constants';

const App: React.FC = () => {
  const [userUploadedArtworks, setUserUploadedArtworks] = useState<Artwork[]>([]);
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<Artwork | null>(null);

  const handleArtUpload = (file: File) => {
    console.log("New art selected:", file.name);
    
    const newArtwork: Artwork = {
      id: `new-art-${Date.now()}`,
      title: file.name.split('.').slice(0, -1).join('.') || "Untitled Artwork",
      imageUrl: URL.createObjectURL(file), // Temporary local URL, valid for session
      artist: "Current User", // Placeholder artist
      description: "A freshly uploaded piece.",
      uploadDate: new Date().toISOString(),
    };
    
    setUserUploadedArtworks(prevArtworks => [newArtwork, ...prevArtworks]);
  };

  const handleArtworkCardClick = (artwork: Artwork) => {
    setSelectedArtworkForModal(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtworkForModal(null);
  };

  // Add keyboard support for closing modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (selectedArtworkForModal) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArtworkForModal]);

  const artworksToDisplay = userUploadedArtworks.length > 0 ? userUploadedArtworks : sampleArtworks;

  return (
    <div className="flex flex-col min-h-screen bg-[#808080] text-slate-200"> {/* Changed background to 50% gray */}
      <Header onArtUpload={handleArtUpload} />
      <main className="flex-grow flex flex-col"> {/* Ensure main content takes available space */}
        {artworksToDisplay.length > 0 ? (
          <ArtworkGallery artworks={artworksToDisplay} onArtworkClick={handleArtworkCardClick} />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]"> {/* Adjusted min-height for better footer placement */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-300 mb-4">Welcome to Brush Of Grace</h2>
              <p className="text-slate-400">Your uploaded artwork will be displayed here.</p>
              <p className="text-slate-400 mt-2">Use the "Upload Art" button in the header to add your creations.</p>
            </div>
          </div>
        )}
      </main>
      {selectedArtworkForModal && (
        <ArtworkModal artwork={selectedArtworkForModal} onClose={handleCloseModal} />
      )}
      <Footer /> {/* Add Footer component here */}
    </div>
  );
};

export default App;