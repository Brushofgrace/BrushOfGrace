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
      body: JSON.stringify(artworkData), // Assumes Xano can handle camelCase or has input mapping
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
      console.error('Xano API error (saveArtwork):', errorDetails);
      throw new Error(`Failed to save artwork: ${errorDetails}`);
    }

    // Assuming Xano returns the created object, potentially with an 'id' and matching our Artwork structure.
    // If Xano returns fields in snake_case, mapping would be needed here too for consistency.
    const savedArtworkResponse: any = await response.json(); 
    const savedArtwork: Artwork = {
        id: String(savedArtworkResponse.id),
        title: savedArtworkResponse.title || artworkData.title,
        imageUrl: savedArtworkResponse.imageUrl || artworkData.imageUrl,
        artist: savedArtworkResponse.artist || artworkData.artist,
        description: savedArtworkResponse.description || artworkData.description,
        uploadDate: savedArtworkResponse.uploadDate || artworkData.uploadDate,
    };
    
    if (!savedArtwork.id) {
        console.warn('Xano response for saved artwork might be missing id', savedArtwork);
    }
    return savedArtwork;
  } catch (error) {
    console.error('Error saving artwork to Xano:', error);
    if (error instanceof Error && error.message.startsWith('Failed to save artwork:')) {
        throw error;
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

    const rawArtworks: any[] = await response.json();

    if (!Array.isArray(rawArtworks)) {
        console.error('Xano API did not return an array for artworks:', rawArtworks);
        throw new Error('Failed to fetch artworks: Invalid data format received.');
    }
    
    const artworks: Artwork[] = rawArtworks.map((item: any) => {
      let finalImageUrl = item.imageUrl; // Prefer direct camelCase match
      if (typeof finalImageUrl !== 'string' || !finalImageUrl) {
        if (typeof item.image_url === 'string' && item.image_url) { // Fallback to snake_case
            finalImageUrl = item.image_url;
        } else if (item.image && typeof item.image === 'object' && typeof item.image.url === 'string' && item.image.url) { // Fallback to nested object like { image: { url: "..." } }
            finalImageUrl = item.image.url;
        } else if (typeof item.image === 'string' && item.image) { // Fallback if item.image itself is a string URL
            finalImageUrl = item.image;
        }
      }

      if (typeof finalImageUrl !== 'string' || !finalImageUrl) {
          console.warn(`Artwork with id ${item.id || 'N/A'} has missing, invalid, or unresolvable imageUrl. Received data for image:`, {imageUrl: item.imageUrl, image_url: item.image_url, image: item.image });
          finalImageUrl = ''; // Set to empty string if no valid URL found, to prevent undefined in src
      }

      return {
        id: String(item.id),
        title: item.title || "Untitled Artwork",
        imageUrl: finalImageUrl,
        artist: item.artist || item.artist_name, // Allow for 'artist_name' from backend
        description: item.description || item.description_text, // Allow for 'description_text'
        uploadDate: item.uploadDate || item.upload_date || item.created_at || new Date().toISOString(), // Check common date fields
      };
    });

    return artworks;
  } catch (error) {
    console.error('Error fetching artworks from Xano:', error);
     if (error instanceof Error && error.message.startsWith('Failed to fetch artworks:')) {
        throw error; 
    }
    throw new Error('An unexpected error occurred while fetching artworks.');
  }
};