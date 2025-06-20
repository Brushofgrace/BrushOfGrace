import React, { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../services/imageUploadService';
import { generateDescription } from '../services/aiDescriptionService';
import { saveArtwork, fetchArtworksFromBackend, deleteArtwork } from '../services/artworkService';
import { Artwork } from '../types';

const AdminUploadPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isProcessingPassword, setIsProcessingPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;

  useEffect(() => {
    if (!UPLOAD_PASSWORD) {
      console.warn("UPLOAD_PASSWORD is not set in environment variables. Upload will likely fail to authenticate.");
      // It's crucial UPLOAD_PASSWORD is set for this page to work.
    }
  }, [UPLOAD_PASSWORD]);

  useEffect(() => {
    if (isAuthenticated) {
      loadArtworks();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setIsProcessingPassword(true);
    const correctPassword = UPLOAD_PASSWORD || '1936'; // Fallback if not set, but ideally it should always be set
    
    // Simulate a short delay for UX
    setTimeout(() => {
      if (password === correctPassword) {
        setIsAuthenticated(true);
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
      setIsProcessingPassword(false);
    }, 300);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatusMessage(null); // Clear previous status
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatusMessage("Please select a file to upload.");
      return;
    }

    setIsProcessingUpload(true);
    setUploadStatusMessage("Starting artwork processing...");
    const originalFileName = selectedFile.name.split('.').slice(0, -1).join('.') || "Untitled Artwork";

    try {
      setUploadStatusMessage("Uploading image to gallery...");
      const imageUrl = await uploadImage(selectedFile);

      setUploadStatusMessage("Generating AI description...");
      const description = await generateDescription(selectedFile, originalFileName);

      const artworkDataToSave: Omit<Artwork, 'id'> = {
        title: originalFileName, // Title will be extracted from description by saveArtwork
        imageUrl: imageUrl,
        artist: "Brush Of Grace Admin", // Or a generic artist name
        description: description,
        uploadDate: new Date().toISOString(),
      };

      setUploadStatusMessage("Saving artwork details...");
      await saveArtwork(artworkDataToSave); // We don't need the returned artwork on this page

      setUploadStatusMessage("Artwork added successfully!");
      setSelectedFile(null); // Clear selected file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      setTimeout(() => setUploadStatusMessage(null), 5000);

    } catch (error: any) {
      console.error("Art upload process failed:", error);
      const displayErrorMessage = error?.message || "An unknown error occurred during upload.";
      setUploadStatusMessage(`Error: ${displayErrorMessage}`);
      // Keep error message longer for visibility
      setTimeout(() => setUploadStatusMessage(null), 10000); 
    } finally {
      setIsProcessingUpload(false);
    }
  };

  const loadArtworks = async () => {
    setIsLoadingArtworks(true);
    setArtworkError(null);
    try {
      const data = await fetchArtworksFromBackend();
      setArtworks(data);
    } catch (error: any) {
      setArtworkError(error?.message || 'Failed to load artworks.');
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  const handleDeleteArtwork = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await deleteArtwork(Number(id));
      setArtworks((prev) => prev.filter((a) => Number(a.id) !== Number(id)));
    } catch (error: any) {
      alert(error?.message || 'Failed to delete artwork.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full">
        <h1 className="text-3xl font-bold text-pink-400 mb-6 text-center">Admin Upload</h1>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1">
              Enter Upload Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 bg-slate-700 border ${passwordError ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-200 transition-colors`}
              required
            />
            {passwordError && <p className="mt-2 text-xs text-red-400 text-center">{passwordError}</p>}
          </div>
          <button
            type="submit"
            disabled={isProcessingPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:bg-pink-800 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessingPassword ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Authenticate'}
          </button>
        </form>
         <p className="mt-8 text-center">
            <a href="/" className="text-sm text-pink-400 hover:text-pink-300 hover:underline">
              &larr; Back to Main Gallery
            </a>
          </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full">
      <h1 className="text-3xl font-bold text-pink-400 mb-8 text-center">Upload New Artwork</h1>
      
      {uploadStatusMessage && (
        <div 
          className={`p-3 mb-6 text-center text-sm font-medium rounded-md ${uploadStatusMessage.startsWith('Error:') ? 'bg-red-200 text-red-700 border border-red-400' : 'bg-green-200 text-green-700 border border-green-400'}`}
          role="status"
          aria-live="polite"
        >
          {uploadStatusMessage}
        </div>
      )}

      <form onSubmit={handleFileUploadSubmit} className="space-y-6">
        <div>
          <label htmlFor="artworkFile" className="block text-sm font-medium text-slate-300 mb-1">
            Choose Artwork File
          </label>
          <input
            type="file"
            id="artworkFile"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            required
            className="block w-full text-sm text-slate-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-pink-100 file:text-pink-700
                       hover:file:bg-pink-200
                       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
           {selectedFile && <p className="mt-2 text-xs text-slate-400">Selected: {selectedFile.name}</p>}
        </div>

        <button
          type="submit"
          disabled={isProcessingUpload || !selectedFile}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:bg-pink-800 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessingUpload ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Upload Artwork'}
        </button>
      </form>
      {/* Artwork List Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-pink-300 mb-4 text-center">Delete Existing Artworks</h2>
        {isLoadingArtworks ? (
          <p className="text-center text-slate-400">Loading artworks...</p>
        ) : artworkError ? (
          <p className="text-center text-red-400">{artworkError}</p>
        ) : artworks.length === 0 ? (
          <p className="text-center text-slate-400">No artworks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="bg-slate-700 rounded-lg p-4 flex flex-col items-center">
                <img src={artwork.imageUrl} alt={artwork.title} className="w-40 h-40 object-contain mb-2 rounded shadow" />
                <div className="text-pink-300 font-semibold mb-1 text-center">{artwork.title}</div>
                <div className="text-slate-400 text-xs mb-2 text-center">{artwork.artist}</div>
                <button
                  onClick={() => handleDeleteArtwork(Number(artwork.id))}
                  className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-8 text-center">
        <a href="/" className="text-sm text-pink-400 hover:text-pink-300 hover:underline">
          &larr; Back to Main Gallery
        </a>
      </p>
    </div>
  );
};

export default AdminUploadPage;