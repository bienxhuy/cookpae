// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  secure: true
});

/**
 * Upload a single image from buffer
 * @param fileBuffer - Image buffer from request
 * @param folder - Optional folder path in Cloudinary
 * @returns Upload result with secure_url and public_id
 */
export const uploadImage = async (fileBuffer: Buffer, folder?: string): Promise<any> => {
  const options: any = {
    folder: folder || 'cookpac',
    resource_type: 'image',
  };

  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
      options
    );
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images in parallel
 * @param fileBuffers - Array of image buffers from request
 * @param folder - Optional folder path in Cloudinary
 * @returns Array of upload results
 */
export const uploadImages = async (fileBuffers: Buffer[], folder?: string): Promise<any[]> => {
  const uploadPromises = fileBuffers.map(buffer => uploadImage(buffer, folder));

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Deletion result
 */
export const deleteImage = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs to delete
 * @returns Deletion results
 */
export const deleteImages = async (publicIds: string[]): Promise<any[]> => {
  const deletePromises = publicIds.map(id => deleteImage(id));

  try {
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
};
