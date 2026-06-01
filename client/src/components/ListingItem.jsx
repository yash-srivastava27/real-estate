import { Link } from 'react-router-dom';
import { MdLocationOn, MdBed, MdBathtub, MdLocalParking } from 'react-icons/md';
import { FaCouch, FaTag } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  const listingTypeColor = {
    sale: 'bg-blue-100 text-blue-800',
    rent: 'bg-green-100 text-green-800',
  };

  const defaultImage =
    'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg';

  return (
    <div className='bg-white shadow-md hover:shadow-xl transition-all overflow-hidden rounded-lg w-full sm:w-80 hover:scale-105 duration-300'>
      <Link to={`/listing/${listing._id}`}>
        {/* Image Container */}
        <div className='relative'>
          <img
            src={listing.imageUrls[0] || defaultImage}
            alt='listing cover'
            className='h-80 sm:h-56 w-full object-cover hover:scale-105 transition-transform duration-300'
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          {/* Type Badge */}
          <div className='absolute top-3 right-3'>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                listingTypeColor[listing.type] ||
                'bg-slate-100 text-slate-800'
              }`}
            >
              {listing.type}
            </span>
          </div>

          {/* Offer Badge */}
          {listing.offer && (
            <div className='absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
              <FaTag size={12} />
              OFFER
            </div>
          )}
        </div>

        {/* Details Container */}
        <div className='p-4 flex flex-col gap-3 w-full'>
          {/* Title */}
          <p className='truncate text-lg font-semibold text-slate-800'>
            {listing.name}
          </p>

          {/* Location */}
          <div className='flex items-center gap-2'>
            <MdLocationOn className='h-5 w-5 text-green-600 shrink-0' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>

          {/* Price Section */}
          <div className='py-2 border-t border-b border-gray-200'>
            {listing.offer ? (
              <div className='flex items-center gap-2'>
                <p className='text-slate-700 font-bold text-lg'>
                  ₹{listing.discountPrice.toLocaleString('en-US')}
                </p>
                <p className='text-gray-400 line-through text-sm'>
                  ₹{listing.regularPrice.toLocaleString('en-US')}
                </p>
              </div>
            ) : (
              <p className='text-slate-700 font-bold text-lg'>
                ₹{listing.regularPrice.toLocaleString('en-US')}
              </p>
            )}
            {listing.type === 'rent' && (
              <p className='text-gray-600 text-xs mt-1'>/ month</p>
            )}
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-2 gap-3'>
            {/* Bedrooms */}
            <div className='flex items-center gap-2 text-slate-700'>
              <MdBed className='h-5 w-5 text-slate-600' />
              <div>
                <p className='text-xs text-gray-600'>Bedrooms</p>
                <p className='font-bold text-sm'>
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} Beds`
                    : `${listing.bedrooms} Bed`}
                </p>
              </div>
            </div>

            {/* Bathrooms */}
            <div className='flex items-center gap-2 text-slate-700'>
              <MdBathtub className='h-5 w-5 text-slate-600' />
              <div>
                <p className='text-xs text-gray-600'>Bathrooms</p>
                <p className='font-bold text-sm'>
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : `${listing.bathrooms} Bath`}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className='flex gap-2 flex-wrap'>
            {listing.furnished && (
              <div className='flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs font-semibold text-slate-700'>
                <FaCouch size={12} />
                Furnished
              </div>
            )}
            {listing.parking && (
              <div className='flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs font-semibold text-slate-700'>
                <MdLocalParking size={14} />
                Parking
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}