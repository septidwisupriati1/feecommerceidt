import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { getProductImageUrl, handleImageError } from '../../utils/imageHelper';
import { 
  ArrowLeftIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [showPaymentProof, setShowPaymentProof] = useState(false);

  useEffect(() => {
    // Load order from localStorage
    const ordersData = JSON.parse(localStorage.getItem('seller_orders_data') || '[]');
    const foundOrder = ordersData.find(o => o.id === orderId || o.orderNumber === orderId);
    
    if (foundOrder) {
      // Add payment proof if not exists (for dummy data)
      if (!foundOrder.paymentProof) {
        foundOrder.paymentProof = generatePaymentProof(foundOrder);
      }
      setOrder(foundOrder);
    }
  }, [orderId]);

  const generatePaymentProof = (order) => {
    // Generate dummy payment proof based on payment method
    const proofs = {
      'Transfer Bank BCA': '/images/payment-proof/bca-transfer.jpg',
      'Transfer Bank Mandiri': '/images/payment-proof/mandiri-transfer.jpg',
      'E-Wallet OVO': '/images/payment-proof/ovo-payment.jpg',
      'E-Wallet GoPay': '/images/payment-proof/gopay-payment.jpg',
      'E-Wallet Dana': '/images/payment-proof/dana-payment.jpg'
    };
    
    return {
      image: proofs[order.paymentMethod] || '/images/payment-proof/default-transfer.jpg',
      uploadedAt: order.orderDate,
      verified: order.status !== 'pending' && order.status !== 'cancelled'
    };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Menunggu Pembayaran', icon: ClockIcon },
      processing: { class: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Diproses', icon: CheckCircleIcon },
      shipped: { class: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Dikirim', icon: TruckIcon },
      delivered: { class: 'bg-green-100 text-green-800 border-green-300', label: 'Selesai', icon: CheckCircleIcon },
      cancelled: { class: 'bg-red-100 text-red-800 border-red-300', label: 'Dibatalkan', icon: XCircleIcon }
    };
    return badges[status] || badges.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <p className="text-lg text-gray-600">Pesanan tidak ditemukan</p>
              <Button 
                onClick={() => navigate('/seller/pesanan')}
                className="mt-4"
              >
                Kembali ke Daftar Pesanan
              </Button>
            </CardContent>
          </Card>
        </div>
      </SellerSidebar>
    );
  }

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => navigate('/seller/pesanan')}
            variant="outline"
            className="mb-4 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Detail Pesanan
          </h1>
          <p className="text-lg text-blue-50">
            {order.orderNumber}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Status Pesanan</h2>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusInfo.class}`}>
                    <StatusIcon className="h-5 w-5" />
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Dipesan pada {formatDate(order.orderDate)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Produk yang Dipesan</h2>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border-2 border-gray-200">
                        <img 
                          src={getProductImageUrl(item.image)} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price)} x {item.qty} item
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Proof Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Bukti Pembayaran</h2>
                  {order.paymentProof?.verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      <CheckCircleIcon className="h-4 w-4" />
                      Terverifikasi
                    </span>
                  )}
                </div>
                
                {order.status === 'pending' ? (
                  <div className="text-center py-8 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <ClockIcon className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-semibold mb-1">Menunggu Pembayaran</p>
                    <p className="text-sm text-gray-600">Bukti pembayaran akan muncul setelah buyer melakukan pembayaran</p>
                  </div>
                ) : order.status === 'cancelled' ? (
                  <div className="text-center py-8 bg-red-50 rounded-lg border-2 border-red-200">
                    <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-semibold mb-1">Pesanan Dibatalkan</p>
                    <p className="text-sm text-gray-600">Tidak ada bukti pembayaran</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <PhotoIcon className="h-5 w-5" />
                        <span>Screenshot pembayaran dari buyer</span>
                      </div>
                      
                      <div 
                        className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all"
                        onClick={() => setShowPaymentProof(true)}
                      >
                        <img 
                          src={order.paymentProof?.image || '/images/payment-proof/default-transfer.jpg'} 
                          alt="Bukti Pembayaran"
                          className="w-full h-auto max-h-96 object-contain bg-white"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x400?text=Bukti+Pembayaran';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3">
                            <PhotoIcon className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setShowPaymentProof(true)}
                        variant="outline"
                        className="w-full mt-3"
                      >
                        <PhotoIcon className="h-4 w-4 mr-2" />
                        Lihat Bukti Pembayaran
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Diunggah pada {formatDate(order.paymentProof?.uploadedAt || order.orderDate)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Info Card */}
            {order.trackingNumber && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Pengiriman</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700">Kurir</span>
                      </div>
                      <span className="font-semibold text-gray-900">{order.shippingService}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700">No. Resi</span>
                      </div>
                      <span className="font-mono font-semibold text-blue-600">{order.trackingNumber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Customer Info & Summary */}
          <div className="space-y-6">
            {/* Customer Info Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Pembeli</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <PhoneIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">Nama & Kontak</span>
                    </div>
                    <p className="font-semibold text-gray-900 ml-7">{order.buyer.name}</p>
                    <p className="text-sm text-gray-600 ml-7">{order.buyer.phone}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPinIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">Alamat Pengiriman</span>
                    </div>
                    <p className="text-sm text-gray-900 ml-7 leading-relaxed">
                      {order.buyer.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Pembayaran</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Metode Pembayaran</p>
                      <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card className="shadow-lg border-2 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal Produk</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkos Kirim</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(order.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg bg-blue-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Aksi Pesanan</h3>
                <div className="space-y-2">
                  {order.status === 'pending' && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Konfirmasi Pembayaran
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Kirim Pesanan
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Cetak Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showPaymentProof && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPaymentProof(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-lg">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900">Bukti Pembayaran - {order.orderNumber}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPaymentProof(false)}
              >
                <XCircleIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <img 
                src={order.paymentProof?.image || '/images/payment-proof/default-transfer.jpg'} 
                alt="Bukti Pembayaran"
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Bukti+Pembayaran';
                }}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Metode Pembayaran:</strong> {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Total Pembayaran:</strong> {formatCurrency(order.grandTotal)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Diunggah pada:</strong> {formatDate(order.paymentProof?.uploadedAt || order.orderDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </SellerSidebar>
  );
}
