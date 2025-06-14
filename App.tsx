import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArtworkGallery from './components/ArtworkGallery';
import ArtworkModal from './components/ArtworkModal';
import Footer from './components/Footer';
import { Artwork } from './types';
import { sampleArtworks } from './constants';

// Import new services
import { uploadImage } from './services/imageUploadService';
import { generateDescription } from './services/aiDescriptionService';
import { saveArtwork } from './services/artworkService';

const App: React.FC = () => {
  const [userUploadedArtworks, setUserUploadedArtworks] = useState<Artwork[]>([]);
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<Artwork | null>(null);

  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);

  const handleArtUpload = async (file: File) => {
    setIsProcessingUpload(true);
    setUploadStatusMessage("Starting artwork processing...");
    const originalFileName = file.name.split('.').slice(0, -1).join('.') || "Untitled Artwork";

    try {
      setUploadStatusMessage("Uploading image to gallery...");
      const imageUrl = await uploadImage(file);

      setUploadStatusMessage("Generating AI description...");
      const description = await generateDescription(file, originalFileName);

      const artworkDataToSave: Omit<Artwork, 'id'> = {
        title: originalFileName,
        imageUrl: imageUrl,
        artist: "Current User", // This could be dynamic in a full app
        description: description,
        uploadDate: new Date().toISOString(), // Set current date as ISO string
      };

      setUploadStatusMessage("Saving artwork details...");
      const savedArtwork = await saveArtwork(artworkDataToSave);

      setUserUploadedArtworks(prevArtworks => [savedArtwork, ...prevArtworks]);
      setUploadStatusMessage("Artwork added successfully!");
      setTimeout(() => setUploadStatusMessage(null), 5000); // Clear message after 5s

    } catch (error: any) {
      console.error("Art upload process failed:", error);
      const displayErrorMessage = error?.message || "An unknown error occurred during upload.";
      setUploadStatusMessage(`Error: ${displayErrorMessage}`);
      // Keep error message for a longer period or until user interaction
      setTimeout(() => setUploadStatusMessage(null), 8000); 
    } finally {
      setIsProcessingUpload(false);
    }
  };

  const handleArtworkCardClick = (artwork: Artwork) => {
    setSelectedArtworkForModal(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtworkForModal(null);
  };

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
    <div className="flex flex-col min-h-screen bg-[#808080] text-slate-200">
      <Header onArtUpload={handleArtUpload} isUploading={isProcessingUpload} />
      
      {uploadStatusMessage && (
        <div 
          className={`p-3 text-center text-sm font-medium ${uploadStatusMessage.startsWith('Error:') ? 'bg-red-500 text-white' : 'bg-pink-500 text-white'}`}
          role="status"
          aria-live="polite"
        >
          {uploadStatusMessage}
        </div>
      )}

      <main className="flex-grow flex flex-col">
        {artworksToDisplay.length > 0 ? (
          <ArtworkGallery artworks={artworksToDisplay} onArtworkClick={handleArtworkCardClick} />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
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
      <Footer />
    </div>
  );
};

export default App;