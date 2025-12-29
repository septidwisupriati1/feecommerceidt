import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { products, formatPrice, getCategoryGradient } from "../data/products";
import { ShoppingCartIcon, ChatBubbleLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('deskripsi');
  const [cartToast, setCartToast] = useState({ show: false, message: '' });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setCartToast({ show: true, message: `${product.name} berhasil ditambahkan ke keranjang.` });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    // Langsung redirect ke halaman keranjang
    navigate('/keranjang');
  };

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">ID: {id}</p>
          <Button onClick={() => navigate('/produk')}>Kembali ke Produk</Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navbar */}
      <BuyerNavbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Beranda</button>
            <span>/</span>
            <button onClick={() => navigate('/produk')} className="hover:text-blue-600">Produk</button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="aspect-square bg-white flex items-center justify-center rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-2 p-4">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      className="aspect-square bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors overflow-hidden"
                    >
                      <img 
                        src={product.image} 
                        alt={`${product.name} ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Product Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">
                      {'⭐'.repeat(Math.floor(product.rating))}
                    </span>
                    <span className="text-gray-600">
                      {product.rating} | {product.reviews} Review
                    </span>
                  </div>
                  <div className="text-gray-600">
                    STOK: <span className="font-semibold text-green-600">Tersedia</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className={`${product.badge.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                          {product.badge.text}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <span className="text-gray-600">KATEGORI: </span>
                  <span className="text-blue-600 font-semibold uppercase">{product.category}</span>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">QTY</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-red-600 text-red-600 hover:bg-red-50 text-lg font-semibold"
                  >
                    <ShoppingCartIcon className="h-6 w-6 mr-2" />
                    TAMBAH KE KERANJANG
                  </Button>
                  <Button 
                    onClick={handleBuyNow}
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                  >
                    BELI SEKARANG
                  </Button>
                </div>

                {/* Seller Info */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">Toko Official Store</h3>
                        <p className="text-sm text-gray-600">{product.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700 border-none">
                          <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                          Chat
                        </Button>
                        <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700 border-none">
                          Profil Toko
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Tabs - Description & Reviews */}
            <Card className="mt-6">
              <CardContent className="p-0">
                {/* Tab Headers */}
                <div className="flex border-b">
                  <button
                    onClick={() => setSelectedTab('deskripsi')}
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      selectedTab === 'deskripsi'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Deskripsi
                  </button>
                  <button
                    onClick={() => setSelectedTab('ulasan')}
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      selectedTab === 'ulasan'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Rating dan Ulasan
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {selectedTab === 'deskripsi' ? (
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-bold mb-4">Deskripsi Produk</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {product.name} adalah produk berkualitas tinggi yang dirancang untuk memenuhi kebutuhan Anda. 
                        Dengan material terbaik dan desain modern, produk ini memberikan nilai maksimal untuk investasi Anda.
                      </p>
                      <h4 className="font-bold mt-6 mb-3">Spesifikasi:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Kondisi: {product.condition}</li>
                        <li>Kategori: {product.category}</li>
                        <li>Rating: {product.rating}/5.0 dari {product.reviews} ulasan</li>
                        <li>Terjual: {product.sold} unit</li>
                        <li>Pengiriman: {product.shipping}</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                          <div className="text-yellow-400 text-2xl mb-1">
                            {'⭐'.repeat(Math.floor(product.rating))}
                          </div>
                          <div className="text-sm text-gray-600">{product.reviews} ulasan</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">User {i}</span>
                              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                            </div>
                            <p className="text-gray-700">
                              Produk sangat bagus, sesuai deskripsi. Pengiriman cepat dan packing rapi. Recommended!
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  onClick={() => navigate(`/produk/${relatedProduct.id}`)}
                  className="hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="relative">
                    <div className="aspect-square bg-white flex items-center justify-center rounded-t-lg overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`absolute top-2 right-2 text-xs ${relatedProduct.badge.color} text-white px-2 py-1 rounded-full font-semibold`}>
                      {relatedProduct.badge.text}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(relatedProduct.price)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      <CartSuccessToast
        show={cartToast.show}
        message={cartToast.message || "Produk ditambahkan ke keranjang"}
        onClose={() => setCartToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
