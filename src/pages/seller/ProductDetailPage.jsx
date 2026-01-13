import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import CartSuccessToast from '../../components/CartSuccessToast';
import { getProductImageUrl, handleImageError } from '../../utils/imageHelper';
import {
  formatCurrency,
  formatDate,
  getProductStatusLabel,
  getStockStatus
} from '../../services/sellerProductAPI';
import { getProductDetail } from '../../services/sellerProductAPI';
import buyerProductAPI from '../../services/buyerProductAPI';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [navigateAfterToast, setNavigateAfterToast] = useState(false);

  const normalizeImageValue = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object') return img.image_url || img.url || img.path || img.src || img.image || img.imageUrl || '';
    return '';
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      let res = await getProductDetail(id);
      // Support multiple response shapes: {success,data:{...}}, {data:{...}}, or direct product
      let payload = res?.data?.data || res?.data || res;

      // If seller endpoint fails or returns empty, fallback to buyer public API
      if (!payload || res?.success === false) {
        try {
          const buyerRes = await buyerProductAPI.getProductDetail(id);
          payload = buyerRes?.data || buyerRes?.data?.data || buyerRes;
        } catch (e) {
          console.warn('Fallback buyer product detail failed', e);
        }
      }

      if (payload) {
        const rawImages =
          payload.images ||
          payload.product_images ||
          payload.images_url ||
          payload.gallery || [];

        const normalizedImages = Array.isArray(rawImages)
          ? rawImages.map(normalizeImageValue).filter(Boolean)
          : [
              normalizeImageValue(payload.primary_image),
              normalizeImageValue(payload.image_url),
              normalizeImageValue(payload.image),
              normalizeImageValue(payload.thumbnail),
              normalizeImageValue(payload.cover_image)
            ].filter(Boolean);

        const normalized = {
          ...payload,
          product_id: payload.product_id || payload.id,
          id: payload.product_id || payload.id,
          name: payload.name,
          price: payload.price,
          stock: payload.stock,
          status: payload.status,
          category: payload.category?.name || payload.category,
          condition: payload.condition || 'new',
          images: normalizedImages,
          primary_image:
            normalizeImageValue(payload.primary_image) ||
            normalizeImageValue(payload.image) ||
            normalizeImageValue(payload.image_url) ||
            normalizedImages[0],
          description: payload.description,
          created_at: payload.created_at,
          updated_at: payload.updated_at,
          weight: payload.weight,
          length: payload.length,
          width: payload.width,
          height: payload.height,
        };
        setProduct(normalized);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      return;
    }

    try {
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      const updatedProducts = products.filter(p => 
        (p.id !== parseInt(id)) && (p.product_id !== parseInt(id))
      );
      localStorage.setItem('seller_products', JSON.stringify(updatedProducts));
      
      setNavigateAfterToast(true);
      setToast({ show: true, message: 'Produk berhasil dihapus!' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setToast({ show: true, message: 'Terjadi kesalahan saat menghapus produk' });
    }
  };

  if (loading) {
    return (
      <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail produk...</p>
          </div>
        </div>
      </SellerSidebar>
    );
  }

  if (!product) {
    return (
      <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-6">
                Produk yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
              <Button
                onClick={() => navigate('/seller/product')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kembali ke Daftar Produk
              </Button>
            </CardContent>
          </Card>
        </div>
      </SellerSidebar>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const images = Array.isArray(product.images) && product.images.length
    ? product.images.map(normalizeImageValue).filter(Boolean)
    : normalizeImageValue(product.primary_image)
      ? [normalizeImageValue(product.primary_image)]
      : [];
  const isBase64 = (img) => typeof img === 'string' && img.startsWith('data:');

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 md:py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Hamburger Menu */}
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="ghost"
                  className="text-white hover:bg-blue-500 md:hidden"
                  size="sm"
                >
                  <Bars3Icon className="h-6 w-6" />
                </Button>

                <Button
                  onClick={() => navigate('/seller/product')}
                  variant="ghost"
                  className="text-white hover:bg-blue-500"
                  size="sm"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Detail Produk</h1>
                  <p className="text-blue-100 text-xs md:text-sm">Informasi lengkap produk</p>
                </div>
              </div>
              <div className="flex gap-2">
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Images & Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images Section */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  {/* Main Image */}
                  <div className="mb-4">
                    {images.length > 0 ? (
                      <img
                        src={isBase64(images[selectedImage]) ? images[selectedImage] : getProductImageUrl(images[selectedImage])}
                        alt={product.name}
                        className="w-full h-96 object-contain rounded-lg bg-gray-100"
                        onError={(e) => handleImageError(e, 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="80"%3E📦%3C/text%3E%3C/svg%3E')}
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-9xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'
                          }`}
                        >
                          <img
                            src={isBase64(img) ? img : getProductImageUrl(img)}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="40"%3E📦%3C/text%3E%3C/svg%3E')}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Information */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm font-medium ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {getProductStatusLabel(product.status)}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        {product.category || 'Tidak ada kategori'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.condition === 'new' ? '✨ Baru' : '♻️ Bekas'}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    <p className="text-4xl font-bold text-blue-600 mb-4">{formatCurrency(product.price)}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TruckIcon className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Informasi Pengiriman</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Berat</p>
                      <p className="text-lg font-bold text-gray-900">{product.weight || '-'} gram</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Panjang</p>
                      <p className="text-lg font-bold text-gray-900">{product.length || '-'} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lebar</p>
                      <p className="text-lg font-bold text-gray-900">{product.width || '-'} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tinggi</p>
                      <p className="text-lg font-bold text-gray-900">{product.height || '-'} cm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className="space-y-6">
              {/* Stock & Status Card */}
              <Card className="shadow-lg border-t-4 border-t-blue-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Status & Stok</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Stok Tersedia</p>
                      <p className={`text-3xl font-bold ${stockStatus.color}`}>
                        {product.stock} unit
                      </p>
                      <p className={`text-sm ${stockStatus.color} mt-1`}>{stockStatus.label}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Status Produk</p>
                      <div className="px-3 py-2 rounded-md border border-gray-200 bg-white mb-3 text-center">
                        <span className={`text-sm font-semibold ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {getProductStatusLabel(product.status)}
                        </span>
                      </div>
                      <hr className="my-4 border-gray-200" />
                      <Button
                        onClick={() => navigate(`/seller/product/edit/${id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
                      >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Edit Produk
                      </Button>
                      <Button
                        onClick={handleDelete}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Hapus Produk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Card */}
              <Card className="shadow-lg border-t-4 border-t-purple-600">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Statistik</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700">Dilihat</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {product.views || product.total_views || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-700">Terjual</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {product.sold || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm text-gray-700">Rating</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">
                        {product.rating_average?.toFixed(1) || '0.0'} ⭐
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-gray-700">Ulasan</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {product.total_reviews || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps Card */}
              <Card className="shadow-lg border-t-4 border-t-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Timeline</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Dibuat</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(product.created_at)}
                      </p>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-500">Terakhir Diperbarui</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(product.updated_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => {
          setToast({ show: false, message: '' });
          if (navigateAfterToast) navigate('/seller/product');
          setNavigateAfterToast(false);
        }}
      />
    </SellerSidebar>
  );
}
