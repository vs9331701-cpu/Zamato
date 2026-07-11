import { MenuItem, Restaurant } from '../context/AppContext';

const API_URL = 'http://localhost:8001/api';

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestseller: boolean;
  active: boolean;
};

type ApiCategory = {
  id: number;
  name: string;
  image: string;
  items: number;
  active: boolean;
};

type ApiRestaurant = {
  id: number;
  restaurantName: string;
  ownerName: string;
  email: string;
  mobile: string;
  cuisine: string;
  image: string;
  address: string;
  city: string;
  pincode: string;
  opensAt: string;
  closesAt: string;
  active: boolean;
  products: ApiProduct[];
};

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Unable to load categories');
  return response.json() as Promise<ApiCategory[]>;
}

export async function fetchRestaurants() {
  const response = await fetch(`${API_URL}/vendors/restaurants`);
  if (!response.ok) throw new Error('Unable to load restaurants');
  return response.json() as Promise<ApiRestaurant[]>;
}

export function restaurantsToList(apiRestaurants: ApiRestaurant[]): Restaurant[] {
  return apiRestaurants.map((vendor) => {
    const menu: MenuItem[] = (vendor.products || []).map((product) => ({
      id: `vendor-${vendor.id}-product-${product.id}`,
      backendProductId: product.id,
      name: product.name,
      description: product.description || 'Freshly prepared by the restaurant',
      price: product.price,
      image: product.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: product.category || 'Featured',
      isVeg: product.isVeg,
      isBestseller: product.isBestseller,
    }));

    const cuisines = vendor.cuisine
      ? vendor.cuisine.split(',').map((item) => item.trim()).filter(Boolean)
      : ['Featured'];

    return {
      id: String(vendor.id),
      name: vendor.restaurantName,
      image: vendor.image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
      cuisine: cuisines,
      rating: 4.4,
      deliveryTime: '25-35 mins',
      priceRange: '₹300 for two',
      distance: '2.5 km',
      address: vendor.address || vendor.city || 'Live from backend',
      offers: menu.some((item) => item.isBestseller) ? ['Bestsellers available'] : ['Fresh dishes'],
      menu,
    };
  });
}
