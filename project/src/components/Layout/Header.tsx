import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const location = useLocation();
  const { getCartItemCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartItemCount();
  const isHome = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHome ? 'bg-transparent absolute w-full' : 'bg-white shadow-md text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className={`text-xl font-bold ${isHome ? 'text-white' : 'text-gray-900'}`}>
              Zomato
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isHome ? 'text-black hover:text-gray-200' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`font-medium transition-colors flex items-center space-x-1 ${
                isHome ? 'text-black hover:text-gray-200' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/favorites"
              className={`font-medium transition-colors flex items-center space-x-1 ${
                isHome ? 'text-black hover:text-gray-200' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
            </Link>
            <Link
              to="/orders"
              className={`font-medium transition-colors ${
                isHome ? 'text-black hover:text-gray-200' : 'text-gray-700 hover:text-red-500'
              }`}
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className={`relative p-2 rounded-full transition-colors ${
                isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className={`w-6 h-6 ${isHome ? 'text-white' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className={`p-2 rounded-full transition-colors ${
                isHome ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <User className={`w-6 h-6 ${isHome ? 'text-white' : 'text-gray-700'}`} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                isHome ? 'text-white' : 'text-gray-700'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              Search
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              Favorites
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
            >
              Orders
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
