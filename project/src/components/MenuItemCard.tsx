import { Plus, Minus, Star } from 'lucide-react';
import { MenuItem, useApp } from '../context/AppContext';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export default function MenuItemCard({ item, restaurantId, restaurantName }: MenuItemCardProps) {
  const { cart, addToCart, updateQuantity } = useApp();
  const cartItem = cart.find((ci) => ci.menuItem.id === item.id);

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.isBestseller && (
          <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
            Bestseller
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 border-2 rounded flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
              {item.isVeg && <div className="w-2 h-2 bg-green-600 rounded-full" />}
            </span>
            <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm font-medium">4.2</span>
            </span>
            <span className="text-gray-400 text-sm">(120 ratings)</span>
          </div>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-gray-900">₹{item.price}</span>
          {!cartItem ? (
            <button
              onClick={() => addToCart(item, restaurantId, restaurantName)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-green-500 text-white rounded-lg">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="p-2 hover:bg-green-600 rounded-l-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 font-semibold">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="p-2 hover:bg-green-600 rounded-r-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
