import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShoppingBag, Shield, Truck, CreditCard, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageHelper";

export default function LandingPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?limit=8`);
      const data = await response.json();
      console.log("Products data:", data);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-300 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">E-Commerce</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                Masuk
              </Button>
              <Button 
                onClick={() => navigate('/register')}
              >
                Daftar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-60 top-20 left-[15%] animate-pulse"></div>
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40 top-40 left-[25%] animate-pulse delay-75"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-50 top-60 right-[20%] animate-pulse delay-150"></div>
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 top-32 right-[35%] animate-pulse delay-300"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full opacity-40 bottom-40 left-[40%] animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Selamat Datang di E-Commerce
              <br />
              Platform Belanja Terpercaya
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Belanja mudah, cepat dan aman
              <br />
              Ribuan produk berkualitas dengan harga terbaik
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/register')}
              >
                Mulai Belanja Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 bg-white hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                Sudah Punya Akun? Masuk
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Pilihan</h2>
            <p className="text-gray-600">Jelajahi produk-produk terbaik dari berbagai kategori</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product.product_id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate('/register')}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Stok Habis</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {product.rating?.toFixed(1) || '0.0'} ({product.review_count || 0})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-xl">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stok: {product.stock}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      {product.store_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Belum ada produk tersedia</p>
              <p className="text-gray-500 mt-2">Silakan cek kembali nanti</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
              >
                Lihat Semua Produk
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Memilih Kami?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Produk Berkualitas</h3>
              <p className="text-gray-600">
                Ribuan produk pilihan dari penjual terpercaya
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
              <p className="text-gray-600">
                Sistem pembayaran terenkripsi dan terjamin keamanannya
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-600">
                Pengiriman ke seluruh Indonesia dengan berbagai pilihan ekspedisi
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Harga Terbaik</h3>
              <p className="text-gray-600">
                Dapatkan penawaran menarik dan harga kompetitif setiap hari
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 E-Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
