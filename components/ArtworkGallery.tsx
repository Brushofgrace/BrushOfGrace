import React from 'react';
import { Artwork } from '../types';
import ArtworkCard from './ArtworkCard';

interface ArtworkGalleryProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

const ArtworkGallery: React.FC<ArtworkGalleryProps> = ({ artworks, onArtworkClick }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-slate-400">No artwork to display yet.</p>
        <p className="text-slate-500">Try uploading your first masterpiece!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-8">
      {artworks.map((artwork) => (
        <ArtworkCard 
          key={artwork.id} 
          artwork={artwork} 
          onClick={onArtworkClick} 
        />
      ))}
    </div>
  );
};

export default ArtworkGallery;