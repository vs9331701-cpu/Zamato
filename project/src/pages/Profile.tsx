import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CreditCard, Heart, Package, Bell, LogOut, ChevronRight, Camera } from 'lucide-react';

const getInitials = (name?: string) => {
  if (!name) return 'JD';

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

export default function Profile({ user, onLogout }: { user: any | null; onLogout: () => void }) {
  const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
  const profile = {
    name: storedUser?.name || 'Zamato User',
    email: storedUser?.email || 'No email added',
    phone: storedUser?.mobile || 'No mobile added',
    image: storedUser?.image ? `http://localhost:8001${storedUser.image}` : '',
    addresses: [
      {
        id: 1,
        type: 'Home',
        address: '123 Main Street, Banjara Hills, Hyderabad',
      },
      {
        id: 2,
        type: 'Work',
        address: '456 Tech Park, Hitech City, Hyderabad',
      },
    ],
  };

  const initials = getInitials(profile.name);

  const menuItems = [
    { icon: Heart, label: 'Favorites', href: '/favorites', count: 4 },
    { icon: Package, label: 'Order History', href: '/orders', count: 2 },
    { icon: MapPin, label: 'Saved Addresses', href: '#', count: 2 },
    { icon: CreditCard, label: 'Payment Methods', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center overflow-hidden">
                {profile.image ? (
                  <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">{initials}</span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <Mail className="w-4 h-4 mr-1" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count && (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm font-medium">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Referral Card */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Invite & Earn</h3>
              <p className="text-amber-100 text-sm">
                Get ₹200 for every friend who orders using your referral code
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold">
                JOHN200
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Saved Addresses</h3>
            <button className="text-red-500 font-medium hover:text-red-600">Add New</button>
          </div>
          <div className="space-y-3">
            {profile.addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:border-red-500 transition-colors cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-900">{addr.type}</span>
                  <p className="text-gray-500 text-sm">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-white text-red-500 py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors font-semibold">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Zomato Clone © 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
}
