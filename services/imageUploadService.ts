// services/imageUploadService.ts

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';

/**
 * Uploads an image file to Imgur.
 * @param file The image file to upload.
 * @returns A promise that resolves with the Imgur URL of the uploaded image.
 * @throws If the upload fails or IMGUR_CLIENT_ID is not set.
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!IMGUR_CLIENT_ID) {
    console.error('Imgur Client ID is not configured.');
    throw new Error('Image upload service is not configured.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(IMGUR_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Imgur API error:', errorData);
      throw new Error(`Imgur upload failed: ${errorData?.data?.error || response.statusText}`);
    }

    const result = await response.json();
    if (result.success && result.data && result.data.link) {
      return result.data.link;
    } else {
      console.error('Imgur upload failed: Invalid response structure', result);
      throw new Error('Imgur upload failed: Could not retrieve image URL.');
    }
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
