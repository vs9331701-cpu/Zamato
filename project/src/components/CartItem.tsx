import { Plus, Minus, Trash2, Leaf } from 'lucide-react';
import { CartItem as CartItemType, useApp } from '../context/AppContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useApp();

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
      <img
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 border-2 rounded flex items-center justify-center ${item.menuItem.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            {item.menuItem.isVeg && <Leaf className="w-2 h-2 text-green-600" />}
          </span>
          <h4 className="font-semibold text-gray-900">{item.menuItem.name}</h4>
        </div>
        <p className="text-gray-500 text-sm mt-1">{item.restaurantName}</p>
        <p className="font-bold text-red-500 mt-1">₹{item.menuItem.price}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
          <button
            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-3 font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.menuItem.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
