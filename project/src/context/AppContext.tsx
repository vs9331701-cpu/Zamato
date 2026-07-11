import { createContext, useContext, useState, ReactNode } from 'react';

export interface MenuItem {
  id: string;
  backendProductId?: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  distance: string;
  address: string;
  menu: MenuItem[];
  offers?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'preparing' | 'on-the-way' | 'delivered';
  date: string;
  address: string;
}

interface AppContextType {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  currentRestaurant: Restaurant | null;
  addToCart: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  placeOrder: (address: string) => Promise<any>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Paradise Biryani',
    image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Biryani', 'Hyderabadi', 'North Indian'],
    rating: 4.5,
    deliveryTime: '30-35 mins',
    priceRange: '₹300 for two',
    distance: '3.2 km',
    address: 'Banjara Hills, Hyderabad',
    offers: ['50% off up to ₹100', 'Free delivery on orders above ₹199'],
    menu: [
      {
        id: 'm1',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice layered with tender chicken pieces and spices',
        price: 320,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'm2',
        name: 'Mutton Biryani',
        description: 'Succulent mutton pieces cooked with fragrant rice',
        price: 380,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'm3',
        name: 'Veg Biryani',
        description: 'Garden fresh vegetables cooked with aromatic spices and rice',
        price: 220,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Biryani',
        isVeg: true,
      },
      {
        id: 'm4',
        name: 'Mirchi Ka Salan',
        description: 'Traditional Hyderabadi curry with green chilies',
        price: 180,
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Pizza Hut',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Pizza', 'Italian', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '25-30 mins',
    priceRange: '₹400 for two',
    distance: '2.1 km',
    address: 'Hitech City, Hyderabad',
    offers: ['Buy 1 Get 1 Free on Medium Pizzas'],
    menu: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic cheese pizza with tangy tomato sauce',
        price: 299,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pizza',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Loaded with spicy pepperoni and mozzarella',
        price: 399,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pizza',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'p3',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 149,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
      {
        id: 'p4',
        name: 'Pasta Alfredo',
        description: 'Creamy white sauce pasta with vegetables',
        price: 249,
        image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Pasta',
        isVeg: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Chai Point',
    image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Beverages', 'Snacks', 'Cafe'],
    rating: 4.6,
    deliveryTime: '15-20 mins',
    priceRange: '₹150 for two',
    distance: '1.5 km',
    address: 'Madhapur, Hyderabad',
    offers: ['₹50 off on first order'],
    menu: [
      {
        id: 'c1',
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 45,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chai',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'c2',
        name: 'Ginger Chai',
        description: 'Tea with fresh ginger',
        price: 49,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chai',
        isVeg: true,
      },
      {
        id: 'c3',
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes',
        price: 29,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Snacks',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'c4',
        name: 'Vada Pav',
        description: 'Mumbai style potato fritter in a bun',
        price: 45,
        image: 'https://images.pexels.com/photos/3014562/pexels-photo-3014562.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Snacks',
        isVeg: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Burger King',
    image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Burgers', 'American', 'Fast Food'],
    rating: 4.1,
    deliveryTime: '20-25 mins',
    priceRange: '₹350 for two',
    distance: '2.8 km',
    address: 'Kukatpally, Hyderabad',
    offers: ['Free Whopper on orders above ₹400'],
    menu: [
      {
        id: 'b1',
        name: 'Whopper',
        description: 'Flame-grilled beef patty with fresh vegetables',
        price: 199,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Burgers',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'b2',
        name: 'Veg Whopper',
        description: 'Crispy veggie patty with fresh veggies',
        price: 169,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Burgers',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'b3',
        name: 'Chicken Fries',
        description: 'Crispy chicken strips',
        price: 129,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: false,
      },
      {
        id: 'b4',
        name: 'Loaded Fries',
        description: 'Fries topped with cheese and jalapenos',
        price: 149,
        image: 'https://images.pexels.com/photos/1633565/pexels-photo-1633565.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Sides',
        isVeg: true,
      },
    ],
  },
  {
    id: '5',
    name: 'Chinese Wok',
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.3,
    deliveryTime: '35-40 mins',
    priceRange: '₹450 for two',
    distance: '4.1 km',
    address: 'Gachibowli, Hyderabad',
    offers: ['20% off on orders above ₹299'],
    menu: [
      {
        id: 'ch1',
        name: 'Hakka Noodles',
        description: 'Stir-fried noodles with vegetables',
        price: 180,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Noodles',
        isVeg: true,
      },
      {
        id: 'ch2',
        name: 'Chilli Chicken',
        description: 'Spicy chicken in Indo-Chinese style',
        price: 280,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Chicken',
        isVeg: false,
        isBestseller: true,
      },
      {
        id: 'ch3',
        name: 'Manchurian',
        description: 'Crispy veggie balls in tangy sauce',
        price: 200,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Appetizers',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'ch4',
        name: 'Fried Rice',
        description: 'Classic fried rice with choice of veggies or chicken',
        price: 175,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Rice',
        isVeg: true,
      },
    ],
  },
  {
    id: '6',
    name: 'Haldiram\'s',
    image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
    cuisine: ['North Indian', 'Mithai', 'Snacks'],
    rating: 4.4,
    deliveryTime: '40-45 mins',
    priceRange: '₹500 for two',
    distance: '5.2 km',
    address: 'Secunderabad, Hyderabad',
    offers: ['Free Gulab Jamun on orders above ₹500'],
    menu: [
      {
        id: 'h1',
        name: 'Chole Bhature',
        description: 'Spiced chickpeas with fluffy fried bread',
        price: 180,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'h2',
        name: 'Pav Bhaji',
        description: 'Spiced vegetable mash served with buttered bread',
        price: 150,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
      },
      {
        id: 'h3',
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 80,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Desserts',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'h4',
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked overnight',
        price: 220,
        image: 'https://images.pexels.com/photos/5408352/pexels-photo-5408352.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Main Course',
        isVeg: true,
      },
    ],
  },
];

const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    restaurantName: 'Paradise Biryani',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 320 },
      { name: 'Mirchi Ka Salan', quantity: 1, price: 180 },
    ],
    total: 820,
    status: 'delivered',
    date: '2026-07-06',
    address: '123 Main Street, Banjara Hills',
  },
  {
    id: 'ORD002',
    restaurantName: 'Pizza Hut',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 299 },
      { name: 'Garlic Bread', quantity: 2, price: 149 },
    ],
    total: 597,
    status: 'on-the-way',
    date: '2026-07-08',
    address: '456 Park Avenue, Hitech City',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

  const API_URL = 'http://localhost:8001/api';

  const addToCart = (item: MenuItem, restaurantId: string, restaurantName: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1, restaurantId, restaurantName }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => setCart([]);

  const getProductIdFromMenuItem = (menuItem: MenuItem) => {
    if (typeof menuItem.backendProductId === 'number') return menuItem.backendProductId;
    const match = String(menuItem.id).match(/(\d+)$/);
    return match ? Number(match[1]) : 0;
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const isFavorite = (restaurantId: string) => favorites.includes(restaurantId);

  const placeOrder = async (address: string) => {
    if (cart.length === 0) return;

    const payload = {
      items: cart.map((ci) => ({
        productId: getProductIdFromMenuItem(ci.menuItem),
        quantity: ci.quantity,
      })),
      address,
      paymentMode: 'ONLINE',
      deliveryFee: 40,
      discount: 0,
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to place order');
    }

    const newOrder: Order = {
      id: data.id,
      restaurantName: data.restaurantName,
      items: data.items,
      total: data.total,
      status: data.status,
      date: data.date,
      address: data.address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    if (!data.payment) {
      clearCart();
    }
    return data;
  };

  const getCartTotal = () =>
    cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);

  const getCartItemCount = () =>
    cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        orders,
        currentRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        setCurrentRestaurant,
        placeOrder,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { sampleRestaurants };
