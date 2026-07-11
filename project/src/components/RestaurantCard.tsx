import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart } from 'lucide-react';
import { Restaurant, useApp } from '../context/AppContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(restaurant.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/restaurant/${restaurant.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {restaurant.offers && restaurant.offers.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {restaurant.offers[0]}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(restaurant.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              favorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/restaurant/${restaurant.id}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-red-500 transition-colors">
            {restaurant.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3">{restaurant.cuisine.join(', ')}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded font-semibold">
            <Star className="w-4 h-4 fill-current" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="text-gray-500">{restaurant.priceRange}</div>
        </div>

        <div className="flex items-center mt-3 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{restaurant.distance}</span>
        </div>
      </div>
    </div>
  );
}
