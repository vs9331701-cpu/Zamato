import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, MapPin, ChevronRight, Tag, Percent, Trash2 } from 'lucide-react';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cart, getCartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState('123 Main Street, Banjara Hills, Hyderabad');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  if (cart.length === 0 && !showOrderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            You can go to home page to view more restaurants
          </p>
          <Link
            to="/"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            See restaurants near you
          </Link>
        </div>
      </div>
    );
  }

  if (showOrderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 mb-6">
            Your order has been placed. You can track your order in the orders section.
          </p>
          <Link
            to="/orders"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const discount = appliedPromo ? 100 : 0;
  const total = subtotal + deliveryFee + taxes - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'ZOMATO100') {
      setAppliedPromo('ZOMATO100');
      setPromoCode('');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const paymentData = await placeOrder(address);
      if (paymentData?.payment) {
        navigate('/payment', { state: { paymentData, address } });
        return;
      }

      setShowOrderSuccess(true);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Unable to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="text-gray-500 text-sm">Delivery Address</p>
                  <p className="text-gray-900 font-medium">{address}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2">{cart[0].restaurantName}</p>
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItem key={item.menuItem.id} item={item} />
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-red-500" />
                Apply Promo Code
              </h3>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                  <span className="font-medium">₹100 discount applied!</span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Try ZOMATO100 for ₹100 off</p>
            </div>

            {/* Tip */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Percent className="w-5 h-5 mr-2 text-amber-500" />
                Add a tip for your delivery partner
              </h3>
              <div className="flex gap-2">
                {['₹10', '₹20', '₹50', '₹100'].map((tip) => (
                  <button
                    key={tip}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900 font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (5%)</span>
                  <span className="text-gray-900 font-medium">₹{taxes}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{total}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold mt-6 hover:bg-red-600 transition-colors"
              >
                Place Order
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to{' '}
                <Link to="/terms" className="text-red-500">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Delivery Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-red-500 resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
