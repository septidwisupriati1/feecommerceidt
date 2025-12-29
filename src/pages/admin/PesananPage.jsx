import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import CourierLogo from '../../components/CourierLogo';
import { getCourierByCode } from '../../data/couriers';
import { 
  XMarkIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import adminOrderAPI from '../../services/adminOrderAPI';

const PesananPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0
  });
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedPaymentStatus && { payment_status: selectedPaymentStatus }),
        ...(selectedDate && { date_from: selectedDate, date_to: selectedDate }),
        ...(searchQuery && { search: searchQuery })
      };

      // Try API first, fallback to static data if fails
      try {
        const result = await adminOrderAPI.getOrders(params);
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
        setIsFallbackMode(false);
      } catch (apiError) {
        console.warn('API not available, using fallback data:', apiError);
        // Use fallback data
        const fallbackResult = adminOrderAPI.getOrdersFallback(params);
        setOrders(fallbackResult.data.orders);
        setPagination(fallbackResult.data.pagination);
        setIsFallbackMode(true);
      }
    } catch (err) {
      setError(err.message || 'Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [selectedStatus, selectedPaymentStatus, selectedDate]);

  const handleSearch = () => {
    fetchOrders(1);
  };

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Menunggu', color: 'bg-yellow-500' },
      paid: { label: 'Terbayar', color: 'bg-blue-500' },
      processing: { label: 'Diproses', color: 'bg-purple-500' },
      shipped: { label: 'Dikirim', color: 'bg-indigo-500' },
      delivered: { label: 'Diterima', color: 'bg-green-500' },
      completed: { label: 'Selesai', color: 'bg-gray-500' },
      cancelled: { label: 'Dibatalkan', color: 'bg-red-500' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-400' };
    
    return (
      <span className={`px-3 py-1 ${config.color} text-white rounded-full text-xs font-semibold`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      unpaid: { label: 'Belum Dibayar', color: 'bg-red-100 text-red-800' },
      paid: { label: 'Sudah Dibayar', color: 'bg-green-100 text-green-800' },
      refunded: { label: 'Dikembalikan', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 ${config.color} rounded text-xs font-medium`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Pesanan
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola semua pesanan dari pelanggan
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Fallback Mode Warning */}
        {isFallbackMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Mode Fallback</h4>
              <p className="text-sm text-yellow-800">
                Backend API belum tersedia. Menampilkan data contoh. 
                <a 
                  href="/docs/Admin-Order-Management-Yang-Perlu-Ditambahkan.md" 
                  className="ml-1 underline hover:text-yellow-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat dokumentasi endpoint yang diperlukan
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cari Pesanan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="No. Order, Pembeli, Penjual..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Pesanan
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="paid">Terbayar</option>
                <option value="processing">Diproses</option>
                <option value="shipped">Dikirim</option>
                <option value="delivered">Diterima</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Pembayaran
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua</option>
                <option value="unpaid">Belum Dibayar</option>
                <option value="paid">Sudah Dibayar</option>
                <option value="refunded">Dikembalikan</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Pesanan
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Cari
            </button>
            <button
              onClick={() => {
                setSelectedStatus('');
                setSelectedPaymentStatus('');
                setSelectedDate('');
                setSearchQuery('');
                fetchOrders(1);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12">
              <div className="flex flex-col items-center justify-center">
                <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Memuat data pesanan...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Gagal Memuat Data</h4>
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={() => fetchOrders(pagination.page)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg font-medium">Tidak ada pesanan</p>
              <p className="text-gray-400 text-sm mt-2">Belum ada pesanan yang sesuai dengan filter</p>
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <div key={order.order_id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-blue-600 text-lg">{order.order_number}</span>
                        {getStatusBadge(order.order_status)}
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </span>
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>

                    {/* Customer & Seller Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Pembeli</h4>
                        <p className="font-medium text-gray-900">{order.buyer_name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Penjual</h4>
                        <p className="font-medium text-gray-900">{order.seller_name}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{order.total_items}</span> item
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Pembayaran</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} pesanan
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.total_pages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.total_pages ||
                          (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                pagination.page === pageNumber
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === pagination.page - 2 ||
                          pageNumber === pagination.page + 2
                        ) {
                          return <span key={pageNumber} className="px-2">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.total_pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-red-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Detail Pesanan</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-red-700 p-1 rounded transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Menunggu Pembayaran</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Tanya Pembeli</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">No. Invoice</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.dateTime}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Detail Produk</h4>
                  <div className="space-y-2">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="font-semibold text-gray-800">Total Harga</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Info Pengiriman</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. Resi</span>
                    <span className="font-semibold text-gray-800">: {selectedOrder.shipping.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alamat Pengiriman</span>
                    <span className="font-semibold text-gray-800">: {selectedOrder.shipping.address}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </AdminSidebar>
  );
};

export default PesananPage;
