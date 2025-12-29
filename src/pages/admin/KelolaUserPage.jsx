import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics,
  exportUsersToExcel
} from '../../services/adminUserAPI';
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
  UserGroupIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function KelolaUserPage() {
  const [users, setUsers] = useState([]);
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
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role_type: 'seller',
    status: 'active',
    email_verified: false
  });

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [currentPage, roleFilter, statusFilter, verifiedFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      username: searchQuery || undefined,
      role_type: roleFilter || undefined,
      status: statusFilter || undefined,
      email_verified: verifiedFilter !== '' ? verifiedFilter === 'true' : undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    
    const result = await getUsers(params);
    setUsers(result.data.users);
    setPagination(result.data.pagination);
    setTotalPages(result.data.pagination.total_pages);
    setFallbackMode(!!result.message?.includes('FALLBACK'));
    setLoading(false);
  };

  const fetchStatistics = async () => {
    const result = await getUserStatistics();
    setStatistics(result.data);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createUser(formData);
      
      if (result._fallback) {
        // Add to local state
        setUsers(prev => [result.data, ...prev]);
        alert('User berhasil dibuat! ⚠️ Mode Fallback: Data hanya di local');
      } else {
        alert('User berhasil dibuat!');
        fetchUsers();
        fetchStatistics();
      }
      
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      alert('Gagal membuat user: ' + error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password; // Don't send empty password
      
      const result = await updateUser(selectedUser.user_id, updateData);
      
      if (result._fallback) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u.user_id === selectedUser.user_id 
            ? { ...u, ...updateData }
            : u
        ));
        alert('User berhasil diupdate! ⚠️ Mode Fallback: Perubahan hanya di local');
      } else {
        alert('User berhasil diupdate!');
        fetchUsers();
        fetchStatistics();
      }
      
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
    } catch (error) {
      alert('Gagal update user: ' + error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(selectedUser.user_id);
      
      if (result._fallback) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u.user_id === selectedUser.user_id 
            ? { ...u, status: 'inactive' }
            : u
        ));
        alert('User berhasil dinonaktifkan! ⚠️ Mode Fallback: Perubahan hanya di local');
      } else {
        alert('User berhasil dinonaktifkan!');
        fetchUsers();
        fetchStatistics();
      }
      
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      alert('Gagal menghapus user: ' + error.message);
    }
  };

  const handleViewDetail = async (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      phone: user.phone || '',
      role_type: user.roles[0]?.role_type || 'seller',
      status: user.status,
      email_verified: user.email_verified
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleExport = async () => {
    try {
      const blob = await exportUsersToExcel({
        role_type: roleFilter || undefined,
        status: statusFilter || undefined,
        email_verified: verifiedFilter !== '' ? verifiedFilter === 'true' : undefined
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().getTime()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Export tidak tersedia dalam fallback mode');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      role_type: 'seller',
      status: 'active',
      email_verified: false
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Aktif',
      inactive: 'Nonaktif',
      suspended: 'Suspend'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getRoleBadge = (roles) => {
    if (!roles || roles.length === 0) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Buyer</span>;
    const role = roles[0].role_type;
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-orange-100 text-orange-800'
    };
    const labels = {
      admin: 'Admin',
      seller: 'Seller'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kelola User</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600">Manajemen akun pengguna sistem</p>
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
                    <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">Total User</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-900">{statistics.overview.total_users}</p>
                  </div>
                  <div className="bg-blue-500 rounded-full p-3">
                    <UserGroupIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-green-700 font-medium mb-1">User Aktif</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-900">{statistics.overview.active_users}</p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <CheckCircleIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-purple-700 font-medium mb-1">Email Terverifikasi</p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-900">{statistics.overview.verified_emails}</p>
                  </div>
                  <div className="bg-purple-500 rounded-full p-3">
                    <ShieldCheckIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-orange-700 font-medium mb-1">Total Seller</p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-900">{statistics.by_role.total_sellers}</p>
                  </div>
                  <div className="bg-orange-500 rounded-full p-3">
                    <UsersIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                {/* Search */}
                <div className="sm:col-span-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari username atau email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
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
                  <option value="suspended">Suspend</option>
                </select>

                {/* Verified Filter */}
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="">Semua Verifikasi</option>
                  <option value="true">Terverifikasi</option>
                  <option value="false">Belum Verifikasi</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('');
                    setStatusFilter('');
                    setVerifiedFilter('');
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
                    Tambah User
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terdaftar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data user
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.full_name || '-'}</div>
                          {user.seller_profile && (
                            <div className="text-xs text-blue-600 mt-1">{user.seller_profile.store_name}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.roles)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email_verified ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button
                            onClick={() => handleViewDetail(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
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
                    Menampilkan <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-semibold">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> dari <span className="font-semibold">{pagination.total}</span> user
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
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Tambah User Baru</h2>
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
            
            <form onSubmit={handleCreateUser} className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    minLength={6}
                    placeholder="Min. 6 karakter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nama lengkap user"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                  <select
                    value={formData.role_type}
                    onChange={(e) => setFormData({...formData, role_type: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
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
                    <option value="suspended">Suspend</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.email_verified}
                      onChange={(e) => setFormData({...formData, email_verified: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Email sudah terverifikasi</span>
                  </label>
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
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Edit User</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="user@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru <span className="text-gray-500 font-normal">(kosongkan jika tidak diubah)</span></label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    minLength={6}
                    placeholder="Min. 6 karakter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nama lengkap user"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    value={formData.role_type}
                    onChange={(e) => setFormData({...formData, role_type: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
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
                    <option value="suspended">Suspend</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.email_verified}
                      onChange={(e) => setFormData({...formData, email_verified: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Email sudah terverifikasi</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }}
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
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Detail User</h2>
              <button onClick={() => { setShowDetailModal(false); setSelectedUser(null); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">User ID</p>
                  <p className="font-semibold text-gray-900">{selectedUser.user_id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Username</p>
                  <p className="font-semibold text-gray-900">{selectedUser.username}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{selectedUser.full_name || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">No. Telepon</p>
                  <p className="font-semibold text-gray-900">{selectedUser.phone || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Role</p>
                  <div className="mt-1">{getRoleBadge(selectedUser.roles)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Email Verified</p>
                  <p className="font-semibold">
                    {selectedUser.email_verified ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" /> Ya
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <XCircleIcon className="w-4 h-4 md:w-5 md:h-5" /> Tidak
                      </span>
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Terdaftar</p>
                  <p className="font-semibold text-gray-900 text-sm">{new Date(selectedUser.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500 mb-1">Terakhir Update</p>
                  <p className="font-semibold text-gray-900 text-sm">{new Date(selectedUser.updated_at).toLocaleString('id-ID')}</p>
                </div>
              </div>

              {selectedUser.seller_profile && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-base md:text-lg">Seller Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs md:text-sm text-blue-700 mb-1">Nama Toko</p>
                      <p className="font-semibold text-blue-900">{selectedUser.seller_profile.store_name}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-xs md:text-sm text-orange-700 mb-1">Rating</p>
                      <p className="font-semibold text-orange-900">⭐ {selectedUser.seller_profile.rating_average} ({selectedUser.seller_profile.total_reviews} reviews)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={() => { setShowDetailModal(false); setSelectedUser(null); }}
                className="px-5 py-2.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 font-medium transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <TrashIcon className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Konfirmasi Hapus User</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menonaktifkan user <strong className="text-gray-900">{selectedUser.username}</strong>? 
                User akan diset status menjadi "Nonaktif".
              </p>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }}
                  className="px-4 md:px-5 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 md:px-5 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                >
                  Hapus User
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
