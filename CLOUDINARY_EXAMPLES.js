// ============================================================================
// CLOUDINARY INTEGRATION - USAGE EXAMPLES
// ============================================================================

// Import the utilities
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary,
  getOptimizedImageUrl,
  CLOUDINARY_CONFIG,
} from '@/utils/cloudinary';

// ============================================================================
// EXAMPLE 1: Upload Single Image (Avatar/Profile Picture)
// ============================================================================
async function uploadUserAvatar(file) {
  try {
    console.log('Uploading avatar...');
    const secureUrl = await uploadImageToCloudinary(file, {
      folder: 'real-estate-avatars',
      public_id: `user-${Date.now()}`,
    });
    
    console.log('Avatar uploaded successfully:', secureUrl);
    return secureUrl;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    throw error;
  }
}

// Usage:
// const fileInput = document.getElementById('avatarInput');
// fileInput.addEventListener('change', async (e) => {
//   const url = await uploadUserAvatar(e.target.files[0]);
//   // Update user profile with the URL
// });

// ============================================================================
// EXAMPLE 2: Upload Multiple Images (Listing Images)
// ============================================================================
async function uploadListingImages(fileList) {
  try {
    console.log(`Uploading ${fileList.length} images...`);
    
    const imageUrls = await uploadMultipleImagesToCloudinary(fileList, {
      folder: 'real-estate-listings',
    });
    
    console.log('All images uploaded:', imageUrls);
    return imageUrls;
  } catch (error) {
    console.error('Batch upload failed:', error);
    throw error;
  }
}

// Usage in CreateListing component:
// const handleImageSubmit = async (e) => {
//   const files = fileInputRef.current.files;
//   try {
//     const urls = await uploadListingImages(files);
//     setFormData(prev => ({
//       ...prev,
//       imageUrls: [...prev.imageUrls, ...urls]
//     }));
//   } catch (err) {
//     setImageUploadError(err.message);
//   }
// };

// ============================================================================
// EXAMPLE 3: Get Optimized Image URL
// ============================================================================
function getListingImageUrl(originalUrl) {
  // Get optimized image for listing cards (500x500)
  return getOptimizedImageUrl(originalUrl, {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

// Usage:
// const optimizedUrl = getListingImageUrl(listing.imageUrls[0]);
// <img src={optimizedUrl} alt="listing" />

// ============================================================================
// EXAMPLE 4: Delete Image (from Backend)
// ============================================================================
async function deleteListingImage(publicId) {
  try {
    console.log('Deleting image:', publicId);
    const result = await deleteImageFromCloudinary(publicId);
    console.log('Image deleted:', result);
    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}

// Usage:
// <button onClick={() => deleteListingImage(imagePublicId)}>
//   Delete Image
// </button>

// ============================================================================
// EXAMPLE 5: Complete Listing Creation Flow
// ============================================================================
async function createListingWithImages(listingData, imageFiles) {
  try {
    // Step 1: Upload images to Cloudinary
    console.log('Step 1: Uploading images...');
    const imageUrls = await uploadMultipleImagesToCloudinary(imageFiles, {
      folder: 'real-estate-listings',
    });
    console.log('✓ Images uploaded:', imageUrls);

    // Step 2: Prepare listing data with image URLs
    console.log('Step 2: Preparing listing data...');
    const completeListingData = {
      ...listingData,
      imageUrls,
    };

    // Step 3: Send to backend
    console.log('Step 3: Creating listing in database...');
    const response = await fetch('/api/listing/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeListingData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create listing');
    }

    console.log('✓ Listing created successfully:', result);
    return result;
  } catch (error) {
    console.error('✗ Listing creation failed:', error);
    throw error;
  }
}

// Usage:
// const listingData = {
//   name: 'Beautiful 3BHK Apartment',
//   description: 'Spacious apartment with modern amenities',
//   address: '123 Main St, City',
//   regularPrice: 2000000,
//   discountPrice: 1800000,
//   bedrooms: 3,
//   bathrooms: 2,
//   furnished: true,
//   parking: true,
//   type: 'sale',
//   offer: true,
// };
//
// const files = fileInputRef.current.files;
// const listing = await createListingWithImages(listingData, files);

// ============================================================================
// EXAMPLE 6: Search and Filter Listings
// ============================================================================
async function searchListings(filters) {
  try {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.type) params.append('type', filters.type);
    if (filters.parking) params.append('parking', true);
    if (filters.furnished) params.append('furnished', true);
    if (filters.offer) params.append('offer', true);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`/api/listing/get?${params}`);
    const listings = await response.json();
    
    console.log('Search results:', listings);
    return listings;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Usage:
// const results = await searchListings({
//   type: 'sale',
//   searchTerm: 'apartment',
//   parking: true,
//   sort: 'regularPrice',
//   order: 'asc',
//   limit: 10
// });

// ============================================================================
// EXAMPLE 7: Display Listings with Enhanced UI
// ============================================================================
function DisplayListingsExample({ listings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-gray-200">
            <img
              src={listing.imageUrls[0]}
              alt={listing.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
            
            {/* Type Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                listing.type === 'sale' 
                  ? 'bg-blue-500' 
                  : 'bg-green-500'
              }`}>
                {listing.type.toUpperCase()}
              </span>
            </div>

            {/* Offer Badge */}
            {listing.offer && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                OFFER
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {listing.name}
            </h3>
            
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {listing.description}
            </p>
            
            {/* Price */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ₹{listing.discountPrice || listing.regularPrice}
              </span>
              {listing.offer && (
                <span className="text-sm line-through text-gray-500">
                  ₹{listing.regularPrice}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="mt-3 flex gap-4 text-sm text-gray-700">
              <div>🛏️ {listing.bedrooms} Beds</div>
              <div>🚿 {listing.bathrooms} Baths</div>
            </div>

            {/* Amenities */}
            <div className="mt-3 flex gap-2 flex-wrap">
              {listing.parking && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  🅿️ Parking
                </span>
              )}
              {listing.furnished && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  🛋️ Furnished
                </span>
              )}
            </div>

            {/* Link to detail */}
            <a 
              href={`/listing/${listing._id}`}
              className="mt-4 block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Error Handling Best Practices
// ============================================================================
async function uploadWithErrorHandling(file) {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file selected');
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
    }

    // Upload
    console.log('Uploading...');
    const url = await uploadImageToCloudinary(file);
    console.log('✓ Upload successful:', url);
    return url;

  } catch (error) {
    console.error('✗ Upload error:', error.message);
    
    // Display user-friendly error
    if (error.message.includes('10MB')) {
      return { error: 'Please select a smaller image (max 10MB)' };
    } else if (error.message.includes('Invalid file')) {
      return { error: 'Please select a valid image file' };
    } else {
      return { error: 'Upload failed. Please try again.' };
    }
  }
}

// ============================================================================
// CLOUDINARY CONFIG - View Current Settings
// ============================================================================
console.log('Cloudinary Configuration:');
console.log('Cloud Name:', CLOUDINARY_CONFIG.CLOUD_NAME);
console.log('API Key:', CLOUDINARY_CONFIG.API_KEY);
console.log('Upload Preset:', CLOUDINARY_CONFIG.UPLOAD_PRESET);

// ============================================================================
// Export for use in components
// ============================================================================
export {
  uploadUserAvatar,
  uploadListingImages,
  getListingImageUrl,
  deleteListingImage,
  createListingWithImages,
  searchListings,
  DisplayListingsExample,
  uploadWithErrorHandling,
};
