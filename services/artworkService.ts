// services/artworkService.ts
import { Artwork } from '../types';

const XANO_API_ENDPOINT = process.env.XANO_API_ENDPOINT;

// This is the data structure we send to Xano, after mapping from ArtworkDataPayload
interface XanoArtworkPayload {
  title: string;
  image_url: string; // Snake_case for Xano
  artist?: string;
  image_description?: string; // Snake_case for Xano as per error
  upload_date: string; // Snake_case for Xano
}

// This represents the expected structure from Xano's response
interface XanoArtworkResponse {
  id: string;
  title: string;
  image_url: string;
  artist?: string;
  image_description?: string; // Snake_case from Xano as per error
  upload_date: string;
  // Xano might include other fields like created_at, which we can ignore or map if needed
  [key: string]: any; 
}


/**
 * Saves artwork data to the Xano backend.
 * @param artworkData The artwork data to save (using camelCase from frontend).
 * @returns A promise that resolves with the saved Artwork object (using camelCase for frontend).
 * @throws If the save operation fails or XANO_API_ENDPOINT is not set.
 */
export const saveArtwork = async (artworkData: Omit<Artwork, 'id'>): Promise<Artwork> => {
  if (!XANO_API_ENDPOINT) {
    console.error('Xano API endpoint is not configured.');
    throw new Error('Backend service is not configured.');
  }

  // Map frontend camelCase to Xano expected format
  const xanoPayload: XanoArtworkPayload = {
    title: artworkData.title,
    image_url: artworkData.imageUrl,
    artist: artworkData.artist,
    image_description: artworkData.description, // Map to image_description
    upload_date: artworkData.uploadDate,
  };

  try {
    const response = await fetch(XANO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(xanoPayload),
    });

    if (!response.ok) {
      let errorDetails = `Status: ${response.status}`;
      try {
        // Try to parse Xano's error message if it's JSON
        const errorData = await response.json();
        // Xano often has a 'message' field in its error responses
        errorDetails += `, Message: ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        // If parsing as JSON fails, use the raw text body
        errorDetails += `, Body: ${await response.text()}`;
      }
      console.error('Xano API error:', errorDetails);
      throw new Error(`Failed to save artwork: ${errorDetails}`);
    }

    const xanoResponse: XanoArtworkResponse = await response.json();
    
    // Map Xano response back to frontend camelCase Artwork type
    const savedArtwork: Artwork = {
      id: xanoResponse.id,
      title: xanoResponse.title,
      imageUrl: xanoResponse.image_url,
      artist: xanoResponse.artist,
      description: xanoResponse.image_description, // Map from image_description
      uploadDate: xanoResponse.upload_date,
    };

    // Basic validation for critical fields from Xano
    if (!savedArtwork.id || !savedArtwork.uploadDate || !savedArtwork.imageUrl) {
        console.warn('Xano response might be missing id, image_url, or upload_date after mapping', savedArtwork);
        // Depending on strictness, you could throw an error here if critical data is missing
    }
    return savedArtwork;
  } catch (error) {
    console.error('Error saving artwork to Xano:', error);
    // Ensure the error is re-thrown so it can be caught by the caller in App.tsx
    if (error instanceof Error) {
        throw error; // Re-throw the original error if it's already an Error instance
    }
    throw new Error('An unknown error occurred while saving artwork to Xano.');
  }
};