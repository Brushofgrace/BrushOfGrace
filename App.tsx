import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArtworkGallery from './components/ArtworkGallery';
import ArtworkModal from './components/ArtworkModal';
import Footer from './components/Footer';
import { Artwork } from './types';
// Removed sampleArtworks import as it's no longer used as a primary data source

// Import new services
import { uploadImage } from './services/imageUploadService';
import { generateDescription } from './services/aiDescriptionService';
import { saveArtwork, fetchArtworksFromBackend } from './services/artworkService'; // Added fetchArtworksFromBackend

const App: React.FC = () => {
  const [userUploadedArtworks, setUserUploadedArtworks] = useState<Artwork[]>([]);
  const [selectedArtworkForModal, setSelectedArtworkForModal] = useState<Artwork | null>(null);

  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);

  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtworks = async () => {
      setIsLoadingArtworks(true);
      setFetchError(null);
      try {
        const artworks = await fetchArtworksFromBackend();
        setUserUploadedArtworks(artworks.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())); // Sort by newest first
      } catch (error: any) {
        console.error("Failed to fetch artworks:", error);
        setFetchError(error?.message || "Could not load artworks from the gallery.");
      } finally {
        setIsLoadingArtworks(false);
      }
    };
    loadArtworks();
  }, []);

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
        artist: "Current User", 
        description: description,
        uploadDate: new Date().toISOString(),
      };

      setUploadStatusMessage("Saving artwork details...");
      const savedArtwork = await saveArtwork(artworkDataToSave);

      setUserUploadedArtworks(prevArtworks => [savedArtwork, ...prevArtworks].sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
      setUploadStatusMessage("Artwork added successfully!");
      setTimeout(() => setUploadStatusMessage(null), 5000);

    } catch (error: any) {
      console.error("Art upload process failed:", error);
      const displayErrorMessage = error?.message || "An unknown error occurred during upload.";
      setUploadStatusMessage(`Error: ${displayErrorMessage}`);
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

  // Artworks to display are now solely from userUploadedArtworks (which is fetched from backend)
  const artworksToDisplay = userUploadedArtworks;

  const renderMainContent = () => {
    if (isLoadingArtworks) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-slate-300 mt-4">Loading Artworks...</p>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)] text-center">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Oops! Something went wrong.</h2>
          <p className="text-slate-300">{fetchError}</p>
          <p className="text-slate-400 mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
        </div>
      );
    }

    if (artworksToDisplay.length > 0) {
      return <ArtworkGallery artworks={artworksToDisplay} onArtworkClick={handleArtworkCardClick} />;
    }

    // If not loading, no error, and no artworks
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-300 mb-4">Welcome to Brush Of Grace</h2>
          <p className="text-slate-400">Your gallery is currently empty.</p>
          <p className="text-slate-400 mt-2">Use the "Upload Art" button in the header to add your creations.</p>
        </div>
      </div>
    );
  };

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
        {renderMainContent()}
      </main>
      {selectedArtworkForModal && (
        <ArtworkModal artwork={selectedArtworkForModal} onClose={handleCloseModal} />
      )}
      <Footer />
    </div>
  );
};

export default App;