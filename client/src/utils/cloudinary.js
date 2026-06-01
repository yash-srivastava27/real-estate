// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'difjotugk', // Default from env
  API_KEY: '639734316234361',
  API_SECRET: 'hMnwyblIiekkvkBlk2QVfkc_fKE',
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'real-estate',
};

/**
 * Upload a single image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Additional options for upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.public_id) {
      formData.append('public_id', options.public_id);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Image upload failed');
    }

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('No secure URL returned from Cloudinary');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files to upload
 * @param {Object} options - Additional options for upload
 * @returns {Promise<string[]>} - Array of secure URLs of uploaded images
 */
export const uploadMultipleImagesToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadImageToCloudinary(file, options)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary (requires backend support)
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Response from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Image deletion failed');
    }

    return data;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

/**
 * Get an optimized image URL from Cloudinary
 * @param {string} imageUrl - The original image URL
 * @param {Object} transformations - Cloudinary transformation parameters
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, transformations = {}) => {
  if (!imageUrl) return '';
  
  // Extract public ID from URL
  const urlParts = imageUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const publicId = fileName.split('.')[0];
  
  // Default transformations
  const defaultTransforms = {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  };

  const finalTransforms = { ...defaultTransforms, ...transformations };

  // Build transformation string
  const transformString = Object.entries(finalTransforms)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}.jpg`;
};

export default {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary,
  getOptimizedImageUrl,
  CLOUDINARY_CONFIG,
};
