import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStatistics,
  exportProductsToExcel
} from '../../services/adminProductAPI';
import { getProductImageUrl, handleImageError } from '../../utils/imageHelper';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function KelolaProductPage() {
  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    seller_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchProducts();
    fetchStatistics();
  }, [currentPage, categoryFilter, storeFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchProducts();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      name: searchQuery || undefined,
      category: categoryFilter || undefined,
      store: storeFilter || undefined,
      status: statusFilter || undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    
    const result = await getProducts(params);
    setProducts(result.data.products);
    setPagination(result.data.pagination);
    setTotalPages(result.data.pagination.total_pages);
    setFallbackMode(!!result.message?.includes('FALLBACK'));
    setLoading(false);
  };

  const fetchStatistics = async () => {
    const result = await getProductStatistics();
    setStatistics(result.data);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id) || 1,
      seller_id: parseInt(formData.seller_id) || 1,
      status: formData.status
    };
    
    const result = await createProduct(productData);
    
    if (result._fallback) {
      setProducts([result.data, ...products]);
      alert('⚠️ Produk disimpan dalam mode fallback. Data akan hilang saat refresh.');
    } else {
      alert('✅ Produk berhasil dibuat!');
      fetchProducts();
      fetchStatistics();
    }
    
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id),
      status: formData.status
    };
    
    const result = await updateProduct(selectedProduct.product_id, productData);
    
    if (result._fallback) {
      const updatedProducts = products.map(p => 
        p.product_id === selectedProduct.product_id 
          ? { ...p, ...productData, updated_at: new Date().toISOString() }
          : p
      );
      setProducts(updatedProducts);
      alert('⚠️ Produk diupdate dalam mode fallback. Data akan hilang saat refresh.');
    } else {
      alert('✅ Produk berhasil diupdate!');
      fetchProducts();
      fetchStatistics();
    }
    
    setShowEditModal(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleDeleteProduct = async () => {
    const result = await deleteProduct(selectedProduct.product_id);
    
    if (result._fallback) {
      const updatedProducts = products.map(p => 
        p.product_id === selectedProduct.product_id 
          ? { ...p, status: 'inactive', updated_at: new Date().toISOString() }
          : p
      );
      setProducts(updatedProducts);
      alert('⚠️ Produk dinonaktifkan dalam mode fallback. Data akan hilang saat refresh.');
    } else {
      alert('✅ Produk berhasil dinonaktifkan!');
      fetchProducts();
      fetchStatistics();
    }
    
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleViewDetail = async (product) => {
    try {
      const result = await getProductById(product.product_id);
      setSelectedProduct(result.data);
      setShowDetailModal(true);
    } catch (error) {
      alert('❌ Gagal memuat detail produk');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category?.category_id || '',
      seller_id: product.seller?.seller_id || '',
      status: product.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleExport = async () => {
    try {
      const blob = await exportProductsToExcel({
        category: categoryFilter || undefined,
        store: storeFilter || undefined,
        status: statusFilter || undefined
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().getTime()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('❌ Export tidak tersedia dalam fallback mode');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      seller_id: '',
      status: 'active'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      active: 'Aktif',
      inactive: 'Nonaktif'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Habis</span>;
    } else if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Rendah</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Tersedia</span>;
    }
  };

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600">Manajemen produk dan inventori</p>
          </div>

          {/* Fallback Mode Warning */}
          {fallbackMode && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 text-sm md:text-base font-medium">Mode Fallback Aktif - Backend tidak tersedia, menggunakan data sample</span>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">Total Produk</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-900">{statistics.overview.total_products}</p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <CubeIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-green-700 font-medium mb-1">Produk Aktif</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-900">{statistics.overview.active_products}</p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <CheckCircleIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-purple-700 font-medium mb-1">Total Nilai</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-900">{formatCurrency(statistics.overview.total_value)}</p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <BanknotesIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-orange-700 font-medium mb-1">Stok Rendah</p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-900">{statistics.overview.low_stock_products}</p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <ExclamationTriangleIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
                {/* Search */}
                <div className="sm:col-span-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Semua Kategori</option>
                  <option value="1">Elektronik</option>
                  <option value="2">Fashion</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('');
                    setStoreFilter('');
                    setStatusFilter('');
                  }}
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Reset Filter
                </button>

                <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex-1 sm:flex-none"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Export Excel</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                  
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-1 sm:flex-none"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Tambah Produk
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toko</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data produk
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={getProductImageUrl(product.images?.[0]?.image_url)} 
                              alt={product.name}
                              onError={(e) => handleImageError(e)}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.product_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category?.icon} {product.category?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.seller?.store_name || '-'}</div>
                        <div className="text-sm text-gray-500">⭐ {product.seller?.rating_average || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{product.stock}</span>
                          {getStockBadge(product.stock)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">⭐ {product.rating_average || 0}</div>
                        <div className="text-sm text-gray-500">({product.total_reviews || 0} reviews)</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button
                            onClick={() => handleViewDetail(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs md:text-sm text-gray-700">
                    Menampilkan <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-semibold">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> dari <span className="font-semibold">{pagination.total}</span> produk
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.has_prev}
                      className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <span className="px-2 md:px-4 py-2 text-sm font-medium text-gray-700">
                      <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span>
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={!pagination.has_next}
                      className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Tambah Produk Baru</h2>
              <button 
                onClick={() => { 
                  setShowCreateModal(false); 
                  resetForm(); 
                }} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-5 md:p-6">
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="4"
                    placeholder="Deskripsikan produk Anda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="1">🖥️ Elektronik</option>
                      <option value="2">👕 Fashion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="px-4 md:px-5 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Edit Produk</h2>
              <button 
                onClick={() => { 
                  setShowEditModal(false); 
                  setSelectedProduct(null); 
                  resetForm(); 
                }} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-5 md:p-6">
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="4"
                    placeholder="Deskripsikan produk Anda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="1">🖥️ Elektronik</option>
                      <option value="2">👕 Fashion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedProduct(null); resetForm(); }}
                  className="px-4 md:px-5 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Detail Produk</h2>
              <button 
                onClick={() => { 
                  setShowDetailModal(false); 
                  setSelectedProduct(null); 
                }} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 md:p-6 space-y-4">
              {/* Product Image */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="flex justify-center">
                  <img 
                    src={getProductImageUrl(selectedProduct.images[0].image_url)} 
                    alt={selectedProduct.name}
                    className="h-48 w-auto rounded-xl object-cover"
                    onError={(e) => handleImageError(e)}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Product ID</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.product_id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Nama Produk</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Deskripsi</p>
                  <p className="text-gray-900">{selectedProduct.description}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-blue-700 mb-1">Harga</p>
                  <p className="font-semibold text-blue-900 text-lg">{formatCurrency(selectedProduct.price)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-green-700 mb-1">Stok</p>
                  <p className="font-semibold text-green-900 text-lg">{selectedProduct.stock} unit</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Kategori</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.category?.icon} {selectedProduct.category?.name || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-orange-700 mb-1">Rating</p>
                  <p className="font-semibold text-orange-900">⭐ {selectedProduct.rating_average || 0} ({selectedProduct.total_reviews || 0} reviews)</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-purple-700 mb-1">Total Penjualan</p>
                  <p className="font-semibold text-purple-900">{selectedProduct.total_sales || 0} terjual</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Toko</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.seller?.store_name || '-'}</p>
                  <p className="text-sm text-gray-600">⭐ {selectedProduct.seller?.rating_average || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Dibuat</p>
                  <p className="font-semibold text-gray-900 text-sm">{new Date(selectedProduct.created_at).toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-base md:text-lg">Varian Produk</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProduct.variants.map((variant) => (
                      <div key={variant.variant_id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">{variant.variant_name}: <span className="font-semibold text-gray-900">{variant.variant_value}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Stok: {variant.stock_adjust}, Harga: +{formatCurrency(variant.price_adjust)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={() => { setShowDetailModal(false); setSelectedProduct(null); }}
                className="px-5 py-2.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 font-medium transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Konfirmasi Hapus Produk</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menonaktifkan produk <strong className="text-gray-900">{selectedProduct.name}</strong>? 
                Produk akan diset status menjadi "Nonaktif".
              </p>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedProduct(null); }}
                  className="px-4 md:px-5 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 md:px-5 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
}
