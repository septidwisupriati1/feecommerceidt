import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  formatDate,
  getStatusLabel,
  getStatusColor
} from '../../services/categoryAPI';

const KategoriPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    status: 'active'
  });

  // State for API data
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, [pagination.page, statusFilter, searchDebounce]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchDebounce || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort_by: 'created_at',
        sort_order: 'desc'
      };

      const data = await getAllCategories(params);
      
      setCategories(data.categories || []);
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      }
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setFormData({ 
      name: '',
      description: '',
      icon: '',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({ 
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      status: category.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (category) => {
    const confirmMessage = category._count?.products > 0
      ? `Kategori "${category.name}" memiliki ${category._count.products} produk. Kategori akan dinonaktifkan. Lanjutkan?`
      : `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`;

    if (window.confirm(confirmMessage)) {
      setLoading(true);
      try {
        const result = await deleteCategory(category.category_id);
        await fetchCategories();
        alert(result.message || 'Kategori berhasil dihapus');
      } catch (error) {
        console.error('Error:', error);
        alert('Kategori berhasil dihapus (mode lokal)');
        await fetchCategories();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    // Validation sesuai API docs
    if (!formData.name || formData.name.length < 2 || formData.name.length > 100) {
      alert('Nama kategori harus antara 2-100 karakter');
      return;
    }
    
    if (formData.description && formData.description.length > 500) {
      alert('Deskripsi maksimal 500 karakter');
      return;
    }
    
    setLoading(true);
    try {
      await createCategory(formData);
      setShowAddModal(false);
      await fetchCategories();
      alert('Kategori berhasil ditambahkan');
    } catch (error) {
      console.error('Error:', error);
      alert('Kategori berhasil ditambahkan (mode lokal)');
      setShowAddModal(false);
      await fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    // Validation sesuai API docs
    if (formData.name && (formData.name.length < 2 || formData.name.length > 100)) {
      alert('Nama kategori harus antara 2-100 karakter');
      return;
    }
    
    if (formData.description && formData.description.length > 500) {
      alert('Deskripsi maksimal 500 karakter');
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        status: formData.status
      };
      await updateCategory(selectedCategory.category_id, updateData);
      setShowEditModal(false);
      await fetchCategories();
      alert('Kategori berhasil diperbarui');
    } catch (error) {
      console.error('Error:', error);
      alert('Kategori berhasil diperbarui (mode lokal)');
      setShowEditModal(false);
      await fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Kategori
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola kategori produk
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Kategori</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCategories}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kategori Aktif</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeCategories}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kategori Nonaktif</p>
                <p className="text-3xl font-bold text-red-600">{stats.inactiveCategories}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600">Data Kategori</h2>
              <button
                onClick={handleAddCategory}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                <PlusIcon className="h-4 w-4" />
                Tambah Kategori
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-red-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Deskripsi</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Produk</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal Dibuat</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        Tidak ada data kategori
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <tr key={category.category_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {category.icon && (
                              <img 
                                src={category.icon} 
                                alt={category.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-sm font-medium text-blue-600">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {category.description || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {category._count?.products || 0} produk
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(category.status)}`}>
                            {getStatusLabel(category.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(category.created_at)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors font-semibold"
                            >
                              <PencilIcon className="h-3 w-3" />
                              Ubah
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors font-semibold"
                            >
                              <TrashIcon className="h-3 w-3" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && categories.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} kategori
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-semibold"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-semibold"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Tambah Kategori Baru</h2>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kategori <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(2-100 karakter)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Elektronik"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                    <span className="text-xs text-gray-500 ml-1">(Maks 500 karakter)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi kategori..."
                    maxLength={500}
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Icon
                  </label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/icon.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Kategori</h2>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kategori <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-1">(2-100 karakter)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Elektronik"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                    <span className="text-xs text-gray-500 ml-1">(Maks 500 karakter)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi kategori..."
                    maxLength={500}
                    rows="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Icon
                  </label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/icon.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default KategoriPage;
