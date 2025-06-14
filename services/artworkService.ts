// services/artworkService.ts
import { Artwork } from '../types';

const XANO_API_ENDPOINT = process.env.XANO_API_ENDPOINT;

interface ArtworkDataPayload extends Omit<Artwork, 'id'> {}

/**
 * Saves artwork data to the Xano backend.
 * @param artworkData The artwork data to save (title, imageUrl, artist, description, uploadDate).
 * @returns A promise that resolves with the saved Artwork object (including ID from Xano).
 * @throws If the save operation fails or XANO_API_ENDPOINT is not set.
 */
export const saveArtwork = async (artworkData: ArtworkDataPayload): Promise<Artwork> => {
  if (!XANO_API_ENDPOINT) {
    console.error('Xano API endpoint is not configured.');
    throw new Error('Backend service is not configured.');
  }

  try {
    const response = await fetch(XANO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artworkData),
    });

    if (!response.ok) {
      let errorDetails = `Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += `, Message: ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        errorDetails += `, Body: ${await response.text()}`;
      }
      console.error('Xano API error:', errorDetails);
      throw new Error(`Failed to save artwork: ${errorDetails}`);
    }

    const savedArtwork: Artwork = await response.json();
    // Ensure the returned object matches the Artwork type, especially id and uploadDate
    if (!savedArtwork.id || !savedArtwork.uploadDate) {
        console.warn('Xano response might be missing id or uploadDate', savedArtwork);
        // Fallback or further processing might be needed if Xano doesn't return these
    }
    return savedArtwork;
  } catch (error) {
    console.error('Error saving artwork to Xano:', error);
    throw error; // Re-throw to be caught by the caller
  }
};
