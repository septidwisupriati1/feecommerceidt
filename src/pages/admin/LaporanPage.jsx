import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  getAllReports, 
  updateReportStatus, 
  getReportsStats,
  formatDate,
  getStatusLabel,
  getStatusColor,
  getReportTypeLabel,
  exportReportsToExcel,
  exportReportsToPDF
} from '../../services/reportsAPI';

const LaporanPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch reports on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [currentPage, entriesPerPage, statusFilter]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReports({
        page: currentPage,
        limit: entriesPerPage,
        status: statusFilter || undefined,
        search: searchQuery || undefined
      });
      
      setReports(data.reports || []);
      setPagination(data.pagination || {});
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getReportsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReports();
  };

  const handleStatusChange = async (reportId, newStatus, notes = '') => {
    try {
      const result = await updateReportStatus(reportId, {
        status: newStatus,
        admin_notes: notes || `Status diubah menjadi ${getStatusLabel(newStatus)}`
      });
      
      // If fallback mode, update local state
      if (result._fallback) {
        setReports(prevReports => 
          prevReports.map(report => 
            report.report_id === reportId 
              ? { ...report, status: newStatus, admin_notes: result.admin_notes, updated_at: result.updated_at }
              : report
          )
        );
        alert(`Laporan berhasil diubah menjadi ${getStatusLabel(newStatus)}! ⚠️ Mode Fallback: Perubahan hanya di local`);
      } else {
        // Refresh data from backend
        await fetchReports();
        await fetchStats();
        alert(`Laporan berhasil diubah menjadi ${getStatusLabel(newStatus)}!`);
      }
    } catch (error) {
      alert('Gagal mengubah status: ' + error.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await exportReportsToExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product-reports.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal export Excel: ' + error.message);
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await exportReportsToPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `product-reports-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal export PDF: ' + error.message);
    }
  };

  const getStatusButton = (report) => {
    if (report.status === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleStatusChange(report.report_id, 'investigating')}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600"
          >
            Investigasi
          </button>
          <button 
            onClick={() => handleStatusChange(report.report_id, 'resolved')}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600"
          >
            Selesai
          </button>
          <button 
            onClick={() => handleStatusChange(report.report_id, 'rejected')}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
          >
            Tolak
          </button>
        </div>
      );
    } else if (report.status === 'investigating') {
      return (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleStatusChange(report.report_id, 'resolved')}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600"
          >
            Selesai
          </button>
          <button 
            onClick={() => handleStatusChange(report.report_id, 'rejected')}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
          >
            Tolak
          </button>
        </div>
      );
    } else if (report.status === 'resolved') {
      return (
        <span className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-semibold">
          ✓ Selesai
        </span>
      );
    } else if (report.status === 'rejected') {
      return (
        <span className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-semibold">
          ✗ Ditolak
        </span>
      );
    }
  };

  // Loading state
  if (loading && !reports.length) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat laporan...</p>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Laporan Pelanggan
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola laporan dari pelanggan
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Total Laporan</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_reports}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Menunggu</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.by_status?.pending || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Diinvestigasi</p>
              <p className="text-3xl font-bold text-blue-600">{stats.by_status?.investigating || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-1">Selesai</p>
              <p className="text-3xl font-bold text-green-600">{stats.by_status?.resolved || 0}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari reporter, produk, toko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="investigating">Diinvestigasi</option>
                <option value="resolved">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Cari
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Export Excel"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                title="Export PDF"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-red-600">Data Laporan Pelanggan</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Pelapor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Toko</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Jenis Laporan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data laporan
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={report.report_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">
                        {pagination ? (pagination.page - 1) * pagination.limit + index + 1 : index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm">{formatDate(report.created_at)}</td>
                      <td className="px-4 py-4 text-sm">
                        <div>
                          <div className="font-semibold text-blue-600">{report.reporter_name}</div>
                          <div className="text-xs text-gray-500">{report.reporter_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-semibold text-blue-600">{report.product_name}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-600">{report.store_name}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {getReportTypeLabel(report.report_type)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusButton(report)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {pagination && (
                <>
                  Menampilkan {(pagination.page - 1) * pagination.limit + 1} sampai{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} entri
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={!pagination || currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination || currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {'<'}
              </button>
              <span className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination || currentPage === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => setCurrentPage(pagination?.totalPages || 1)}
                disabled={!pagination || currentPage === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {'>>'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default LaporanPage;
