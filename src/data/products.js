// Import gambar dari folder assets/products
import androidImg from '../assets/products/Android.jpeg';
import laptopImg from '../assets/products/Laptop.jpeg';
import smartwatchImg from '../assets/products/smartwatch.jpeg';
import sepatuImg from '../assets/products/sepatu.jpeg';
import kemejaImg from '../assets/products/kemeja.jpeg';

export const products = [
  {
    id: 1,
    name: "Smartphone Android Terbaru",
    price: 2999000,
    originalPrice: 3999000,
    discount: 25,
    rating: 4.8,
    reviews: 1234,
    sold: "1.2k",
    location: "Jakarta Pusat",
    image: androidImg,
    badge: { text: "-25%", color: "bg-red-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Gratis Ongkir"
  },
  {
    id: 2,
    name: "Kaos Polos Premium Cotton",
    price: 89000,
    originalPrice: null,
    discount: 0,
    rating: 4.9,
    reviews: 5623,
    sold: "5k+",
    location: "Bandung",
    image: kemejaImg,
    badge: { text: "Best Seller", color: "bg-yellow-400 text-gray-900" },
    category_id: 2,
    category: "Fashion",
    condition: "Baru",
    shipping: "Same Day"
  },
  {
    id: 3,
    name: "Laptop Gaming RTX Series",
    price: 15999000,
    originalPrice: null,
    discount: 0,
    rating: 5.0,
    reviews: 432,
    sold: "324",
    location: "Surabaya",
    image: laptopImg,
    badge: { text: "New", color: "bg-blue-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Gratis Ongkir"
  },
  {
    id: 4,
    name: "Smartwatch Sport Edition",
    price: 899000,
    originalPrice: 1499000,
    discount: 40,
    rating: 4.7,
    reviews: 892,
    sold: "850",
    location: "Semarang",
    image: smartwatchImg,
    badge: { text: "Flash Sale", color: "bg-purple-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Regular"
  },
  {
    id: 5,
    name: "Sepatu Sneakers Original",
    price: 550000,
    originalPrice: 750000,
    discount: 27,
    rating: 4.6,
    reviews: 1567,
    sold: "2.3k",
    location: "Jakarta Selatan",
    image: sepatuImg,
    badge: { text: "-27%", color: "bg-red-500" },
    category_id: 2,
    category: "Fashion",
    condition: "Baru",
    shipping: "Gratis Ongkir"
  },
  {
    id: 6,
    name: "Headphone Bluetooth Wireless",
    price: 275000,
    originalPrice: null,
    discount: 0,
    rating: 4.8,
    reviews: 2341,
    sold: "3.1k",
    location: "Yogyakarta",
    image: androidImg,
    badge: { text: "Popular", color: "bg-green-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Same Day"
  },
  {
    id: 7,
    name: "Tas Ransel Travel Premium",
    price: 425000,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviews: 987,
    sold: "1.5k",
    location: "Malang",
    image: kemejaImg,
    badge: { text: "Official Store", color: "bg-blue-600" },
    category_id: 2,
    category: "Fashion",
    condition: "Baru",
    shipping: "Instant"
  },
  {
    id: 8,
    name: "Mouse Gaming RGB Mechanical",
    price: 189000,
    originalPrice: 299000,
    discount: 37,
    rating: 4.9,
    reviews: 3421,
    sold: "4.8k",
    location: "Surabaya",
    image: laptopImg,
    badge: { text: "-37%", color: "bg-red-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Gratis Ongkir"
  },
  {
    id: 9,
    name: "Kacamata Hitam UV Protection",
    price: 125000,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviews: 678,
    sold: "892",
    location: "Bali",
    image: sepatuImg,
    badge: { text: "Trending", color: "bg-pink-500" },
    category_id: 2,
    category: "Fashion",
    condition: "Baru",
    shipping: "Regular"
  },
  {
    id: 10,
    name: "Power Bank 20000mAh Fast Charging",
    price: 159000,
    originalPrice: 250000,
    discount: 36,
    rating: 4.8,
    reviews: 1987,
    sold: "2.7k",
    location: "Jakarta Barat",
    image: smartwatchImg,
    badge: { text: "Flash Sale", color: "bg-purple-500" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Same Day"
  },
  {
    id: 11,
    name: "Jam Tangan Digital Sport",
    price: 320000,
    originalPrice: null,
    discount: 0,
    rating: 4.6,
    reviews: 543,
    sold: "678",
    location: "Medan",
    image: smartwatchImg,
    badge: { text: "New Arrival", color: "bg-indigo-500" },
    category_id: 2,
    category: "Fashion",
    condition: "Baru",
    shipping: "Gratis Ongkir"
  },
  {
    id: 12,
    name: "Keyboard Mechanical RGB",
    price: 650000,
    originalPrice: 950000,
    discount: 32,
    rating: 4.9,
    reviews: 2156,
    sold: "1.9k",
    location: "Bandung",
    image: laptopImg,
    badge: { text: "Best Choice", color: "bg-yellow-400 text-gray-900" },
    category_id: 1,
    category: "Elektronik",
    condition: "Baru",
    shipping: "Instant"
  }
];

// Helper function to format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Helper function to get gradient color based on category
export const getCategoryGradient = (category) => {
  const gradients = {
    'Elektronik': 'from-blue-100 to-blue-200',
    'Fashion': 'from-purple-100 to-purple-200',
    'Furniture': 'from-green-100 to-green-200',
    'Olahraga': 'from-orange-100 to-orange-200',
    'Makanan': 'from-pink-100 to-pink-200'
  };
  return gradients[category] || 'from-gray-100 to-gray-200';
};

// Get featured products (limit to specific number)
export const getFeaturedProducts = (limit = 8) => {
  return products.slice(0, limit);
};

// Filter products by category
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Get products with discount
export const getDiscountedProducts = () => {
  return products.filter(product => product.discount > 0);
};
