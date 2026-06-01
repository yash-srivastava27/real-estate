import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'difjotugk',
  api_key: process.env.CLOUDINARY_API_KEY || '639734316234361',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'hMnwyblIiekkvkBlk2QVfkc_fKE',
});

/**
 * Delete an image from Cloudinary by public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Response from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<Object[]>} - Array of responses from Cloudinary
 */
export const deleteMultipleImagesFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    );
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Multiple image deletion error:', error);
    throw error;
  }
};

/**
 * Upload an image to Cloudinary (backend)
 * @param {Buffer} fileBuffer - The image file buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Response from Cloudinary
 */
export const uploadImageToCloudinary = async (fileBuffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'real-estate-listings',
          public_id: options.publicId,
          resource_type: 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Get image information from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>} - Image metadata from Cloudinary
 */
export const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    throw error;
  }
};

export default {
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary,
  uploadImageToCloudinary,
  getImageInfo,
};

