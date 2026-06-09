# Real Estate Listing Management - Setup Guide

## Overview
This setup includes complete integration for managing real estate listings with all property types (Sale, Rent) and Cloudinary image upload/management functionality.

## Cloudinary Configuration

### Credentials
- **Cloud Name**: `<your_cloud_name>`
- **API Key**: `<your_api_key>`
- **API Secret**: `<your_api_secret>`
- **Upload Preset**: `<your_unsigned_upload_preset>`

> ⚠️ Never commit real credentials. Rotate any keys or secrets that were previously exposed.

### Files Updated

#### 1. **Frontend Cloudinary Utility** (`client/src/utils/cloudinary.js`)
This file provides functions for image management:

```javascript
// Upload single image
import { uploadImageToCloudinary } from '@/utils/cloudinary';

const url = await uploadImageToCloudinary(file);

// Upload multiple images
import { uploadMultipleImagesToCloudinary } from '@/utils/cloudinary';

const urls = await uploadMultipleImagesToCloudinary(files, {
  folder: 'real-estate-listings'
});

// Get optimized URL
import { getOptimizedImageUrl } from '@/utils/cloudinary';

const optimized = getOptimizedImageUrl(imageUrl, {
  width: 500,
  height: 500,
  crop: 'fill',
  quality: 'auto'
});
```

#### 2. **Backend Cloudinary Utility** (`backend/utils/cloudinary.js`)
Backend utility for secure image operations:

```javascript
import { 
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
  getImageInfo 
} from '@/utils/cloudinary';

// Delete image
await deleteImageFromCloudinary(publicId);

// Delete multiple images
await deleteMultipleImagesFromCloudinary([publicId1, publicId2]);

// Get image info
const info = await getImageInfo(publicId);
```

#### 3. **ListingItem.jsx** (`client/src/components/ListingItem.jsx`)
Enhanced listing card component with:
- **Listing Type Badges**: Color-coded (Blue for Sale, Green for Rent)
- **Offer Indicator**: Red badge for discounted listings
- **Responsive Image**: Optimized display with fallback
- **Feature Icons**: Beds, baths, parking, furnished status
- **Price Display**: Shows discount with original price crossed out
- **Amenities**: Visual indicators for parking and furnished properties

Features:
- Hover effects for better UX
- Location display with map icon
- Bed/bath count with icons
- Amenity badges
- Responsive design (works on mobile and desktop)

#### 4. **CreateListing.jsx** (`client/src/pages/CreateListing.jsx`)
Updated to use the new Cloudinary utility:
- Cleaner image upload handling
- Better error management
- Folder organization (real-estate-listings)
- Support for up to 6 images per listing
- Drag and drop functionality support

## Environment Variables

### Frontend (`.env`)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
BASE_URL=http://localhost:5173
```

### Backend (`.env`)
```
MONGO=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
PORT=5002
```

### Required Variables (Quick Reference)

- Frontend required: `VITE_FIREBASE_API_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
- Backend required: `MONGO`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Listing Data Model

The listing model (`backend/models/listing.model.js`) supports:

```javascript
{
  name: String,                  // Property name
  description: String,           // Detailed description
  address: String,               // Location
  regularPrice: Number,          // Base price
  discountPrice: Number,         // Discounted price (if offer=true)
  bathrooms: Number,             // Number of bathrooms
  bedrooms: Number,              // Number of bedrooms
  furnished: Boolean,            // Is furnished?
  parking: Boolean,              // Has parking?
  type: String,                  // 'sale' or 'rent'
  offer: Boolean,                // Is on offer?
  imageUrls: Array,              // Cloudinary image URLs
  userRef: String,               // Reference to user who created it
  timestamps: true               // Created/Updated dates
}
```

## Usage Examples

### 1. Creating a Listing with Images
```javascript
// Navigate to /create-listing
// 1. Fill in property details
// 2. Select listing type (Sale/Rent)
// 3. Choose multiple images
// 4. Click "Upload" to upload to Cloudinary
// 5. Click "Create Listing"
```

### 2. Viewing All Listings
Listings are displayed on:
- **Home Page**: Featured listings with filters
- **Search Page**: Filtered by type, price, location, etc.
- **Profile Page**: User's own listings

### 3. Listing Types
- **Sale**: One-time purchase listings (blue badge)
- **Rent**: Monthly rental listings (green badge)

### 4. Special Features
- **Offer Badge**: Shows discount percentage on red badge
- **Amenities**: Visual indicators for furnished and parking
- **Price Display**: Original price shown as strikethrough if discounted
- **Image Optimization**: Automatic quality and format optimization

## Image Upload Process

1. **Select Images**: Choose up to 6 images from your device
2. **Upload to Cloudinary**: 
   - Images are uploaded with secure HTTPS
   - Organized in 'real-estate-listings' folder
   - Auto-optimized for web
3. **Secure URLs**: Get permanent CloudFront URLs for storage
4. **Display**: Images are cached and optimized on delivery

## API Endpoints (Recommended)

### POST `/api/listing/create`
Create a new listing
```json
{
  "name": "Beautiful 3BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "address": "123 Main St, City",
  "regularPrice": 2000000,
  "discountPrice": 1800000,
  "bedrooms": 3,
  "bathrooms": 2,
  "furnished": true,
  "parking": true,
  "type": "sale",
  "offer": true,
  "imageUrls": ["https://res.cloudinary.com/..."],
  "userRef": "user_id"
}
```

### DELETE `/api/listing/:id`
Delete a listing (also deletes images from Cloudinary)

### PUT `/api/listing/:id`
Update a listing

### GET `/api/listing/:id`
Get listing details

### GET `/api/listing/get`
Get listings with filters:
- `type`: 'sale' or 'rent'
- `searchTerm`: Search in name/description/address
- `sort`: 'created' or 'regularPrice'
- `order`: 'desc' or 'asc'
- `limit`: Number of results

## Best Practices

1. **Images**: Always upload at least one image per listing
2. **Pricing**: Ensure discount price is lower than regular price
3. **Description**: Keep it detailed (min 10 chars)
4. **Type**: Choose either Sale or Rent, not both
5. **Validation**: All required fields must be filled

## Troubleshooting

### Images Not Uploading
- Check internet connection
- Verify image format (JPEG, PNG, GIF, WebP)
- Check file size (max varies, usually < 100MB)
- Ensure Cloudinary preset is correct

### Listings Not Displaying
- Check database connection
- Verify user ID is correct
- Check image URLs are accessible
- Clear browser cache

### Price Display Issues
- Ensure regularPrice > discountPrice when offer=true
- Check number format (no letters)
- Verify decimal places

## Support
For image upload issues, check Cloudinary Dashboard at:
https://cloudinary.com/console/

For API issues, check server logs and ensure all endpoints are properly configured.
