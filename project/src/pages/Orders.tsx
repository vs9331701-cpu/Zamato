import { Link } from 'react-router-dom';
import { Package, ChefHat, Truck, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const statusConfig = {
  preparing: {
    icon: ChefHat,
    label: 'Preparing',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  'on-the-way': {
    icon: Truck,
    label: 'On the Way',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  delivered: {
    icon: CheckCircle,
    label: 'Delivered',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
};

export default function Orders() {
  const { orders } = useApp();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't placed any orders. Start ordering your favorite food!
          </p>
          <Link
            to="/"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{order.restaurantName}</h3>
                    <p className="text-gray-500 text-sm">{order.id}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-gray-600 text-sm">
                      {item.quantity}x {item.name}
                      {index < order.items.length - 1 && <span className="mx-1">•</span>}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">Total: ₹{order.total}</span>
                  </div>
                </div>

                {order.status !== 'delivered' && (
                  <div className="relative pt-2">
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-1 bg-red-500 rounded-full transition-all duration-500"
                        style={{
                          width:
                            order.status === 'preparing'
                              ? '33%'
                              : order.status === 'on-the-way'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-4 pt-4 border-t">
                  <button className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors text-gray-700">
                    View Details
                  </button>
                  <button className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                    Reorder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
