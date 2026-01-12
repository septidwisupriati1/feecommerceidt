import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../components/BuyerNavbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import orderAPI from '../services/orderAPI';

export default function PaymentStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, removeSelectedItems } = useCart();
  const { order, paymentResult, status, snapToken } = location.state || {};
  const [pageOrder, setPageOrder] = useState(order || null);
  const [currentStatus, setCurrentStatus] = useState(status || 'pending');

  const searchParams = new URLSearchParams(location.search || '');
  const qpOrderId = searchParams.get('order_id');
  const qpStatusCode = searchParams.get('status_code');
  const qpTxStatus = searchParams.get('transaction_status');
  const qpFraudStatus = searchParams.get('fraud_status');

  // Ensure snap.js is available for retry
  useEffect(() => {
    const existing = document.querySelector('script[src*="snap.js"]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.dataset.clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (order) {
      setPageOrder(order);
      return;
    }
    if (qpOrderId && orders?.length) {
      const found = orders.find((o) => o.order_id === qpOrderId || o.orderNumber === qpOrderId);
      if (found) {
        setPageOrder(found);
        return;
      }
    }
    if (!order && !qpOrderId) {
      navigate('/checkout', { replace: true });
    }
  }, [order, orders, qpOrderId, navigate]);

  // Normalize Midtrans status to paid/pending/unpaid
  useEffect(() => {
    const txStatus = (paymentResult?.transaction_status || qpTxStatus || '').toLowerCase();
    const fraudStatus = (paymentResult?.fraud_status || qpFraudStatus || '').toLowerCase();
    const statusCode = paymentResult?.status_code || qpStatusCode;

    if (status === 'success' || txStatus === 'settlement' || txStatus === 'capture' || txStatus === 'success' || statusCode === '200' || (txStatus === 'capture' && fraudStatus === 'accept')) {
      setCurrentStatus('success');
      return;
    }
    if (status === 'pending' || txStatus === 'pending' || statusCode === '201') {
      setCurrentStatus('pending');
      return;
    }
    if (status === 'error' || status === 'closed' || txStatus === 'deny' || txStatus === 'cancel' || txStatus === 'expire') {
      setCurrentStatus('unpaid');
      return;
    }
    setCurrentStatus((prev) => prev || 'pending');
  }, [status, paymentResult, qpTxStatus, qpStatusCode, qpFraudStatus]);

  const isPaid = useMemo(() => currentStatus === 'success', [currentStatus]);
  const isPending = useMemo(() => currentStatus === 'pending', [currentStatus]);
  const [clearedCart, setClearedCart] = useState(false);
  const [syncedPayment, setSyncedPayment] = useState(false);

  // When payment is confirmed, remove selected items from cart
  useEffect(() => {
    if (isPaid && !clearedCart) {
      try {
        removeSelectedItems();
      } catch (e) {
        console.warn('Failed to clear selected cart items after payment', e);
      }
      setClearedCart(true);
    }
  }, [isPaid, clearedCart, removeSelectedItems]);

  // Sync paid status to backend (in case webhook belum jalan)
  useEffect(() => {
    const syncPaid = async () => {
      if (!isPaid || !pageOrder?.order_id || syncedPayment) return;
      try {
        await orderAPI.confirmMidtransPayment({
          order_id: pageOrder.order_id,
          order_number: pageOrder.order_number,
          transaction_status: paymentResult?.transaction_status || status,
          fraud_status: paymentResult?.fraud_status,
          status_code: paymentResult?.status_code,
          gross_amount: paymentResult?.gross_amount,
          signature_key: paymentResult?.signature_key,
        });
        setSyncedPayment(true);
      } catch (err) {
        console.warn('Failed to sync payment status to backend', err.response?.data || err.message);
      }
    };
    syncPaid();
  }, [isPaid, pageOrder, paymentResult, status, syncedPayment]);

  const handlePayAgain = () => {
    if (!snapToken) return;
    window.snap?.pay(snapToken, {
      onSuccess: (result) => {
        setCurrentStatus('success');
        navigate('/pesanan-saya', { state: { paymentResult: result } });
      },
      onPending: (result) => {
        setCurrentStatus('pending');
        navigate('/payment-status', { state: { order: pageOrder, paymentResult: result, status: 'pending', snapToken } });
      },
      onError: () => setCurrentStatus('unpaid'),
      onClose: () => setCurrentStatus('unpaid')
    });
  };

  const statusBadge = () => {
    if (isPaid) return (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
        <CheckCircleIcon className="h-5 w-5" />
        <span>Pembayaran berhasil</span>
      </div>
    );
    if (isPending) return (
      <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span>Menunggu pembayaran</span>
      </div>
    );
    return (
      <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span>Pembayaran belum selesai</span>
      </div>
    );
  };

  const items = pageOrder?.items || [];
  const subtotal = pageOrder?.subtotal ?? items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 0) || 0), 0);
  const shippingCost = pageOrder?.shipping_cost ?? 0;
  const totalAmount = pageOrder?.total ?? pageOrder?.total_amount ?? subtotal + shippingCost;

  const getItemImage = (item) => {
    return (
      item?.image ||
      item?.product_image ||
      item?.primary_image ||
      item?.image_url ||
      'https://via.placeholder.com/80?text=Produk'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ringkasan Pembayaran</h1>
              <p className="text-sm text-gray-600">Order #{pageOrder?.order_id || pageOrder?.orderNumber}</p>
            </div>
            {statusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Produk</h2>
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-start">
                      <div className="flex gap-3">
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-500">{formatPrice(item.price)} / item</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="self-start">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Ongkir</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-red-600">{formatPrice(totalAmount)}</span>
                </div>
                {!isPaid && (
                  <div className="space-y-2 pt-3">
                    <p className="text-xs text-gray-500">Jika Anda menutup popup atau salah memilih metode, lanjutkan pembayaran di sini.</p>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => navigate('/checkout', { state: { restartPayment: true, order_id: pageOrder?.order_id } })}
                    >
                      Lanjutkan Pembayaran
                    </Button>
                    <div className="border-t border-gray-200 pt-3" />
                  </div>
                )}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white flex-1" onClick={() => navigate('/pesanan-saya')}>
                      Lihat Pesanan Saya
                    </Button>
                    <Button variant="outline" className="flex-1 hover:cursor-pointer" onClick={() => navigate('/home')}>
                      Belanja Lagi
                    </Button>
                  </div>
                  {isPending && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">Status: menunggu pembayaran. Lanjutkan pembayaran di atas jika diperlukan.</p>
                  )}
                  {isPaid && (
                    <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">Status: pembayaran berhasil/berproses. Detail lengkap ada di Pesanan Saya.</p>
                  )}
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
