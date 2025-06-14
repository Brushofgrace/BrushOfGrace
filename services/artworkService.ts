// services/artworkService.ts
import { Artwork } from '../types';

const XANO_SAVE_ARTWORK_ENDPOINT = process.env.XANO_SAVE_ARTWORK_ENDPOINT;
const XANO_GET_ARTWORKS_ENDPOINT = process.env.XANO_GET_ARTWORKS_ENDPOINT;

interface ArtworkDataPayload extends Omit<Artwork, 'id'> {}

/**
 * Saves artwork data to the Xano backend.
 * @param artworkData The artwork data to save (title, imageUrl, artist, description, uploadDate).
 * @returns A promise that resolves with the saved Artwork object (including ID from Xano).
 * @throws If the save operation fails or XANO_SAVE_ARTWORK_ENDPOINT is not set.
 */
export const saveArtwork = async (artworkData: ArtworkDataPayload): Promise<Artwork> => {
  if (!XANO_SAVE_ARTWORK_ENDPOINT) {
    console.error('Xano Save Artwork API endpoint is not configured.');
    throw new Error('Backend service for saving artwork is not configured (SAVE endpoint missing).');
  }

  try {
    const response = await fetch(XANO_SAVE_ARTWORK_ENDPOINT, {
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
        // If response is not JSON or error occurs during parsing
        const textResponse = await response.text();
        errorDetails += `, Body: ${textResponse || 'Unable to retrieve error body.'}`;
      }
      console.error('Xano API error (saveArtwork):', errorDetails);
      throw new Error(`Failed to save artwork: ${errorDetails}`);
    }

    const savedArtwork: Artwork = await response.json();
    if (!savedArtwork.id || !savedArtwork.uploadDate) {
        console.warn('Xano response for saved artwork might be missing id or uploadDate', savedArtwork);
    }
    return savedArtwork;
  } catch (error) {
    console.error('Error saving artwork to Xano:', error);
    if (error instanceof Error && error.message.startsWith('Failed to save artwork:')) {
        throw error; // Re-throw specific error
    }
    throw new Error('An unexpected error occurred while saving artwork.');
  }
};

/**
 * Fetches all artworks from the Xano backend.
 * Assumes a GET request to the XANO_GET_ARTWORKS_ENDPOINT returns a list of artworks.
 * @returns A promise that resolves with an array of Artwork objects.
 * @throws If the fetch operation fails or XANO_GET_ARTWORKS_ENDPOINT is not set.
 */
export const fetchArtworksFromBackend = async (): Promise<Artwork[]> => {
  if (!XANO_GET_ARTWORKS_ENDPOINT) {
    console.error('Xano Get Artworks API endpoint is not configured.');
    throw new Error('Backend service for fetching artworks is not configured (GET endpoint missing).');
  }

  try {
    const response = await fetch(XANO_GET_ARTWORKS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorDetails = `Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += `, Message: ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        const textResponse = await response.text();
        errorDetails += `, Body: ${textResponse || 'Unable to retrieve error body.'}`;
      }
      console.error('Xano API error (fetchArtworksFromBackend):', errorDetails);
      throw new Error(`Failed to fetch artworks: ${errorDetails}`);
    }

    const artworks: Artwork[] = await response.json();
    // It's good practice to validate the structure of artworks if possible, 
    // e.g., check if it's an array and items have expected properties.
    if (!Array.isArray(artworks)) {
        console.error('Xano API did not return an array for artworks:', artworks);
        throw new Error('Failed to fetch artworks: Invalid data format received.');
    }
    return artworks;
  } catch (error) {
    console.error('Error fetching artworks from Xano:', error);
     if (error instanceof Error && error.message.startsWith('Failed to fetch artworks:')) {
        throw error; // Re-throw specific error
    }
    throw new Error('An unexpected error occurred while fetching artworks.');
  }
};