// services/artworkService.ts
import { Artwork } from '../types';

const XANO_SAVE_ARTWORK_ENDPOINT = process.env.XANO_SAVE_ARTWORK_ENDPOINT;
const XANO_GET_ARTWORKS_ENDPOINT = process.env.XANO_GET_ARTWORKS_ENDPOINT;

interface ArtworkDataPayload extends Omit<Artwork, 'id'> {}

/**
 * Extracts a title from a description string if it's formatted as **Title Here**.
 * @param description The description string.
 * @returns The extracted title or null if not found.
 */
const extractTitleFromDescription = (description: string): string | null => {
  if (!description) return null;
  const match = description.match(/\*\*(.*?)\*\*/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
};

/**
 * Saves artwork data to the Xano backend.
 * Extracts title from description if formatted as **Title**.
 * @param artworkData The artwork data to save (title, imageUrl, artist, description, uploadDate).
 * @returns A promise that resolves with the saved Artwork object (including ID from Xano).
 * @throws If the save operation fails or XANO_SAVE_ARTWORK_ENDPOINT is not set.
 */
export const saveArtwork = async (artworkData: ArtworkDataPayload): Promise<Artwork> => {
  if (!XANO_SAVE_ARTWORK_ENDPOINT) {
    console.error('Xano Save Artwork API endpoint is not configured.');
    throw new Error('Backend service for saving artwork is not configured (SAVE endpoint missing).');
  }

  // Attempt to extract title from description
  const extractedTitle = extractTitleFromDescription(artworkData.description || "");
  const finalTitle = extractedTitle || artworkData.title; // Use extracted title or fallback to original

  const payloadToSave = {
    ...artworkData,
    title: finalTitle,
  };

  try {
    const response = await fetch(XANO_SAVE_ARTWORK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadToSave), 
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

    const savedArtworkResponse: any = await response.json(); 
    const savedArtwork: Artwork = {
        id: String(savedArtworkResponse.id),
        title: savedArtworkResponse.title || payloadToSave.title, // Ensure title consistency
        imageUrl: savedArtworkResponse.imageUrl || payloadToSave.imageUrl,
        artist: savedArtworkResponse.artist || payloadToSave.artist,
        description: savedArtworkResponse.description || payloadToSave.description || "", // Ensure description is string
        uploadDate: savedArtworkResponse.uploadDate || payloadToSave.uploadDate,
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
      let finalImageUrl = item.imageUrl; 
      if (typeof finalImageUrl !== 'string' || !finalImageUrl) {
        if (typeof item.image_url === 'string' && item.image_url) { 
            finalImageUrl = item.image_url;
        } else if (item.image && typeof item.image === 'object' && typeof item.image.url === 'string' && item.image.url) { 
            finalImageUrl = item.image.url;
        } else if (typeof item.image === 'string' && item.image) { 
            finalImageUrl = item.image;
        }
      }

      if (typeof finalImageUrl !== 'string' || !finalImageUrl) {
          console.warn(`Artwork with id ${item.id || 'N/A'} has missing, invalid, or unresolvable imageUrl. Received data for image:`, {imageUrl: item.imageUrl, image_url: item.image_url, image: item.image });
          finalImageUrl = ''; 
      }

      return {
        id: String(item.id || Math.random().toString(36).substring(7)), // Fallback ID for safety
        title: item.title || "Untitled Artwork", // Ensure title is always a string
        imageUrl: finalImageUrl,
        artist: item.artist || item.artist_name, 
        description: item.description || item.description_text || "", // Ensure description is always a string
        uploadDate: item.uploadDate || item.upload_date || item.created_at || new Date().toISOString(), 
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