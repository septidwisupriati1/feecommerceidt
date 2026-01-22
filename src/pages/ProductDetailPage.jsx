import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { products, formatPrice, getCategoryGradient } from "../data/products";
import { getProductDetail } from "../services/productAPI";
import buyerProductAPI from "../services/buyerProductAPI";
import { getPrimaryImageUrl, getImageUrls, getImageUrl } from "../utils/imageHelper";
import { ShoppingCartIcon, ChatBubbleLeftIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { isInWishlist, toggleWishlist } from '../utils/wishlist';
import { useCart } from '../context/CartContext';

const apiOrigin = import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).origin : '';
const buildImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return apiOrigin ? `${apiOrigin}${url}` : url;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('deskripsi');
  const [cartToast, setCartToast] = useState({ show: false, message: '' });
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const overrides = JSON.parse(localStorage.getItem('product_stock_overrides') || '{}');

      const normalizePayload = (api) => {
        if (!api) return null;
        const apiImages = api.images || api.product_images || api.productImages || api.images_url || [];
        const extraImages = [
          api.image2,
          api.image3,
          api.image_2,
          api.image_3,
          api.second_image,
          api.third_image,
          api.photo2,
          api.photo3,
          api.thumbnail,
          api.cover_image
        ].filter(Boolean);
        const combinedImages = [...apiImages, ...extraImages];
        const primaryImageRaw =
          api.primary_image ||
          api.image ||
          api.image_url ||
          api.primary_image_url ||
          getPrimaryImageUrl(combinedImages);
        const primaryImage = getImageUrl(primaryImageRaw);
        const gallerySource = combinedImages.length ? getImageUrls(combinedImages) : [];
        const gallery = (gallerySource.length ? gallerySource : [primaryImage]).filter(Boolean);

        return {
          product_id: api.product_id || api.id,
          name: api.name,
          description:
            api.description ||
            api.product_description ||
            api.long_description ||
            api.full_description ||
            api.detail ||
            api.details ||
            api.deskripsi ||
            '',
          price: api.price || 0,
          primary_image: primaryImage,
          images: gallery,
          category: api.category?.name || api.category_name || api.category || 'Kategori',
          rating: api.rating_average ?? api.rating ?? 0,
          reviews: api.total_reviews ?? api.reviews ?? 0,
          stock: api.stock ?? api.available_stock ?? 0,
          location: api.seller?.store_name || api.seller_name || api.location || 'Toko',
          seller_name: api.seller?.store_name || api.seller_name || 'Toko',
          condition: api.condition || 'Baru',
          sold: api.sold ?? api.total_sold ?? 0,
          shipping: api.shipping || api.shipping_method || 'Reguler',
          badge: api.badge || null,
          seller_user_id:
            api.seller_user_id ||
            api.seller?.user_id ||
            api.seller?.id ||
            api.seller?.userId ||
            api.sellerId ||
            api.user_id ||
            api.userId,
          seller_name:
            api.seller?.store_name ||
            api.seller?.name ||
            api.seller_name ||
            api.store_name ||
            api.seller?.full_name,
          seller_photo:
            api.seller?.store_photo ||
            api.seller?.profile_picture ||
            api.seller?.photo ||
            api.seller_photo ||
            api.store_photo ||
            api.seller?.seller_profile?.store_photo,
        };
      };

      const trySetProduct = (apiPayload) => {
        const normalized = normalizePayload(apiPayload);
        if (!normalized) return false;
        const pidKey = String(normalized.product_id || normalized.id || '');
        if (pidKey && overrides[pidKey] !== undefined) {
          normalized.stock = overrides[pidKey];
        }
        setProduct({
          ...normalized,
          seller_photo: buildImageUrl(normalized.seller_photo),
        });
        setSelectedImage(normalized.primary_image);
        setInWishlist(isInWishlist(normalized.product_id));
        setQuantity(normalized.stock > 0 ? 1 : 0);
        return true;
      };

      // Primary: buyer endpoint (langsung data seller)
      try {
        const buyerRes = await buyerProductAPI.getProductDetail(id);
        const buyerData = buyerRes?.data || buyerRes;
        if (buyerData && trySetProduct(buyerData)) {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Buyer product detail API failed', err.message);
      }

      // Secondary: public browse endpoint
      try {
        const res = await getProductDetail(id);
        if (res?.success && res.data && trySetProduct(res.data)) {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Product detail API failed', err.message);
      }

      // Terkahir: dummy hanya jika kedua API gagal total
      const fallback = products.find(p => p.id === parseInt(id));
      if (fallback) {
        const pidKey = String(fallback.id);
        const overriddenStock = overrides[pidKey];
        setProduct({
          product_id: fallback.id,
          name: fallback.name,
          description: fallback.description,
          price: fallback.price,
          primary_image: getImageUrl(fallback.image),
          images: [getImageUrl(fallback.image)].filter(Boolean),
          category: fallback.category,
          rating: fallback.rating,
          reviews: fallback.reviews,
          stock: overriddenStock !== undefined ? overriddenStock : fallback.stock ?? 100,
        });
        setInWishlist(isInWishlist(fallback.id));
        setQuantity(((overriddenStock !== undefined ? overriddenStock : fallback.stock) ?? 0) > 0 ? 1 : 0);
        setSelectedImage(getImageUrl(fallback.image));
      }
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (maxQuantity === 0) return;
    const safeQty = Math.min(maxQuantity, Math.max(1, quantity));
    setQuantity(safeQty);
    addToCart({ ...product, id: product.product_id || product.id }, safeQty);
    setCartToast({ show: true, message: `${product.name} berhasil ditambahkan ke keranjang.` });
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation && e.stopPropagation();
    const pid = product?.product_id || product?.id;
    if (!pid) return;
    toggleWishlist(pid);
    setInWishlist(isInWishlist(pid));
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (maxQuantity === 0) return;
    const safeQty = Math.min(maxQuantity, Math.max(1, quantity));
    setQuantity(safeQty);
    navigate('/checkout', {
      state: {
        buyNow: {
          product,
          quantity: safeQty
        }
      }
    });
  };

  const sellerUserId =
    product?.seller_user_id ||
    product?.sellerUserId ||
    product?.seller?.user_id ||
    product?.seller?.id ||
    product?.sellerId ||
    product?.user_id;

  const sellerPhoto = buildImageUrl(product?.seller_photo);
  const sellerName = product?.seller_name || 'Toko';

  const toSlug = (name) => String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const handleChatSeller = () => {
    if (!sellerUserId) {
      alert('ID penjual tidak ditemukan. Coba muat ulang halaman.');
      return;
    }
    navigate(`/chat?sellerId=${sellerUserId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BuyerNavbar />
        <div className="text-gray-600">Memuat produk...</div>
      </div>
    );
  }

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

  const maxQuantity = Math.max(0, product.stock || 0);

  const decrementQuantity = () => setQuantity(prev => {
    if (maxQuantity === 0) return 0;
    return prev > 1 ? prev - 1 : 1;
  });

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
            <button onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Beranda</button>
            <span>/</span>
            <button onClick={() => navigate('/produk')} className="hover:text-blue-600 cursor-pointer">Produk</button>
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
                    src={selectedImage || product.primary_image || 'https://via.placeholder.com/600x600?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-2 p-4">
                {(product.images?.length ? product.images : [product.primary_image]).slice(0,4).map((img, i) => (
                    <button
                    key={img || i}
                    className={`aspect-square bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-colors ${selectedImage === img ? 'border-blue-500' : 'border-gray-200 hover:border-blue-500'}`}
                    onClick={() => setSelectedImage(img || product.primary_image)}
                    >
                      <img 
                        src={img || 'https://via.placeholder.com/200x200?text=No+Image'} 
                        alt={`${product.name} ${i+1}`}
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
                      {'⭐'.repeat(Math.floor(product.rating || 0))}
                    </span>
                    <span className="text-gray-600">
                      {(product.rating || 0).toFixed(1)} | {product.reviews || 0} Review
                    </span>
                  </div>
                  <div className="text-gray-600">
                    STOK: <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock ?? 0}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.badge && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className={`${product.badge?.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                          {product.badge?.text}
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
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={maxQuantity === 0 || quantity <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      max={maxQuantity || 1}
                      min={1}
                      disabled={maxQuantity === 0}
                      className="w-20 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                      className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={quantity >= maxQuantity || maxQuantity === 0}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {product.stock <= 0 && (
                    <div className="text-sm text-red-600 mt-2">Stok habis</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-red-600 text-red-600 hover:bg-red-50 text-lg font-semibold cursor-pointer"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCartIcon className="h-6 w-6 mr-2" />
                    TAMBAH KE KERANJANG
                  </Button>
                  <Button 
                    onClick={handleBuyNow}
                    className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold cursor-pointer"
                    disabled={product.stock <= 0}
                  >
                    BELI SEKARANG
                  </Button>
                  <button
                    onClick={handleToggleWishlist}
                    title={inWishlist ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                    className={`${inWishlist ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-600 border-gray-200'} ml-2 inline-flex items-center justify-center px-4 h-12 rounded-md border cursor-pointer`}
                  >
                    <HeartIcon className="h-5 w-5 mr-2" />
                    {inWishlist ? 'Disimpan' : 'Simpan'}
                  </button>
                </div>

                {/* Seller Info */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                        {sellerPhoto ? (
                          <img
                            src={sellerPhoto}
                            alt={sellerName}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span>{(sellerName || 'TK').slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{product.seller_name || 'Toko'}</h3>
                        <p className="text-sm text-gray-600">Seller</p>
                      </div>
                        <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-red-600 text-white hover:bg-red-700 border-none cursor-pointer"
                          onClick={handleChatSeller}
                          disabled={!sellerUserId}
                        >
                          <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-red-600 text-white hover:bg-red-700 border-none cursor-pointer"
                          onClick={() => {
                            const slug = toSlug(sellerName || product.seller_name || product.store_name || 'toko')
                            navigate(`/${encodeURIComponent(slug)}`)
                          }}
                        >
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
                    } cursor-pointer`}
                  >
                    Deskripsi
                  </button>
                  <button
                    onClick={() => setSelectedTab('ulasan')}
                    className={`flex-1 py-4 font-semibold transition-colors ${
                      selectedTab === 'ulasan'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                    } cursor-pointer`}
                  >
                    Rating dan Ulasan
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {selectedTab === 'deskripsi' ? (
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-bold mb-4">Deskripsi Produk</h3>
                      <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                        {product.description && product.description.trim().length > 0
                          ? product.description
                          : 'Deskripsi belum tersedia.'}
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
