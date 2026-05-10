import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [rents, setRents] = useState([]);
  const [sales, setSales] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const resOffer = await fetch('/api/listing/get?offer=true&limit=4');
        const dataOffer = await resOffer.json();
        setOffers(dataOffer);

        const resRent = await fetch('/api/listing/get?type=rent&limit=4');
        const dataRent = await resRent.json();
        setRents(dataRent);

        const resSale = await fetch('/api/listing/get?type=sale&limit=4');
        const dataSale = await resSale.json();
        setSales(dataSale);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-8 md:p-16 lg:p-24 max-w-6xl mx-auto">
        <h1 className="text-slate-800 font-bold text-3xl lg:text-5xl leading-snug">
        🔍 Discover your dream home effortlessly! 🏡
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          🏠 Welcome to <span className="font-semibold text-blue-700">BUY SELL RENT</span> — your one-stop
          destination for real estate. Whether you're looking to buy 🛒, sell 💼, or rent 🔑, we've got you
          covered with thousands of verified listings.
          <br />
          ✨ Discover cozy apartments, luxury villas, and budget-friendly homes in just a few clicks.
          <br />
          💬 Start your journey today — simple, fast, and stress-free!
        </p>
      </div>

      {/* Swiper Carousel */}
      {offers.length > 0 && (
        <Swiper navigation className="h-[500px] w-full">
          {offers.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${listing.imageUrls[0]})` }}
              >
                {/* Overlay for optional text or darkening */}
                <div className="bg-black/30 h-full w-full flex items-center justify-center text-white text-2xl font-semibold">
                  {listing.name}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Listing Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12">
        {/* Offers */}
        {offers.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-700">🔥 Recent Offers</h2>
              <Link to="/search?offer=true" className="text-blue-600 text-sm hover:underline">
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offers.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rents.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-700">🏠 For Rent</h2>
              <Link to="/search?type=rent" className="text-blue-600 text-sm hover:underline">
                Show more rentals
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rents.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {sales.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-700">🏡 For Sale</h2>
              <Link to="/search?type=sale" className="text-blue-600 text-sm hover:underline">
                Show more homes for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {sales.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
