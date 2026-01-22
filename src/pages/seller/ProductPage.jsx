import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { getProductImageUrl, handleImageError } from '../../utils/imageHelper';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CartSuccessToast from '../../components/CartSuccessToast';
import {
  getProducts,
  getCategories,
  deleteProduct,
  formatCurrency,
  formatDate,
  getProductStatusLabel,
  getProductStatusColor,
  getStockStatus,
} from '../../services/sellerProductAPI';

export default function ProductPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filterStatus, filterCategory, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response?.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts({
        status: filterStatus,
        category_id: filterCategory,
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery
      });

      if (response?.success) {
        setProducts(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response?.error || response?.message || 'Gagal mengambil data produk');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      return;
    }

    try {
      setLoading(true);

      const response = await deleteProduct(productId);
      if (response?.success) {
        setToast({ show: true, message: 'Produk berhasil dihapus' });
        fetchProducts();
      } else {
        setToast({ show: true, message: 'Gagal menghapus produk' });
      }
    } catch (err) {
      setToast({ show: true, message: 'Error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };
  const stats = {
    total: pagination.total || 0,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Produk Saya
              </h1>
            </div>
            <Button
              onClick={() => navigate('/seller/product/add')}
              className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
              size="lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Produk</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Aktif</p>
              <h3 className="text-3xl font-bold text-green-600">{stats.active}</h3>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Nonaktif</p>
              <h3 className="text-3xl font-bold text-red-600">{stats.inactive}</h3>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Stok Habis</p>
              <h3 className="text-3xl font-bold text-orange-600">{stats.outOfStock}</h3>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Stok Menipis</p>
              <h3 className="text-3xl font-bold text-yellow-600">{stats.lowStock}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2 flex gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </Button>
                <Button
                  onClick={fetchProducts}
                  variant="outline"
                  title="Refresh data"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <ArrowPathIcon className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-spin" />
                <p className="text-lg font-semibold text-gray-700">Memuat data produk...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <ExclamationTriangleIcon className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-semibold text-red-600 mb-2">Gagal memuat data</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchProducts} className="bg-blue-600 hover:bg-blue-700">
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <ExclamationTriangleIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold mb-2">Tidak ada produk</p>
                <p className="text-sm text-gray-600 mb-4">Belum ada produk atau tidak ditemukan</p>
                <Button
                  onClick={() => navigate('/seller/product/add')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Tambah Produk Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => {
              const statusBadge = getProductStatusColor(product.status);
              const stockStatus = getStockStatus(product.stock);
              const getImageValue = (img) => {
                if (!img) return '';
                if (typeof img === 'string') return img;
                if (typeof img === 'object') return img.image_url || img.url || img.path || img.src || img.image || img.imageUrl || '';
                return '';
              };

              const primaryImageUrl = getImageValue(product.primary_image)
                || getImageValue(product.image)
                || getImageValue(product.image_url)
                || getImageValue(product.thumbnail)
                || getImageValue(product.cover_image)
                || getImageValue(product.images?.find?.(img => img.is_primary))
                || getImageValue(product.images?.[0]);

              const isBase64 = typeof primaryImageUrl === 'string' && primaryImageUrl.startsWith('data:');
              
              return (
                <Card key={product.product_id || product.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {primaryImageUrl ? (
                          <img
                            src={isBase64 ? primaryImageUrl : getProductImageUrl(primaryImageUrl)}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => handleImageError(e, 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23e5e7eb" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48"%3E📦%3C/text%3E%3C/svg%3E')}
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-5xl">📦</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
                                {getProductStatusLabel(product.status)}
                              </span>
                              {(() => {
                                const cats = [];

                                if (Array.isArray(product.categories) && product.categories.length) {
                                  product.categories.forEach(c => {
                                    if (typeof c === 'string') cats.push(c);
                                    else if (c && c.name) cats.push(c.name);
                                  });
                                }

                                if (Array.isArray(product.category) && product.category.length) {
                                  product.category.forEach(c => {
                                    if (typeof c === 'string') cats.push(c);
                                    else if (c && c.name) cats.push(c.name);
                                  });
                                } else if (product.category) {
                                  if (typeof product.category === 'string') {
                                    cats.push(...product.category.split(',').map(s => s.trim()).filter(Boolean));
                                  } else if (product.category.name) {
                                    cats.push(product.category.name);
                                  }
                                }

                                if (!cats.length) {
                                  return (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                      Tidak ada kategori
                                    </span>
                                  );
                                }

                                return cats.map((c, idx) => (
                                  <span key={`${c}-${idx}`} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                    {c}
                                  </span>
                                ));
                              })()}
                           </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Harga</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Stok</p>
                            <p className={`text-lg font-bold ${stockStatus.color}`}>
                              {product.stock} unit
                            </p>
                            <p className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-lg font-bold text-yellow-600">
                              ⭐ {product.rating_average?.toFixed(1) || '0.0'}
                            </p>
                            <p className="text-xs text-gray-600">{product.total_reviews || 0} ulasan</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Dilihat</p>
                            <p className="text-lg font-bold text-purple-600">
                              👁 {product.total_views || 0}
                            </p>
                            <p className="text-xs text-gray-600">kali</p>
                          </div>
                        </div>

                        {/* Variants Preview */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Varian:</p>
                            <div className="flex gap-2 flex-wrap">
                              {product.variants.slice(0, 5).map((variant, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-800 rounded text-xs">
                                  {variant.variant_value}
                                </span>
                              ))}
                              {product.variants.length > 5 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{product.variants.length - 5} lainnya
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Dibuat: {formatDate(product.created_at)}</span>
                          <span>Diupdate: {formatDate(product.updated_at)}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            onClick={() => navigate(`/seller/product/${product.product_id || product.id}`)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 cursor-pointer"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          <Button
                            onClick={() => navigate(`/seller/product/edit/${product.product_id || product.id}`)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 text-green-600 cursor-pointer"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.product_id || product.id, product.name)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 text-red-600 cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <Card className="mt-6 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Halaman {pagination.page} dari {pagination.totalPages}
                  <span className="ml-2">({pagination.total} produk)</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    size="sm"
                  >
                    ← Sebelumnya
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    variant="outline"
                    size="sm"
                  >
                    Selanjutnya →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </SellerSidebar>
  );
}
