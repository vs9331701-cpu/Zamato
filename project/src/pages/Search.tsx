import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { Restaurant, sampleRestaurants } from '../context/AppContext';
import { fetchRestaurants, restaurantsToList } from '../lib/api';

const filterOptions = [
  { id: 'rating4', label: 'Rating 4.0+' },
  { id: 'fastDelivery', label: 'Fast Delivery' },
  { id: 'veg', label: 'Pure Veg' },
  { id: 'offers', label: 'Offers' },
  { id: 'price300', label: '₹300-Rs 400' },
];

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'deliveryTime', label: 'Delivery Time' },
  { id: 'rating', label: 'Rating' },
  { id: 'priceLowHigh', label: 'Cost: Low to High' },
  { id: 'priceHighLow', label: 'Cost: High to Low' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('category') || '');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    async function loadBackendMenu() {
      const apiRestaurants = await fetchRestaurants();
      const backendRestaurants = restaurantsToList(apiRestaurants);
      setRestaurants(backendRestaurants.length > 0 ? [...backendRestaurants, ...sampleRestaurants] : sampleRestaurants);
    }

    loadBackendMenu().catch(() => setRestaurants(sampleRestaurants));
  }, []);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setSearchParams({});
  };

  let filteredRestaurants = restaurants;

  // Apply search
  if (searchQuery) {
    filteredRestaurants = filteredRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.menu.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Apply filters
  if (activeFilters.includes('rating4')) {
    filteredRestaurants = filteredRestaurants.filter((r) => r.rating >= 4.0);
  }
  if (activeFilters.includes('fastDelivery')) {
    filteredRestaurants = filteredRestaurants.filter((r) => parseInt(r.deliveryTime) <= 25);
  }
  if (activeFilters.includes('veg')) {
    // For this demo, we'll skip the pure veg filter as restaurant data doesn't have this attribute
  }
  if (activeFilters.includes('offers')) {
    filteredRestaurants = filteredRestaurants.filter((r) => r.offers && r.offers.length > 0);
  }

  // Apply sort
  switch (activeSort) {
    case 'deliveryTime':
      filteredRestaurants = [...filteredRestaurants].sort(
        (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      );
      break;
    case 'rating':
      filteredRestaurants = [...filteredRestaurants].sort((a, b) => b.rating - a.rating);
      break;
    case 'priceLowHigh':
      filteredRestaurants = [...filteredRestaurants].sort(
        (a, b) => parseInt(a.priceRange.replace(/[^0-9]/g, '')) - parseInt(b.priceRange.replace(/[^0-9]/g, ''))
      );
      break;
    case 'priceHighLow':
      filteredRestaurants = [...filteredRestaurants].sort(
        (a, b) => parseInt(b.priceRange.replace(/[^0-9]/g, '')) - parseInt(a.priceRange.replace(/[^0-9]/g, ''))
      );
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisine or a dish"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full whitespace-nowrap hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                    activeFilters.includes(filter.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {(activeFilters.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : 'All Restaurants'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Sort by:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="border-none outline-none text-gray-700 font-medium bg-transparent cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No restaurants found</p>
            <button
              onClick={clearFilters}
              className="text-red-500 font-medium hover:text-red-600"
            >
              Clear all filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setActiveSort(option.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeSort === option.id
                          ? 'bg-red-50 text-red-500'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
