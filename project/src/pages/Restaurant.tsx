import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Heart, ChevronLeft, Share2 } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import { Restaurant as RestaurantType, sampleRestaurants, useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { fetchRestaurants, restaurantsToList } from '../lib/api';

export default function Restaurant() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite, cart } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [restaurants, setRestaurants] = useState<RestaurantType[]>(sampleRestaurants);

  useEffect(() => {
    async function loadBackendMenu() {
      const apiRestaurants = await fetchRestaurants();
      const backendRestaurants = restaurantsToList(apiRestaurants);
      setRestaurants(backendRestaurants.length > 0 ? [...backendRestaurants, ...sampleRestaurants] : sampleRestaurants);
    }

    loadBackendMenu().catch(() => setRestaurants(sampleRestaurants));
  }, []);

  const restaurant = restaurants.find((r) => String(r.id) === String(id));

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
          <Link to="/" className="text-red-500 hover:text-red-600 font-medium">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(restaurant.id);
  const categories = ['All', ...new Set(restaurant.menu.map((item) => item.category))];

  const filteredMenu =
    activeCategory === 'All'
      ? restaurant.menu
      : restaurant.menu.filter((item) => item.category === activeCategory);

  const currentRestaurantItems = cart.filter((item) => item.restaurantId === restaurant.id);
  const currentRestaurantTotal = currentRestaurantItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link
            to="/"
            className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className={`p-2 rounded-full transition-colors ${
                favorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
            <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-200">{restaurant.cuisine.join(', ')}</p>
          <div className="flex items-center gap-4 mt-4 text-sm md:text-base">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded font-semibold">
              <Star className="w-4 h-4 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
            <span className="text-gray-300">{restaurant.deliveryTime}</span>
            <span className="text-gray-300">{restaurant.priceRange}</span>
          </div>
        </div>
      </div>

      {/* Offers */}
      {restaurant.offers && restaurant.offers.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-3">
              {restaurant.offers.map((offer, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {offer}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Info */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{restaurant.address}</span>
            <span className="mx-3 text-gray-300">|</span>
            <span>{restaurant.distance}</span>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="bg-white border-b sticky top-28 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
        <div className="space-y-4">
          {filteredMenu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          ))}
        </div>
      </div>

      {/* Cart Footer */}
      {currentRestaurantItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <Link
              to="/cart"
              className="flex items-center justify-between bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors"
            >
              <div className="flex items-center">
                <span className="bg-white text-red-500 px-3 py-1 rounded font-bold mr-3">
                  {currentRestaurantItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
                <span className="font-semibold">View Cart</span>
              </div>
              <span className="font-bold">₹{currentRestaurantTotal}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
