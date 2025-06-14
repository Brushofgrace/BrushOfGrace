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

  const truncatedDescription = artwork.description
    ? artwork.description.substring(0, 100) + (artwork.description.length > 100 ? "..." : "")
    : "No description available.";

  return (
    <div 
      className="bg-slate-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={0} 
      role="button" 
      aria-labelledby={`artwork-title-${artwork.id}`}
      aria-describedby={artwork.description ? `artwork-desc-${artwork.id}` : undefined}
    >
      {/* Parent div for image: 40% width, centered. Height determined by img child. */}
      <div className="w-2/5 mx-auto mt-4 mb-2">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title || "Artwork image"} 
          className="block w-full h-auto object-contain bg-white p-1 rounded-lg shadow-md"
          loading="lazy"
        />
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <h3 id={`artwork-title-${artwork.id}`} className="text-lg font-semibold text-pink-400 mb-1 truncate text-center" title={artwork.title || "Untitled Artwork"}>
          {artwork.title || "Untitled Artwork"}
        </h3>
        {/* Increased height for artwork description display */}
        <p id={`artwork-desc-${artwork.id}`} className="text-xs text-slate-400 mt-1 leading-snug h-12 overflow-hidden text-center">
          {truncatedDescription}
        </p>
        <div className="flex-grow mt-2"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default ArtworkCard;