import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  getAutoCancelledOrders,
  getAutoCancelStatistics,
  getCronConfiguration,
  updateCronConfiguration,
  triggerManualRun
} from '../../services/adminAutoCancelAPI';
import {
  ClockIcon,
  PlayIcon,
  Cog6ToothIcon,
  XCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CubeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function AutoCancelConfigPage() {
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 20;
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Config modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    expiry_duration_hours: 24,
    schedule: '0 * * * *',
    is_enabled: true
  });

  useEffect(() => {
    fetchAll();
  }, [currentPage]);

  useEffect(() => {
    if (dateFrom || dateTo) {
      setCurrentPage(1);
      fetchOrders();
    }
  }, [dateFrom, dateTo]);

  const fetchAll = () => {
    fetchOrders();
    fetchStatistics();
    fetchConfig();
  };

  const fetchOrders = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined
    };
    
    const result = await getAutoCancelledOrders(params);
    setOrders(result.data);
    setPagination(result.pagination);
    setLoading(false);
  };

  const fetchStatistics = async () => {
    const result = await getAutoCancelStatistics();
    setStatistics(result.data);
  };

  const fetchConfig = async () => {
    const result = await getCronConfiguration();
    setConfig(result.data);
    setConfigForm({
      expiry_duration_hours: result.data.expiry_duration_hours,
      schedule: result.data.schedule,
      is_enabled: result.data.is_enabled
    });
  };

  const handleTriggerManual = async () => {
    if (!confirm('Yakin ingin menjalankan auto-cancel sekarang?')) return;
    
    setTriggerLoading(true);
    try {
      const result = await triggerManualRun();
      alert(`✅ ${result.message}\n\nOrders cancelled: ${result.data?.cancelled_count || 0}`);
      fetchAll();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setTriggerLoading(false);
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    
    try {
      await updateCronConfiguration(configForm);
      alert('✅ Konfigurasi berhasil diperbarui');
      setShowConfigModal(false);
      fetchConfig();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScheduleDescription = (cronExpression) => {
    const schedules = {
      '0 * * * *': 'Setiap jam',
      '*/30 * * * *': 'Setiap 30 menit',
      '0 */2 * * *': 'Setiap 2 jam',
      '0 0 * * *': 'Setiap hari jam 00:00',
      '0 2 * * *': 'Setiap hari jam 02:00'
    };
    return schedules[cronExpression] || cronExpression;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Auto-Cancel Orders Configuration
            </h1>
            <p className="text-gray-600">
              Monitor dan kelola sistem pembatalan otomatis untuk pesanan yang belum dibayar
            </p>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <XCircleIcon className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Auto-Cancel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.total_auto_cancelled.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <CalendarDaysIcon className="w-10 h-10 text-orange-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.today_auto_cancelled.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <ChartBarIcon className="w-10 h-10 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Minggu Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.this_week_auto_cancelled.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <CubeIcon className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Stok Dikembalikan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.total_stock_released.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <BanknotesIcon className="w-10 h-10 text-purple-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Nilai</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(statistics.total_amount_cancelled)}
                </p>
              </div>
            </div>
          )}

          {/* Configuration Card */}
          {config && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Cog6ToothIcon className="w-6 h-6 mr-2" />
                  Konfigurasi Cron Job
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    Edit Konfigurasi
                  </button>
                  <button
                    onClick={handleTriggerManual}
                    disabled={triggerLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {triggerLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                    Jalankan Sekarang
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jadwal</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getScheduleDescription(config.schedule)}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{config.schedule}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Durasi Kadaluarsa</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {config.expiry_duration_hours} jam
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pesanan dibatalkan jika tidak dibayar dalam {config.expiry_duration_hours} jam
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {config.is_enabled ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        Aktif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1">
                        <XCircleIcon className="w-4 h-4" />
                        Nonaktif
                      </span>
                    )}
                  </div>
                  {config.next_run && (
                    <p className="text-xs text-gray-500 mt-1">
                      Next run: {formatDateTime(config.next_run)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Pesanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Pesanan yang Di-cancel Otomatis
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: {pagination.total || 0} pesanan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cancelled At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <ArrowPathIcon className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
                        <p className="text-gray-600">Loading...</p>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <XCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">Tidak ada pesanan yang di-cancel otomatis</p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{order.buyer_name}</div>
                          <div className="text-xs text-gray-500">{order.buyer_email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.total_items} item
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDateTime(order.cancelled_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                            Auto-cancelled
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Halaman {pagination.page} dari {pagination.total_pages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.has_prev}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.has_next}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Config Modal */}
          {showConfigModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Edit Konfigurasi</h3>
                </div>
                <form onSubmit={handleUpdateConfig} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi Kadaluarsa (jam)
                    </label>
                    <input
                      type="number"
                      value={configForm.expiry_duration_hours}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        expiry_duration_hours: parseInt(e.target.value)
                      })}
                      min="1"
                      max="72"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jadwal Cron
                    </label>
                    <select
                      value={configForm.schedule}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        schedule: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0 * * * *">Setiap jam</option>
                      <option value="*/30 * * * *">Setiap 30 menit</option>
                      <option value="0 */2 * * *">Setiap 2 jam</option>
                      <option value="0 0 * * *">Setiap hari jam 00:00</option>
                      <option value="0 2 * * *">Setiap hari jam 02:00</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configForm.is_enabled}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        is_enabled: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Aktifkan auto-cancel
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
