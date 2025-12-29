import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import buyerTransactionAPI from '../services/buyerTransactionAPI';
import CourierLogo from '../components/CourierLogo';
import { formatPrice } from "../data/products";
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  BanknotesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'tracking'

  useEffect(() => {
    fetchOrderDetail();
    fetchTrackingInfo();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📦 Fetching order detail for ID:', id);
      const response = await buyerTransactionAPI.getTransactionDetail(id);
      
      if (response.success) {
        setOrder(response.data);
        console.log('✅ Order detail loaded:', response.data.order_number);
      }
    } catch (err) {
      console.error('❌ Error loading order detail:', err);
      setError(err.response?.data?.message || 'Gagal memuat detail pesanan');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      console.log('🚚 Fetching tracking info for ID:', id);
      const response = await buyerTransactionAPI.getTrackingInfo(id);
      
      if (response.success) {
        setTracking(response.data.tracking);
        console.log('✅ Tracking info loaded');
      }
    } catch (err) {
      console.error('❌ Error loading tracking:', err);
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

  const getPaymentStatusBadge = (status) => {
    const badges = {
      unpaid: { label: 'Belum Dibayar', color: 'bg-red-100 text-red-800' },
      paid: { label: 'Sudah Dibayar', color: 'bg-green-100 text-green-800' },
      refunded: { label: 'Dikembalikan', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[status] || badges.unpaid;
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
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Memuat detail pesanan...</span>
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
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/pesanan')}
                  variant="outline"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Button 
                  onClick={fetchOrderDetail}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
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
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pesanan Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-6">
                Pesanan dengan ID {id} tidak ditemukan
              </p>
              <Button 
                onClick={() => navigate('/pesanan')}
                className="bg-red-600 hover:bg-red-700"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Kembali ke Pesanan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.order_status);
  const paymentBadge = getPaymentStatusBadge(order.payment_status);
  const StatusIcon = statusBadge.icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <BuyerNavbar />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/pesanan')}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detail Pesanan
                </h1>
                <p className="text-sm text-gray-600">
                  Order ID: {order.order_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusBadge.color}`}>
                <StatusIcon className="w-4 h-4 inline mr-2" />
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                Detail Pesanan
              </button>
              {order.tracking_number && (
                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tracking'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TruckIcon className="w-5 h-5 inline mr-2" />
                  Lacak Paket
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'details' ? (
              <>
                {/* Product Items */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <ShoppingBagIcon className="w-5 h-5 mr-2 text-red-600" />
                      Produk yang Dipesan
                    </h2>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                          <img
                            src={item.product_image || 'https://via.placeholder.com/100'}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.product_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                            <p className="text-sm font-semibold text-red-600">
                              Subtotal: {formatPrice(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Info */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-red-600" />
                      Informasi Penjual
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {order.seller_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.seller_name}</p>
                          <p className="text-sm text-gray-600">Penjual Terpercaya</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/toko/${order.seller_id}`)}
                      >
                        Kunjungi Toko
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-red-600" />
                      Alamat Pengiriman
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {order.shipping_address || 'Alamat tidak tersedia'}
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Tracking Tab */
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TruckIcon className="w-5 h-5 mr-2 text-red-600" />
                    Informasi Pengiriman
                  </h2>
                  
                  {tracking ? (
                    <div className="space-y-6">
                      {/* Courier Info */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CourierLogo code={order.shipping_courier} className="w-16 h-16" />
                          <div>
                            <p className="text-sm text-gray-600">Kurir</p>
                            <p className="font-semibold text-gray-900">{order.shipping_courier?.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">No. Resi</p>
                          <p className="font-mono font-semibold text-gray-900">
                            {tracking.tracking_number}
                          </p>
                        </div>
                      </div>

                      {/* Tracking Timeline */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Riwayat Pengiriman</h3>
                        <div className="space-y-4">
                          {tracking.history?.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                  index === 0 ? 'bg-red-600' : 'bg-gray-300'
                                }`}></div>
                                {index !== tracking.history.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-300"></div>
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="font-semibold text-gray-900">{item.status}</p>
                                <p className="text-sm text-gray-600">{item.location}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(item.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      {tracking.estimated_delivery && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <CalendarIcon className="w-4 h-4 inline mr-2" />
                            Estimasi tiba: {formatDate(tracking.estimated_delivery)}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TruckIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Informasi tracking belum tersedia</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Ringkasan Pesanan
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(order.total_amount - 15000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkir</span>
                    <span className="font-semibold">{formatPrice(15000)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-red-600 text-lg">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="w-5 h-5 mr-2 text-red-600" />
                  Pembayaran
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                    <p className="font-semibold text-gray-900">
                      {getPaymentLabel(order.payment_method)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status Pembayaran</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${paymentBadge.color}`}>
                      {paymentBadge.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-red-600" />
                  Timeline
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Pesanan Dibuat</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  {order.paid_at && (
                    <div>
                      <p className="text-gray-600">Dibayar</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.paid_at)}
                      </p>
                    </div>
                  )}
                  {order.shipped_at && (
                    <div>
                      <p className="text-gray-600">Dikirim</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.shipped_at)}
                      </p>
                    </div>
                  )}
                  {order.delivered_at && (
                    <div>
                      <p className="text-gray-600">Diterima</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.delivered_at)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {order.order_status === 'pending' && (
              <Card>
                <CardContent className="p-6">
                  <Button className="w-full bg-red-600 hover:bg-red-700 mb-3">
                    <BanknotesIcon className="w-5 h-5 mr-2" />
                    Bayar Sekarang
                  </Button>
                  <Button variant="outline" className="w-full">
                    Batalkan Pesanan
                  </Button>
                </CardContent>
              </Card>
            )}

            {order.order_status === 'delivered' && (
              <Card>
                <CardContent className="p-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Pesanan Diterima
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ajukan Komplain
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Help */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Butuh Bantuan?
                </h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Hubungi Customer Service
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Chat dengan Penjual
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
