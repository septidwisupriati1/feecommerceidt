import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  getStores,
  getStoreReports,
  getReportStatistics,
  updateStoreStatus,
  updateReportStatus,
  getStoresFallback,
  getStoreReportsFallback,
  getReportStatisticsFallback
} from '../../services/adminStoreAPI';

const KelolaStorePagePage = () => {
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' or 'reports'
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Stores state
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storeStats, setStoreStats] = useState(null);
  
  // Reports state
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportStats, setReportStats] = useState(null);
  
  // Filters
  const [storeStatusFilter, setStoreStatusFilter] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [storePage, setStorePage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [storePagination, setStorePagination] = useState(null);
  const [reportPagination, setReportPagination] = useState(null);
  const itemsPerPage = 10;
  
  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'stores') {
      fetchStores();
    } else {
      fetchReports();
      fetchReportStatistics();
    }
  }, [activeTab, storeStatusFilter, reportStatusFilter, searchQuery, storePage, reportPage]);

  const fetchStores = async () => {
    setStoresLoading(true);
    const params = {
      page: storePage,
      limit: itemsPerPage,
      status: storeStatusFilter || undefined,
      search: searchQuery || undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    
    const result = await getStores(params);
    setStores(result.data);
    setStorePagination(result.pagination);
    setStoreStats(result.stats);
    setFallbackMode(!!result.message?.includes('FALLBACK'));
    setStoresLoading(false);
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    const params = {
      page: reportPage,
      limit: itemsPerPage,
      status: reportStatusFilter || undefined,
      search: searchQuery || undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    
    const result = await getStoreReports(params);
    setReports(result.data.reports);
    setReportPagination(result.data.pagination);
    setFallbackMode(!!result.message?.includes('FALLBACK'));
    setReportsLoading(false);
  };

  const fetchReportStatistics = async () => {
    const result = await getReportStatistics();
    setReportStats(result.data);
  };

  const handleChangeStoreStatus = async () => {
    if (!selectedStore || !newStatus) return;
    
    setSubmitting(true);
    try {
      if (fallbackMode) {
        // Fallback mode: update local state only
        const updatedStores = stores.map(store => 
          store.seller_id === selectedStore.seller_id 
            ? { ...store, status: newStatus }
            : store
        );
        setStores(updatedStores);
        alert(`✅ Status toko berhasil diubah menjadi ${newStatus}!\n\n⚠️ Mode Fallback: Perubahan hanya di local, backend tidak tersedia.`);
      } else {
        await updateStoreStatus(selectedStore.seller_id, newStatus, statusReason);
        alert(`✅ Status toko berhasil diubah menjadi ${newStatus}!`);
        fetchStores();
      }
      setShowStatusModal(false);
      setSelectedStore(null);
      setNewStatus('');
      setStatusReason('');
    } catch (err) {
      console.error('Update store status error:', err);
      alert('❌ Gagal mengubah status toko: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReportStatus = async () => {
    if (!selectedReport || !newStatus) return;
    
    setSubmitting(true);
    try {
      if (fallbackMode) {
        // Fallback mode: update local state only
        const updatedReports = reports.map(report => 
          report.report_id === selectedReport.report_id 
            ? { ...report, status: newStatus, admin_notes: adminNotes }
            : report
        );
        setReports(updatedReports);
        alert(`✅ Status laporan berhasil diubah menjadi ${newStatus}!\n\n⚠️ Mode Fallback: Perubahan hanya di local, backend tidak tersedia.`);
      } else {
        await updateReportStatus(selectedReport.report_id, newStatus, adminNotes);
        alert(`✅ Status laporan berhasil diubah menjadi ${newStatus}!`);
        fetchReports();
        fetchReportStatistics();
      }
      setShowReportModal(false);
      setSelectedReport(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (err) {
      console.error('Update report status error:', err);
      alert('❌ Gagal mengubah status laporan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Tidak Aktif' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspend' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      investigating: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Investigasi' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <AdminSidebar>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kelola Toko & Laporan
            </h1>
            <p className="text-gray-600">
              Kelola toko penjual dan tangani laporan toko
            </p>
          </div>

          {/* Fallback Warning */}
          {fallbackMode && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Mode Fallback Aktif:</strong> Backend tidak tersedia, menggunakan data static untuk development.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('stores')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'stores'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📦 Kelola Toko ({storeStats?.total_stores || 0})
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🚨 Laporan Toko ({reportStats?.total_reports || 0})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Store Management Tab */}
              {activeTab === 'stores' && (
                <>
                  {/* Statistics */}
                  {storeStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600 mb-1">Total Toko</div>
                        <div className="text-2xl font-bold text-blue-900">{storeStats.total_stores}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm text-green-600 mb-1">Aktif</div>
                        <div className="text-2xl font-bold text-green-900">{storeStats.by_status.active}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Tidak Aktif</div>
                        <div className="text-2xl font-bold text-gray-900">{storeStats.by_status.inactive}</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-sm text-red-600 mb-1">Suspend</div>
                        <div className="text-2xl font-bold text-red-900">{storeStats.by_status.suspended}</div>
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={storeStatusFilter}
                        onChange={(e) => {
                          setStoreStatusFilter(e.target.value);
                          setStorePage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="suspended">Suspend</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
                      <input
                        type="text"
                        placeholder="Cari nama toko, penjual, email..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setStorePage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Stores Table */}
                  {storesLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : stores.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <p>Tidak ada toko ditemukan</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toko</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penjual</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stores.map((store) => (
                              <tr key={store.seller_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <img 
                                      src={store.store_photo} 
                                      alt={store.store_name}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">{store.store_name}</div>
                                      <div className="text-xs text-gray-500">ID: {store.seller_id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">{store.seller_info.full_name}</div>
                                  <div className="text-xs text-gray-500">{store.seller_info.email}</div>
                                  <div className="text-xs text-gray-500">{store.seller_info.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">{store.location.regency}</div>
                                  <div className="text-xs text-gray-500">{store.location.province}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <span className="text-yellow-500">★</span>
                                    <span className="ml-1 text-sm font-semibold">{store.statistics.rating_average}</span>
                                    <span className="ml-1 text-xs text-gray-500">({store.statistics.total_reviews})</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-semibold text-gray-900">{store.statistics.total_products}</div>
                                  <div className="text-xs text-gray-500">{store.statistics.active_products} aktif</div>
                                </td>
                                <td className="px-6 py-4">
                                  {getStatusBadge(store.status)}
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => {
                                      setSelectedStore(store);
                                      setShowStatusModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Ubah Status
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {storePagination && storePagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Halaman {storePagination.page} dari {storePagination.totalPages}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setStorePage(Math.max(1, storePage - 1))}
                              disabled={!storePagination.hasPrev}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setStorePage(storePage + 1)}
                              disabled={!storePagination.hasNext}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Store Reports Tab */}
              {activeTab === 'reports' && (
                <>
                  {/* Report Statistics */}
                  {reportStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600 mb-1">Total Laporan</div>
                        <div className="text-2xl font-bold text-blue-900">{reportStats.total_reports}</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="text-sm text-yellow-600 mb-1">Pending</div>
                        <div className="text-2xl font-bold text-yellow-900">{reportStats.by_status.pending}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-blue-600 mb-1">Investigasi</div>
                        <div className="text-2xl font-bold text-blue-900">{reportStats.by_status.investigating}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm text-green-600 mb-1">Selesai</div>
                        <div className="text-2xl font-bold text-green-900">{reportStats.by_status.resolved}</div>
                      </div>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={reportStatusFilter}
                        onChange={(e) => {
                          setReportStatusFilter(e.target.value);
                          setReportPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="investigating">Investigasi</option>
                        <option value="resolved">Selesai</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
                      <input
                        type="text"
                        placeholder="Cari alasan, toko..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setReportPage(1);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Reports Table */}
                  {reportsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <p>Tidak ada laporan ditemukan</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <div key={report.report_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start gap-3">
                                <img 
                                  src={report.seller.store_photo}
                                  alt={report.seller.store_name}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">{report.seller.store_name}</h3>
                                  <p className="text-sm text-gray-600">{report.seller.user.email}</p>
                                </div>
                              </div>
                              {getStatusBadge(report.status)}
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">Alasan Laporan:</div>
                              <div className="text-sm text-gray-900">{report.reason}</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">Bukti:</div>
                              <div className="text-sm text-gray-900">{report.evidence}</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              <div>
                                <span className="text-gray-600">Dilaporkan oleh:</span>
                                <span className="ml-2 font-medium">{report.reporter.full_name}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Tanggal:</span>
                                <span className="ml-2 font-medium">{formatDate(report.created_at)}</span>
                              </div>
                            </div>
                            
                            {report.admin_notes && (
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                                <div className="text-sm font-medium text-blue-900 mb-1">Catatan Admin:</div>
                                <div className="text-sm text-blue-800">{report.admin_notes}</div>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowReportModal(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                              >
                                Kelola Laporan
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {reportPagination && reportPagination.total_pages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Halaman {reportPagination.current_page} dari {reportPagination.total_pages}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setReportPage(Math.max(1, reportPage - 1))}
                              disabled={!reportPagination.has_prev}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setReportPage(reportPage + 1)}
                              disabled={!reportPagination.has_next}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Change Store Status Modal */}
          {showStatusModal && selectedStore && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ubah Status Toko: {selectedStore.store_name}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Baru</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="suspended">Suspend</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alasan (Opsional)</label>
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Masukkan alasan perubahan status..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleChangeStoreStatus}
                    disabled={submitting || !newStatus}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Memproses...' : 'Ubah Status'}
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedStore(null);
                      setNewStatus('');
                      setStatusReason('');
                    }}
                    disabled={submitting}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Report Modal */}
          {showReportModal && selectedReport && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Kelola Laporan #{selectedReport.report_id}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Baru</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Status</option>
                    <option value="pending">Pending</option>
                    <option value="investigating">Investigasi</option>
                    <option value="resolved">Selesai</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Admin</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Masukkan catatan tindak lanjut..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateReportStatus}
                    disabled={submitting || !newStatus}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Memproses...' : 'Update Status'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setSelectedReport(null);
                      setNewStatus('');
                      setAdminNotes('');
                    }}
                    disabled={submitting}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default KelolaStorePagePage;
