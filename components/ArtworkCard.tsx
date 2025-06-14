import React from 'react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick }) => {
  const handleCardClick = () => {
    onClick(artwork);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick(artwork);
    }
  };

  return (
    <div 
      className="bg-slate-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 w-full max-w-sm mx-auto"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={0} 
      role="button" 
      aria-labelledby={`artwork-title-${artwork.id}`}
    >
      {/* Image container: 40% width, square, centered, white background */}
      <div className="w-2/5 aspect-square mx-auto mt-4 mb-2 bg-white p-1 rounded-lg shadow-md">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title || "Artwork image"} 
          className="block w-full h-full object-contain" // Image fills this container
          loading="lazy"
        />
      </div>
      {/* Adjusted padding for text content area */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 id={`artwork-title-${artwork.id}`} className="text-lg font-semibold text-pink-400 mb-1 truncate text-center" title={artwork.title || "Untitled Artwork"}>
          {artwork.title || "Untitled Artwork"}
        </h3>
      </div>
    </div>
  );
};

export default ArtworkCard;