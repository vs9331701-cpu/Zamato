import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { sampleRestaurants, useApp } from '../context/AppContext';

export default function Favorites() {
  const { favorites } = useApp();
  const favoriteRestaurants = sampleRestaurants.filter((r) => favorites.includes(r.id));

  if (favoriteRestaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">
            Start exploring and save your favorite restaurants for quick access
          </p>
          <Link
            to="/search"
            className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}
