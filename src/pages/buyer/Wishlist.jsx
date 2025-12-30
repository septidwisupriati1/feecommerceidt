import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';
import { products as allProducts, formatPrice } from '../../data/products';
import {
  HeartIcon,
  ArrowRightIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('wishlist');
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setWishlistIds(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setWishlistIds([]);
    }
  }, []);

  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  const removeFromWishlist = (id) => {
    const next = wishlistIds.filter(i => i !== id);
    setWishlistIds(next);
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

          {wishlistProducts.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistProducts.map(p => (
                <div key={p.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
                  <div className="h-44 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                    <img src={p.image} alt={p.name} className="object-contain h-full" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h4>
                    <p className="text-yellow-600 font-bold mt-1">{formatPrice(p.price)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/produk/${p.id}`)}
                        className="text-sm text-blue-600 hover:underline"
                      >Lihat Produk</button>
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        className="text-sm text-red-600 flex items-center"
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
