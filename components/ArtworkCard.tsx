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
    ? artwork.description.substring(0, 60) + (artwork.description.length > 60 ? "..." : "")
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
      {/* Reduced image preview size significantly */}
      <div className="h-24 w-full bg-white p-1 rounded-t-lg"> {/* Adjusted height from aspect-video */}
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title || "Artwork image"} 
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <h3 id={`artwork-title-${artwork.id}`} className="text-lg font-semibold text-pink-400 mb-1 truncate" title={artwork.title || "Untitled Artwork"}>
          {artwork.title || "Untitled Artwork"}
        </h3>
        {/* Added artwork description display */}
        <p id={`artwork-desc-${artwork.id}`} className="text-xs text-slate-400 mt-1 leading-snug h-8 overflow-hidden"> {/* approx 2 lines for text-xs */}
          {truncatedDescription}
        </p>
        <div className="flex-grow mt-2"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default ArtworkCard;