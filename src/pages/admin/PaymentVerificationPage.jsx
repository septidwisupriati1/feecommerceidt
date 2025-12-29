import React, { useState, useEffect } from 'react';
import {
  getPendingPayments,
  getPaymentDetail,
  approvePayment,
  rejectPayment,
  getPendingPaymentsFallback,
  getPaymentDetailFallback,
} from '../../services/adminPaymentVerificationAPI';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';

const PaymentVerificationPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('pending_verification');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // Rejection form
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, searchQuery, currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    const params = {
      status: statusFilter,
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery || undefined,
    };
    
    const result = await getPendingPayments(params);
    
    setPayments(result.data.orders);
    setTotalPages(result.data.pagination.total_pages);
    setTotalItems(result.data.pagination.total_items);
    setFallbackMode(!!result.message?.includes('FALLBACK'));
    setLoading(false);
  };

  const handleViewDetail = async (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
    setLoadingDetail(true);
    
    try {
      const result = await getPaymentDetail(payment.order_id);
      setPaymentDetail(result.data);
    } catch (err) {
      console.error('Failed to fetch payment detail, using fallback:', err);
      const fallbackResult = getPaymentDetailFallback(payment.order_id);
      setPaymentDetail(fallbackResult.data);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    
    setSubmitting(true);
    try {
      const result = await approvePayment(selectedPayment.order_id);
      
      if (result._fallback) {
        // Update local state for fallback mode
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.order_id === selectedPayment.order_id 
              ? { ...p, payment_status: 'approved', order_status: 'processing' }
              : p
          )
        );
        alert('Pembayaran berhasil disetujui! ⚠️ Mode Fallback: Perubahan hanya di local');
      } else {
        alert('Pembayaran berhasil disetujui!');
        fetchPayments();
      }
      
      setShowApproveModal(false);
      setShowDetailModal(false);
    } catch (err) {
      alert('Gagal menyetujui pembayaran: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      alert('Alasan penolakan wajib diisi!');
      return;
    }
    
    setSubmitting(true);
    try {
      const result = await rejectPayment(selectedPayment.order_id, {
        rejection_reason: rejectionReason,
      });
      
      if (result._fallback) {
        // Update local state for fallback mode
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.order_id === selectedPayment.order_id 
              ? { ...p, payment_status: 'rejected', payment_rejection_reason: rejectionReason }
              : p
          )
        );
        alert('Pembayaran berhasil ditolak! ⚠️ Mode Fallback: Perubahan hanya di local');
      } else {
        alert('Pembayaran berhasil ditolak!');
        fetchPayments();
      }
      
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectionReason('');
    } catch (err) {
      alert('Gagal menolak pembayaran: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
      pending_verification: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Verifikasi' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disetujui' },
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
            Verifikasi Pembayaran
          </h1>
          <p className="text-gray-600">
            Kelola verifikasi pembayaran manual transfer dari pembeli
          </p>
        </div>

        {/* Fallback Mode Warning */}
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pembayaran
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="pending_verification">Menunggu Verifikasi</option>
                <option value="rejected">Ditolak</option>
                <option value="all">Semua</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pencarian
              </label>
              <input
                type="text"
                placeholder="Cari nomor order, nama pembeli, atau toko..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>Tidak ada pembayaran yang perlu diverifikasi</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pembeli
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toko
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.order_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.order_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.items_count} item
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.buyer.name}</div>
                          <div className="text-xs text-gray-500">{payment.buyer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.seller.store_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.total_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.payment_status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(payment.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetail(payment)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Menampilkan{' '}
                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' '}-{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>
                        {' '}dari{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}pembayaran
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detail Pembayaran
                </h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setPaymentDetail(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingDetail ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : paymentDetail ? (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Informasi Order</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nomor Order</p>
                        <p className="font-medium">{paymentDetail.order_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status Pembayaran</p>
                        {getStatusBadge(paymentDetail.payment_status)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-lg">{formatCurrency(paymentDetail.total_amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Order</p>
                        <p className="font-medium">{formatDate(paymentDetail.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bukti Pembayaran</h4>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img
                        src={paymentDetail.payment_proof}
                        alt="Payment Proof"
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                        style={{ maxHeight: '400px' }}
                      />
                      <a
                        href={paymentDetail.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Lihat gambar ukuran penuh →
                      </a>
                    </div>
                  </div>

                  {/* Rejection Info (if rejected) */}
                  {paymentDetail.payment_status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Informasi Penolakan</h4>
                      <p className="text-sm text-red-700 mb-2">
                        <strong>Ditolak pada:</strong> {formatDate(paymentDetail.payment_rejected_at)}
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Alasan:</strong> {paymentDetail.payment_rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Buyer & Seller Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Pembeli</h4>
                      <p className="text-sm text-gray-700">{paymentDetail.buyer.name}</p>
                      <p className="text-sm text-gray-600">{paymentDetail.buyer.email}</p>
                      {paymentDetail.buyer.phone && (
                        <p className="text-sm text-gray-600">{paymentDetail.buyer.phone}</p>
                      )}
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Penjual</h4>
                      <p className="text-sm text-gray-700">{paymentDetail.seller.store_name}</p>
                      <p className="text-sm text-gray-600">{paymentDetail.seller.owner_name}</p>
                      <p className="text-sm text-gray-600">{paymentDetail.seller.owner_email}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Item yang Dibeli</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentDetail.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.product_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                              <td className="px-4 py-2 text-sm font-semibold text-gray-900">{formatCurrency(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  {paymentDetail.payment_status === 'pending_verification' && (
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowApproveModal(true)}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                      >
                        ✓ Setujui Pembayaran
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
                      >
                        ✗ Tolak Pembayaran
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500">Detail tidak tersedia</p>
              )}
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Konfirmasi Persetujuan
              </h3>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menyetujui pembayaran ini? 
                Order akan diproses dan status akan berubah menjadi "Diproses".
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Ya, Setujui'}
                </button>
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tolak Pembayaran
              </h3>
              <p className="text-gray-700 mb-4">
                Mohon berikan alasan penolakan. Pembeli akan melihat alasan ini dan dapat upload ulang bukti pembayaran.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Bukti transfer tidak jelas. Mohon upload foto yang lebih jelas dengan nominal dan tanggal transfer terlihat."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                rows={4}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleReject}
                  disabled={submitting || !rejectionReason.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Tolak Pembayaran'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
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

export default PaymentVerificationPage;
