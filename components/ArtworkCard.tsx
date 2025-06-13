import React from 'react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick }) => {
  // Date formatting removed as it's no longer displayed on the card

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
      className="bg-slate-700 rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={0} // Make it focusable
      role="button" // Assign button role for accessibility
      aria-labelledby={`artwork-title-${artwork.id}`}
      // aria-describedby removed as date is no longer displayed
    >
      <div className="aspect-video bg-white p-1 rounded-t-lg"> {/* Image wrapper for border */}
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-contain" // Changed from object-cover to object-contain
          loading="lazy"
        />
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <h3 id={`artwork-title-${artwork.id}`} className="text-xl font-semibold text-pink-400 mb-2 truncate" title={artwork.title}>
          {artwork.title}
        </h3>
        {/* Date display removed from here */}
        {/* Placeholder for future elements if needed, ensuring title remains prominent */}
        <div className="flex-grow"></div> 
      </div>
    </div>
  );
};

export default ArtworkCard;