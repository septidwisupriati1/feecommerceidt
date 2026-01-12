import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import EmptyState from "../components/EmptyState";
import { isNewBuyer } from '../utils/buyerStatus';
import buyerTransactionAPI from '../services/buyerTransactionAPI';
import CourierLogo, { CourierBadge } from '../components/CourierLogo';
import { formatPrice } from "../data/products";
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });
  
  // TODO: Temporarily disabled due to import issue
  // const newBuyer = isNewBuyer();

  // TODO: Re-enable empty state when import issue resolved
  // if (newBuyer) {
  //   return (
  //     <div style={{
  //       minHeight: '100vh',
  //       background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
  //       backgroundAttachment: 'fixed'
  //     }}>
  //       <BuyerNavbar />
  //       <div className="container mx-auto px-4 py-12">
  //         <EmptyState
  //           title="Belum Ada Pesanan"
  //           description="Anda belum pernah melakukan pembelian. Mulai belanja sekarang!"
  //           actionLabel="Mulai Belanja"
  //           onAction={() => navigate('/produk')}
  //           icon="shopping-bag"
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, [selectedFilter, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort_by: 'created_at',
        sort_order: 'desc'
      };
      
      // Add status filter if not 'all'
      if (selectedFilter !== 'all') {
        params.status = selectedFilter;
      }
      
      console.log('📦 Fetching orders with params:', params);
      const response = await buyerTransactionAPI.getTransactions(params);
      
      if (response.success) {
        setOrders(response.data.transactions || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          total: response.data.pagination?.total || 0,
          total_pages: response.data.pagination?.total_pages || 0
        });
        console.log('✅ Orders loaded:', response.data.transactions?.length || 0);
      }
    } catch (err) {
      console.error('❌ Error loading orders:', err);
      setError(err.response?.data?.message || 'Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  // Status badges
  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        label: 'Menunggu Pembayaran', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: ClockIcon 
      },
      paid: { 
        label: 'Menunggu Konfirmasi', 
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: ClockIcon 
      },
      processing: { 
        label: 'Diproses', 
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: ClockIcon 
      },
      shipped: { 
        label: 'Dikirim', 
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: TruckIcon 
      },
      delivered: { 
        label: 'Telah Sampai', 
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircleIcon 
      },
      completed: { 
        label: 'Selesai', 
        color: 'bg-teal-100 text-teal-800 border-teal-300',
        icon: CheckCircleIcon 
      },
      cancelled: { 
        label: 'Dibatalkan', 
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircleIcon 
      }
    };
    return badges[status] || badges.pending;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get payment method label
  const getPaymentLabel = (method) => {
    const labels = {
      manual_transfer: 'Transfer Bank Manual',
      transfer: 'Transfer Bank',
      ewallet: 'E-Wallet',
      credit: 'Kartu Kredit/Debit',
      cod: 'COD (Cash on Delivery)'
    };
    return labels[method] || method;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat pesanan...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Gagal Memuat Data
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => fetchOrders()}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white'
                }}
              >
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0 && !loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Belum Ada Pesanan
              </h2>
              <p className="text-gray-600 mb-6">
                Anda belum memiliki riwayat pesanan
              </p>
              <Button 
                onClick={() => navigate('/produk')}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white'
                }}
              >
                Mulai Belanja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <BuyerNavbar />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(239, 246, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%)',
        padding: '3rem 0',
        borderBottom: '1px solid rgba(147, 197, 253, 0.2)'
      }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: '#1e40af' }}>
            Pesanan Saya
          </h1>
          <p className="text-lg text-center" style={{ color: '#6b7280' }}>
            {pagination.total} pesanan dalam riwayat
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('all');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'all' ? 'font-bold' : ''}
                style={selectedFilter === 'all' ? {
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white'
                } : {}}
              >
                Semua ({pagination.total})
              </Button>
              <Button
                variant={selectedFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('pending');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Menunggu Pembayaran
              </Button>
              <Button
                variant={selectedFilter === 'paid' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('paid');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                style={selectedFilter === 'paid' ? {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white'
                } : {}}
              >
                Menunggu Konfirmasi
              </Button>
              <Button
                variant={selectedFilter === 'processing' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('processing');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'processing' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                Diproses
              </Button>
              <Button
                variant={selectedFilter === 'shipped' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('shipped');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'shipped' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Dikirim
              </Button>
              <Button
                variant={selectedFilter === 'delivered' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('delivered');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Telah Sampai
              </Button>
              <Button
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('completed');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'completed' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                Selesai
              </Button>
              <Button
                variant={selectedFilter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedFilter('cancelled');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={selectedFilter === 'cancelled' ? 'bg-gray-600 hover:bg-gray-700' : ''}
              >
                Dibatalkan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">Tidak ada pesanan dengan status ini</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const statusBadge = getStatusBadge(order.order_status);
              const StatusIcon = statusBadge.icon;

              return (
                <Card 
                      key={order.order_id} 
                      className="overflow-hidden"
                    >
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{order.order_number}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusBadge.color}`}>
                              <StatusIcon className="h-4 w-4" />
                              {statusBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                          {order.seller && (
                            <p className="text-sm text-gray-600 mt-1">
                              🏪 {order.seller.store_name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Pembayaran</p>
                          <p className="text-2xl font-bold text-red-600">{formatPrice(order.total_amount)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-3 mb-4">
                        {order.items?.map((item) => (
                          <div key={item.order_item_id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                              {item.product_image ? (
                                <img 
                                  src={item.product_image} 
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {item.product_name}
                              </h4>
                              {item.variant && (
                                <p className="text-xs text-gray-500 mb-1">{item.variant}</p>
                              )}
                              <p className="text-sm text-gray-600 mb-2">
                                {item.quantity} x {formatPrice(item.price)}
                              </p>
                              <p className="font-bold text-gray-900">
                                Subtotal: {formatPrice(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        {/* Shipping Info */}
                        <div className="space-y-2">
                          {order.shipping_address && (
                            <div className="flex items-start gap-2">
                              <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">Alamat Pengiriman</p>
                                <p className="text-sm text-gray-600">{order.shipping_address.recipient_name}</p>
                                <p className="text-sm text-gray-600">{order.shipping_address.full_address}</p>
                                <p className="text-sm text-gray-600">
                                  {order.shipping_address.recipient_phone}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Tracking Info - Integrasi dengan Courier Logo */}
                          {order.tracking?.tracking_number ? (
                            <div className="flex items-start gap-2">
                              <TruckIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm mb-2">Informasi Pengiriman</p>
                                
                                {/* Courier Logo */}
                                <div className="flex items-center gap-2 mb-2">
                                  <CourierLogo 
                                    code={order.tracking.shipping_courier?.toLowerCase()} 
                                    size="sm"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {order.tracking.shipping_courier}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Resi: {order.tracking.tracking_number}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Tracking URL Button */}
                                {order.tracking.tracking_url && (
                                  <a
                                    href={order.tracking.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    🔍 Lacak Paket di Website Kurir →
                                  </a>
                                )}
                                
                                {order.tracking.estimated_delivery && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Est. Tiba: {formatDate(order.tracking.estimated_delivery)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <TruckIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">Informasi Pengiriman</p>
                                <p className="text-sm text-gray-600">
                                  {order.order_status === 'pending' || order.order_status === 'paid' 
                                    ? 'Menunggu pembayaran' 
                                    : 'Nomor resi belum tersedia'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Ongkir: {formatPrice(order.shipping_cost)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CreditCardIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">Metode Pembayaran</p>
                              <p className="text-sm text-gray-600">{getPaymentLabel(order.payment_method)}</p>
                              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.payment_status === 'unpaid'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.payment_status === 'paid' ? '✓ Lunas' : 
                                 order.payment_status === 'unpaid' ? '⏳ Belum Bayar' : order.payment_status}
                              </span>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Subtotal Produk</span>
                              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Ongkir</span>
                              <span className={order.shipping_cost === 0 ? 'text-green-600 font-semibold' : 'text-gray-900'}>
                                {order.shipping_cost === 0 ? 'GRATIS' : formatPrice(order.shipping_cost)}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t border-blue-200">
                              <span className="text-gray-900">Total</span>
                              <span className="text-red-600">{formatPrice(order.total_amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                        {order.order_status === 'pending' && (
                          <>
                            <Button 
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                color: 'white'
                              }}
                              onClick={() => alert('Fitur upload bukti pembayaran akan segera tersedia')}
                            >
                              📤 Upload Bukti Bayar
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                                  alert('Fitur batalkan pesanan akan segera tersedia');
                                }
                              }}
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Batalkan Pesanan
                            </Button>
                          </>
                        )}
                        {(order.order_status === 'paid' || order.order_status === 'processing') && (
                          <Button 
                            variant="outline"
                            className="flex-1"
                            disabled
                          >
                            ⏳ Menunggu Seller Proses
                          </Button>
                        )}
                        {order.order_status === 'shipped' && (
                          <>
                            {order.tracking?.tracking_url && (
                              <Button 
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open(order.tracking.tracking_url, '_blank')}
                              >
                                🚚 Lacak Pengiriman
                              </Button>
                            )}
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                if (confirm('Konfirmasi bahwa pesanan telah diterima?')) {
                                  alert('Fitur konfirmasi penerimaan akan segera tersedia');
                                }
                              }}
                            >
                              ✓ Pesanan Diterima
                            </Button>
                          </>
                        )}
                        {order.order_status === 'delivered' && (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => navigate('/produk')}
                              className="flex-1"
                            >
                              🔁 Beli Lagi
                            </Button>
                            <Button 
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => alert('Fitur ulasan akan segera tersedia')}
                            >
                              ⭐ Beri Ulasan
                            </Button>
                          </>
                        )}
                        {order.order_status === 'completed' && (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => navigate('/produk')}
                              className="flex-1"
                            >
                              🔁 Beli Lagi
                            </Button>
                            <Button 
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => alert('Fitur ulasan akan segera tersedia')}
                            >
                              ⭐ Beri Ulasan
                            </Button>
                          </>
                        )}
                        {order.order_status === 'cancelled' && (
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/produk')}
                            className="flex-1"
                          >
                            🛍️ Belanja Lagi
                          </Button>
                        )}
                        
                        {/* Detail Button for All Status */}
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            setModalOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="w-full md:w-auto hover:cursor-pointer"
                        >
                          📋 Lihat Detail Lengkap
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && modalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative w-full max-w-4xl mx-4">
              <Card>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold">Detail Pesanan - {modalOrder.order_number}</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setShowDetailModal(false)} className="hover:cursor-pointer">Tutup</Button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
                    <div className="space-y-3">
                      {modalOrder.items?.map((item) => (
                        <div key={item.order_item_id} className="flex gap-4 pb-4 border-b last:border-0">
                          <img
                            src={item.product_image || 'https://via.placeholder.com/100'}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{item.product_name}</h4>
                            {item.variant && <p className="text-xs text-gray-500 mb-1">{item.variant}</p>}
                            <p className="text-sm text-gray-600">{item.quantity} x {formatPrice(item.price)}</p>
                            <p className="text-sm font-semibold text-red-600">Subtotal: {formatPrice(item.subtotal || (item.quantity * item.price))}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold">Informasi Pengiriman</h4>
                        <p className="text-sm text-gray-600 mt-1">{modalOrder.shipping_address?.recipient_name}</p>
                        <p className="text-sm text-gray-600">{modalOrder.shipping_address?.full_address || modalOrder.shipping_address}</p>
                        <p className="text-sm text-gray-600">{modalOrder.shipping_address?.recipient_phone}</p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Kurir: {modalOrder.tracking?.shipping_courier || modalOrder.shipping_courier || '-'}</p>
                          {modalOrder.tracking?.tracking_number && (
                            <p className="text-sm text-gray-600">Resi: {modalOrder.tracking.tracking_number}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold">Pembayaran & Ringkasan</h4>
                        <p className="text-sm text-gray-600 mt-1">Metode: {getPaymentLabel(modalOrder.payment_method)}</p>
                        <p className="text-sm text-gray-600">Status Pembayaran: {modalOrder.payment_status}</p>
                        <div className="mt-3 bg-blue-50 p-3 rounded">
                          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(modalOrder.subtotal)}</span></div>
                          <div className="flex justify-between text-sm"><span>Ongkir</span><span>{formatPrice(modalOrder.shipping_cost)}</span></div>
                          <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span className="text-red-600">{formatPrice(modalOrder.total_amount)}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Halaman {pagination.page} dari {pagination.total_pages} 
                  <span className="ml-2">({pagination.total} total pesanan)</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    ← Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.total_pages}
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
    </div>
  );
}
