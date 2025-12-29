/**
 * Contoh Penggunaan Image Helper
 * File ini berisi berbagai contoh cara menggunakan imageHelper.js
 */

import { 
  getImageUrl, 
  getProductImageUrl, 
  getUserAvatarUrl, 
  getStoreLogoUrl,
  getCategoryIconUrl,
  handleImageError,
  getImageUrls,
  getPrimaryImageUrl
} from '../utils/imageHelper';

// ============================================
// CONTOH 1: Product Card Component
// ============================================
export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img 
        src={getProductImageUrl(product.images?.[0]?.image_url)} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
        onError={(e) => handleImageError(e)}
      />
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-gray-600">{product.price}</p>
    </div>
  );
}

// ============================================
// CONTOH 2: Product Gallery dengan Multiple Images
// ============================================
export function ProductGallery({ product }) {
  const imageUrls = getImageUrls(product.images);
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {imageUrls.map((url, index) => (
        <img 
          key={index}
          src={url} 
          alt={`${product.name} - ${index + 1}`}
          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
          onError={(e) => handleImageError(e)}
        />
      ))}
    </div>
  );
}

// ============================================
// CONTOH 3: User Avatar
// ============================================
export function UserAvatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  return (
    <img 
      src={getUserAvatarUrl(user.avatar)} 
      alt={user.name}
      className={`${sizeClasses[size]} rounded-full border-2 border-gray-200`}
      onError={(e) => handleImageError(e, `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
    />
  );
}

// ============================================
// CONTOH 4: Store Card
// ============================================
export function StoreCard({ store }) {
  return (
    <div className="store-card p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <img 
          src={getStoreLogoUrl(store.logo)} 
          alt={store.name}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e) => handleImageError(e)}
        />
        <div>
          <h3 className="font-bold">{store.name}</h3>
          <p className="text-sm text-gray-500">⭐ {store.rating}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTOH 5: Category List
// ============================================
export function CategoryList({ categories }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="text-center">
          <img 
            src={getCategoryIconUrl(category.icon)} 
            alt={category.name}
            className="w-16 h-16 mx-auto mb-2"
            onError={(e) => handleImageError(e)}
          />
          <p className="text-sm">{category.name}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// CONTOH 6: Product dengan Primary Image
// ============================================
export function ProductHero({ product }) {
  const primaryImageUrl = getPrimaryImageUrl(product.images);
  
  return (
    <div className="flex gap-6">
      {/* Main Image */}
      <div className="flex-1">
        <img 
          src={primaryImageUrl} 
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl"
          onError={(e) => handleImageError(e)}
        />
      </div>
      
      {/* Thumbnails */}
      <div className="w-24 space-y-2">
        {getImageUrls(product.images).map((url, index) => (
          <img 
            key={index}
            src={url} 
            alt={`${product.name} thumbnail ${index + 1}`}
            className="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
            onError={(e) => handleImageError(e)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// CONTOH 7: Custom Fallback
// ============================================
export function ProductImage({ product, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-40 h-40',
    lg: 'w-64 h-64'
  };

  // Custom fallback dengan emoji berdasarkan kategori
  const getFallbackByCategory = (category) => {
    const emojis = {
      'Elektronik': '📱',
      'Fashion': '👔',
      'Makanan': '🍔',
      'Olahraga': '⚽',
      'default': '📦'
    };
    
    const emoji = emojis[category] || emojis.default;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80'%3E${emoji}%3C/text%3E%3C/svg%3E`;
  };

  return (
    <img 
      src={getProductImageUrl(product.image_url)} 
      alt={product.name}
      className={`${sizeClasses[size]} object-cover rounded-lg`}
      onError={(e) => handleImageError(e, getFallbackByCategory(product.category))}
    />
  );
}

// ============================================
// CONTOH 8: Background Image
// ============================================
export function StoreBanner({ store }) {
  const bannerUrl = getImageUrl(
    store.banner_url, 
    'https://via.placeholder.com/1200x300/4A90E2/ffffff?text=Store+Banner'
  );

  return (
    <div 
      className="h-48 bg-cover bg-center rounded-xl"
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div className="h-full bg-black bg-opacity-30 flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">{store.name}</h1>
      </div>
    </div>
  );
}

// ============================================
// CONTOH 9: Lazy Loading dengan Intersection Observer
// ============================================
export function LazyProductImage({ product }) {
  return (
    <img 
      src={getProductImageUrl(product.image_url)} 
      alt={product.name}
      loading="lazy" // Native lazy loading
      className="w-full h-48 object-cover"
      onError={(e) => handleImageError(e)}
    />
  );
}

// ============================================
// CONTOH 10: Image dengan Loading State
// ============================================
import { useState } from 'react';

export function ImageWithLoading({ src, alt, className }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {loading && !error && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
          <span className="text-gray-400">Loading...</span>
        </div>
      )}
      <img 
        src={getProductImageUrl(src)} 
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          handleImageError(e);
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}

// ============================================
// USAGE EXAMPLE dalam Page Component
// ============================================
export function ExampleProductPage() {
  const product = {
    product_id: 1,
    name: 'Smartphone XYZ',
    category: 'Elektronik',
    price: 'Rp 5.000.000',
    images: [
      {
        image_id: 1,
        image_url: 'uploads/products/phone1.jpg',
        is_primary: true
      },
      {
        image_id: 2,
        image_url: 'uploads/products/phone2.jpg',
        is_primary: false
      }
    ],
    seller: {
      store_name: 'Toko ABC',
      logo: 'uploads/stores/logo1.jpg',
      rating: 4.8
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductHero product={product} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-green-600 mb-6">{product.price}</p>
          
          {/* Store Info */}
          <StoreCard store={product.seller} />
        </div>
      </div>

      {/* Product Gallery */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Galeri Produk</h2>
        <ProductGallery product={product} />
      </div>
    </div>
  );
}
