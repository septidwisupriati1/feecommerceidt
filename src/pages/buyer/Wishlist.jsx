import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';
import { formatPrice } from '../../data/products';
import { getProductImageUrl, handleImageError, getPrimaryImageUrl, getImageUrl } from '../../utils/imageHelper';
import { getProductDetail } from '../../services/productAPI';
import buyerProductAPI from '../../services/buyerProductAPI';
import {
  HeartIcon,
  ArrowRightIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist IDs from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('wishlist');
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setWishlistIds(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setWishlistIds([]);
    }
  }, []);

  // Fetch product details from backend for each wishlist ID
  useEffect(() => {
    if (wishlistIds.length === 0) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const results = [];

      for (const id of wishlistIds) {
        try {
          // Try buyer API first
          const buyerRes = await buyerProductAPI.getProductDetail(id);
          const raw = buyerRes?.data || buyerRes;
          if (raw) {
            results.push(normalizeProduct(raw, id));
            continue;
          }
        } catch (_) { /* fallback below */ }

        try {
          // Fallback to public API
          const res = await getProductDetail(id);
          if (res?.success && res.data) {
            results.push(normalizeProduct(res.data, id));
            continue;
          }
        } catch (_) { /* skip */ }

        // If all APIs fail, push a minimal placeholder so ID isn't silently lost
        results.push({ id, product_id: id, name: `Produk #${id}`, price: 0, image: null, notFound: true });
      }

      setWishlistProducts(results);
      setLoading(false);
    };

    fetchProducts();
  }, [wishlistIds]);

  const normalizeProduct = (data, fallbackId) => {
    // Resolve image: backend returns images as array of {image_url, is_primary}
    const imagesArr = data.images || data.product_images || data.productImages || [];
    let resolvedImage = data.primary_image || data.image || data.image_url || data.primary_image_url || null;

    // If no direct image field, extract from images array
    if (!resolvedImage && Array.isArray(imagesArr) && imagesArr.length > 0) {
      const primary = imagesArr.find(img => img.is_primary);
      const imgObj = primary || imagesArr[0];
      resolvedImage = typeof imgObj === 'string' ? imgObj : (imgObj.image_url || imgObj.url || imgObj.path || imgObj.src);
    }

    return {
      id: data.product_id || data.id || fallbackId,
      product_id: data.product_id || data.id || fallbackId,
      name: data.name || data.product_name || data.title || 'Produk',
      price: data.price || 0,
      image: resolvedImage,
      rating: data.rating_average ?? data.rating ?? 0,
      stock: data.stock ?? data.available_stock ?? 0,
      category: data.category?.name || data.category_name || data.category || '',
      seller_name: data.seller?.store_name || data.seller_name || '',
    };
  };

  const removeFromWishlist = (id) => {
    const next = wishlistIds.filter(i => i !== id);
    setWishlistIds(next);
    setWishlistProducts(prev => prev.filter(p => p.id !== id && p.product_id !== id));
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  if (!wishlistIds) return null;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)', backgroundAttachment: 'fixed'}}>
      <BuyerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Wishlist</h2>
            <p className="text-sm text-gray-500">Produk yang Anda simpan</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat wishlist...</p>
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Wishlist Anda kosong</p>
              <button
                onClick={() => navigate('/produk')}
                className="inline-flex items-center px-4 py-2 rounded-md bg-yellow-400 text-gray-900 font-semibold"
              >
                Mulai Belanja
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {wishlistProducts.map(p => (
                <div key={p.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                  <div className="relative w-full pt-[85%] bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={getProductImageUrl(p.image)}
                        alt={p.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => handleImageError(e, 'https://via.placeholder.com/400x400?text=No+Image')}
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl text-gray-300">🛍️</div>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute top-2 left-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold">Stok Habis</span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{p.name}</h4>
                    {p.category && (
                      <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                    )}
                    <p className="text-yellow-600 font-bold mt-auto">{formatPrice(p.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/produk/${p.product_id || p.id}`)}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >Lihat Produk</button>
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        className="text-sm text-red-600 flex items-center cursor-pointer"
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
