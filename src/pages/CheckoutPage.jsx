import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from '../context/CartContext';
import { formatPrice } from "../data/products";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from "../services/authAPI";
import { getToken } from "../utils/auth";
import orderAPI from "../services/orderAPI";
import { adaptOrderForPaymentStatus } from "../utils/orderAdapter";

// Persist newly created order to seller-facing localStorage so seller pages can display it
const persistSellerOrderLocal = ({ order, address, itemsPayload, shippingCost, paymentMethod, shippingService }) => {
  const orderNumber = order?.order_number || order?.order_id;
  if (!orderNumber) return;

  const ordersKey = 'seller_orders_data';
  const salesKey = 'seller_sales_data';
  const nowIso = new Date().toISOString();

  const mappedItems = (itemsPayload || []).map((item) => ({
    id: item.product_id,
    name: item.product_name,
    image: item.product_image,
    price: item.price,
    qty: item.quantity,
    subtotal: Number(item.price) * Number(item.quantity || 0)
  }));

  const grandTotal = (order.total_amount || order.total || 0) || mappedItems.reduce((sum, i) => sum + i.subtotal, 0) + (shippingCost || 0);

  const nextOrder = {
    id: orderNumber,
    orderNumber,
    buyer: {
      name: address?.recipient_name || address?.label || 'Pembeli',
      phone: address?.phone || '',
      address: address?.full_address || `${address?.regency || ''} ${address?.province || ''}`.trim()
    },
    items: mappedItems,
    totalAmount: grandTotal - (shippingCost || 0),
    shippingCost: shippingCost || 0,
    grandTotal,
    orderDate: nowIso,
    status: 'pending',
    paymentMethod: paymentMethod === 'midtrans' ? 'Midtrans' : 'Transfer Bank',
    shippingService: shippingService || 'JNE',
    trackingNumber: null
  };

  try {
    const existing = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const filtered = existing.filter((o) => o.orderNumber !== orderNumber);
    localStorage.setItem(ordersKey, JSON.stringify([nextOrder, ...filtered]));
  } catch (err) {
    console.warn('Failed to persist seller_orders_data', err);
  }

  const salesEntries = (itemsPayload || []).map((item) => ({
    id: `${orderNumber}-${item.product_id}`,
    orderNumber,
    productName: item.product_name,
    image: item.product_image,
    buyer: address?.recipient_name || 'Pembeli',
    qty: item.quantity,
    price: item.price,
    total: Number(item.price) * Number(item.quantity || 0),
    orderDate: nowIso,
    status: 'processing',
    paymentMethod: paymentMethod === 'midtrans' ? 'Midtrans' : 'Transfer Bank',
    shippingService: shippingService || 'JNE'
  }));

  try {
    const existingSales = JSON.parse(localStorage.getItem(salesKey) || '[]');
    // Remove duplicates for this order number
    const filteredSales = existingSales.filter((s) => s.orderNumber !== orderNumber);
    localStorage.setItem(salesKey, JSON.stringify([...salesEntries, ...filteredSales]));
  } catch (err) {
    console.warn('Failed to persist seller_sales_data', err);
  }

  // Decrease local product stock for both seller and buyer views (seller_products + override map)
  try {
    const productsKey = 'seller_products';
    const overrideKey = 'product_stock_overrides';
    const products = JSON.parse(localStorage.getItem(productsKey) || '[]');
    const overrides = JSON.parse(localStorage.getItem(overrideKey) || '{}');

    const updatedProducts = products.map((p) => {
      const match = (itemsPayload || []).find((i) => {
        const pid = Number(i.product_id || i.id);
        return pid === Number(p.product_id || p.id) || pid === Number(p.id) || pid === Number(p.product_id);
      });
      if (!match) return p;
      const qty = Number(match.quantity) || 0;
      const currentStock = Number(p.stock ?? 0);
      const nextStock = Math.max(0, currentStock - qty);
      const pidKey = String(p.product_id || p.id);
      overrides[pidKey] = nextStock;
      return { ...p, stock: nextStock };
    });

    // If products list empty, still record overrides based on item.stock if provided
    if (!products.length) {
      (itemsPayload || []).forEach((i) => {
        const pidKey = String(i.product_id || i.id || '');
        if (!pidKey) return;
        const baseStock = Number.isFinite(Number(i.stock)) ? Number(i.stock) : undefined;
        if (baseStock === undefined) return;
        const qty = Number(i.quantity) || 0;
        overrides[pidKey] = Math.max(0, baseStock - qty);
      });
    }

    localStorage.setItem(productsKey, JSON.stringify(updatedProducts));
    localStorage.setItem(overrideKey, JSON.stringify(overrides));
  } catch (err) {
    console.warn('Failed to decrease local stock', err);
  }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cartItems, 
    selectedItems, 
    getSelectedTotal, 
    getSelectedItemsCount,
  } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [hasProfileAddress, setHasProfileAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '',
    receiver: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: ''
  });
  const [missingProfileAddress, setMissingProfileAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('transfer');
  const [selectedShipping, setSelectedShipping] = useState('regular');
  const [showSuccess, setShowSuccess] = useState(false);
  const [addressAlert, setAddressAlert] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const addressRefs = {
    label: useRef(null),
    receiver: useRef(null),
    phone: useRef(null),
    address: useRef(null),
    city: useRef(null),
    province: useRef(null),
    postalCode: useRef(null)
  };

  const STORAGE_KEYS = {
    addresses: 'checkout_addresses',
    selected: 'checkout_selected_address'
  };

  const persistAddresses = (nextAddresses, nextSelected) => {
    localStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(nextAddresses));
    if (nextSelected) {
      localStorage.setItem(STORAGE_KEYS.selected, nextSelected);
    } else {
      localStorage.removeItem(STORAGE_KEYS.selected);
    }
  };

  const buyNowState = location.state?.buyNow;
  const buyNowProduct = buyNowState?.product;
  const buyNowQuantity = Number.isFinite(buyNowState?.quantity) ? buyNowState.quantity : 1;
  const isBuyNow = Boolean(buyNowProduct);

  // Determine checkout items: buy-now payload or selected cart items
  const checkoutItems = isBuyNow
    ? [{ ...buyNowProduct, quantity: buyNowQuantity }]
    : cartItems.filter(item => selectedItems.includes(item.id));

  const shippingCost = selectedShipping === 'regular' ? 0 : selectedShipping === 'same-day' ? 15000 : 30000;
  const subtotal = isBuyNow
    ? checkoutItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0)
    : getSelectedTotal();
  const itemsCount = isBuyNow
    ? checkoutItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : getSelectedItemsCount();
  const total = subtotal + shippingCost;

  const getItemImage = (item) => {
    return (
      item?.image || item?.primary_image || item?.image_url || item?.picture || 'https://via.placeholder.com/80?text=Produk'
    );
  };

  useEffect(() => {
    const user = getCurrentUser();
    const hasProfileAddress = user && user.address && user.city && user.province;

    const profileAddress = hasProfileAddress ? {
      id: 'profile-address',
      label: user.address_label || 'Alamat Profil',
      address: user.address,
      receiver: user.full_name || user.username || 'Penerima',
      phone: user.phone || '',
      city: user.city,
      province: user.province,
      postalCode: user.postal_code || '',
      notes: user.address_note || ''
    } : null;

    const savedAddressesRaw = localStorage.getItem(STORAGE_KEYS.addresses);
    const savedAddresses = JSON.parse(savedAddressesRaw || '[]');
    const savedSelected = localStorage.getItem(STORAGE_KEYS.selected);

    // Only show addresses when profil sudah ada alamat; otherwise hide all addresses.
    const mergedAddresses = hasProfileAddress
      ? [profileAddress, ...savedAddresses.filter((addr) => addr.id !== 'profile-address')]
      : [];

    const defaultSelected = hasProfileAddress && savedSelected && mergedAddresses.some((a) => a.id === savedSelected)
      ? savedSelected
      : hasProfileAddress
        ? profileAddress?.id || mergedAddresses[0]?.id || null
        : null;

    setAddresses(mergedAddresses);
    setSelectedAddress(defaultSelected);
    setMissingProfileAddress(!hasProfileAddress);
    setHasProfileAddress(!!hasProfileAddress);
    setShowAddressForm(false);
  }, []);

  const handleSaveAddress = () => {
    if (!hasProfileAddress) {
      setMissingProfileAddress(true);
      setAddressAlert({ type: 'error', message: 'Lengkapi alamat di Profil terlebih dahulu.' });
      return;
    }

    const required = ['label', 'receiver', 'phone', 'address', 'city', 'province', 'postalCode'];
    const fieldLabels = {
      label: 'Label Alamat',
      receiver: 'Nama Penerima',
      phone: 'No. HP',
      address: 'Alamat Lengkap',
      city: 'Kota/Kabupaten',
      province: 'Provinsi',
      postalCode: 'Kode Pos'
    };
    const missing = required.filter((key) => !addressForm[key].trim());
    if (missing.length) {
      const first = missing[0];
      const ref = addressRefs[first]?.current;
      if (ref) {
        ref.focus({ preventScroll: false });
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setAddressAlert({ type: 'error', message: `${fieldLabels[first]} wajib diisi.` });
      return;
    }

    const targetId = `addr-${Date.now()}`;
    const newAddress = { id: targetId, ...addressForm };
    const updated = [...addresses, newAddress];

    setAddresses(updated);
    setSelectedAddress(targetId);
    persistAddresses(updated, targetId);
    setShowAddressForm(false);
    setAddressAlert({ type: 'success', message: 'Alamat baru berhasil disimpan.' });
    setAddressForm({
      label: '',
      receiver: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      notes: ''
    });
    setMissingProfileAddress(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => {
      const next = prev.filter((addr) => addr.id !== id);
      const nextSelected = selectedAddress === id ? (next[0]?.id || null) : selectedAddress;
      setSelectedAddress(nextSelected);
      setShowAddressForm(false);
      persistAddresses(next, nextSelected);
      return next;
    });
  };

  const handleCheckout = async () => {
    if (isPaying) return;

    if (!selectedAddress) {
      setShowAddressForm(true);
      return;
    }

    const shippingAddress = addresses.find((a) => a.id === selectedAddress);
    if (!shippingAddress) return;

    const token = getToken();
    if (!token) {
      navigate('/login', { state: { message: 'Silakan login untuk melanjutkan pembayaran.' } });
      return;
    }

    setIsPaying(true);

    // Derive seller_id (all items must belong to same seller for this flow)
    const sellerIdCandidates = Array.from(new Set(
      checkoutItems
        .map((item) => item.seller_id || item.sellerId || item.seller?.seller_id || item.seller?.id)
        .filter(Boolean)
    ));

    if (sellerIdCandidates.length > 1) {
      alert('Saat ini checkout hanya mendukung 1 seller per transaksi. Pisahkan pesanan per toko.');
      setIsPaying(false);
      return;
    }

    const fallbackSellerId = Number(import.meta.env.VITE_DEFAULT_SELLER_ID) || 1;
    const sellerId = sellerIdCandidates[0] || fallbackSellerId;

    if (!sellerIdCandidates[0]) {
      console.warn('Checkout: seller_id tidak ditemukan di item. Menggunakan fallback seller_id =', sellerId);
    }

    const itemsPayload = checkoutItems.map((item) => ({
      product_id: item.product_id || item.id,
      seller_id: sellerId,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      product_image: item.image || item.primary_image || item.image_url,
      variant_name: item.variant_name || item.variant,
      variant_value: item.variant_value,
      variant_id: item.variant_id,
    }));

    const shippingPayload = {
      label: shippingAddress.label || 'Checkout',
      recipient_name: shippingAddress.receiver,
      phone: shippingAddress.phone,
      province: shippingAddress.province,
      regency: shippingAddress.city,
      district: shippingAddress.city,
      village: shippingAddress.city,
      postal_code: shippingAddress.postalCode,
      full_address: shippingAddress.address,
    };

    let orderResponse;

    try {
      const orderReq = {
        seller_id: sellerId,
        items: itemsPayload,
        shipping_address: shippingPayload,
        shipping_cost: shippingCost,
        buyer_notes: shippingAddress.notes,
        payment_method: selectedPayment === 'transfer' ? 'manual_transfer' : 'midtrans',
      };

      const created = await orderAPI.createOrder(orderReq);
      orderResponse = created?.data;

      if (!orderResponse?.order_id) {
        throw new Error('Order backend tidak mengembalikan order_id');
      }

      // Simpan ke localStorage untuk tampilan seller (agar langsung muncul di daftar pesanan/produk terjual)
      persistSellerOrderLocal({
        order: orderResponse,
        address: shippingPayload,
        itemsPayload,
        shippingCost,
        paymentMethod: orderReq.payment_method,
        shippingService: selectedShipping
      });
    } catch (err) {
      console.error('Create order error:', err);
      alert(err.response?.data?.message || err.message || 'Gagal membuat pesanan');
      setIsPaying(false);
      return;
    }

    // Request snap token from backend (using backend order id/number)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/snap-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderResponse.order_number || orderResponse.order_id,
          amount: orderResponse.total_amount || orderResponse.total || total,
          items: itemsPayload,
          customer: {
            name: shippingAddress.receiver,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            province: shippingAddress.province,
            postal_code: shippingAddress.postalCode
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal membuat transaksi Midtrans');
      }

      const data = await res.json();
      const snapToken = data?.data?.token || data?.token;
      if (!snapToken) throw new Error('Snap token tidak ditemukan');

      const normalizedOrder = adaptOrderForPaymentStatus({
        orderResponse,
        itemsPayload,
        subtotal,
        shippingCost,
      });

      // Ensure snap script loaded (in case user pays from checkout directly)
      if (!window.snap) {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.dataset.clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = resolve;
          setTimeout(resolve, 1000);
        });
      }

      window.snap?.pay(snapToken, {
        onSuccess: (result) => navigate('/payment-status', { state: { order: normalizedOrder, paymentResult: result, status: 'success', snapToken } }),
        onPending: (result) => navigate('/payment-status', { state: { order: normalizedOrder, paymentResult: result, status: 'pending', snapToken } }),
        onError: () => {
          setIsPaying(false);
          navigate('/payment-status', { state: { order: normalizedOrder, status: 'error', snapToken } });
        },
        onClose: () => {
          setIsPaying(false);
          navigate('/payment-status', { state: { order: normalizedOrder, status: 'closed', snapToken } });
        }
      });
    } catch (err) {
      console.error('Midtrans error:', err);
      alert(err.message || 'Gagal memulai pembayaran.');
      setIsPaying(false);
    }
  };

  if (checkoutItems.length === 0 && !showSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Tidak Ada Item yang Dipilih</h2>
              <p className="text-gray-600 mb-6">Silakan pilih produk di keranjang terlebih dahulu</p>
              <Button onClick={() => navigate('/keranjang')} className="bg-red-600 hover:bg-red-700 cursor-pointer">
                Kembali ke Keranjang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BuyerNavbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Pesanan Berhasil!</h2>
              <p className="text-gray-600 mb-2">Terima kasih telah berbelanja</p>
              <p className="text-sm text-gray-500">Mengarahkan ke halaman beranda...</p>
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
      
      <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
          <button 
            onClick={() => navigate('/keranjang')} 
            className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
          >
            ← Kembali ke Keranjang
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Alamat Pengiriman */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                </div>
                
                <div className="space-y-3">
                  {missingProfileAddress && (
                    <div className="p-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50 flex items-start justify-between gap-3">
                      <span>Alamat di profil belum diisi. Lengkapi Alamat di Profil terlebih dahulu.</span>
                      <Button size="sm" onClick={() => navigate('/profil')} className="bg-blue-600 hover:bg-blue-700 text-white">Buka Profil</Button>
                    </div>
                  )}

                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddress === addr.id}
                            onChange={(e) => {
                              setSelectedAddress(e.target.value);
                              localStorage.setItem(STORAGE_KEYS.selected, e.target.value);
                            }}
                            className="mt-1"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{addr.label}</span>
                              <span className="text-xs text-gray-500">{addr.city}, {addr.province}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                            <p className="text-sm text-gray-600">Penerima: {addr.receiver} | {addr.phone}</p>
                            {addr.notes && <p className="text-xs text-gray-500 mt-1">Catatan: {addr.notes}</p>}
                          </div>
                        </div>

                        {addr.id !== 'profile-address' && (
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </label>
                  ))}

                  <Button
                    variant="outline"
                    className={`w-full border-dashed border-2 ${hasProfileAddress ? 'border-gray-300 hover:border-red-600 text-gray-600 hover:text-red-600 cursor-pointer' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                    type="button"
                    disabled={!hasProfileAddress}
                    onClick={() => {
                      if (!hasProfileAddress) {
                        navigate('/profil');
                        return;
                      }
                      setAddressAlert(null);
                      setAddressForm({
                        label: '',
                        receiver: '',
                        phone: '',
                        address: '',
                        city: '',
                        province: '',
                        postalCode: '',
                        notes: ''
                      });
                      setShowAddressForm((v) => !v);
                    }}
                  >
                    {showAddressForm ? 'Tutup Form Alamat' : '+ Tambah Alamat Baru'}
                  </Button>

                  {showAddressForm && (
                    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                      {addressAlert && (
                        <div
                          className={`rounded-lg p-3 text-sm flex items-start gap-2 ${addressAlert.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}
                        >
                          <span className="font-semibold">
                            {addressAlert.type === 'error' ? 'Validasi' : 'Sukses'}:
                          </span>
                          <span>{addressAlert.message}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Label Alamat <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Contoh: Rumah, Kantor"
                            value={addressForm.label}
                            ref={addressRefs.label}
                            onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Nama Penerima <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.receiver}
                            ref={addressRefs.receiver}
                            onChange={(e) => setAddressForm((f) => ({ ...f, receiver: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">No. HP <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.phone}
                            ref={addressRefs.phone}
                            onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Kota/Kabupaten <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.city}
                            ref={addressRefs.city}
                            onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Provinsi <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.province}
                            ref={addressRefs.province}
                            onChange={(e) => setAddressForm((f) => ({ ...f, province: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Kode Pos <span className="text-red-600">*</span></label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.postalCode}
                            ref={addressRefs.postalCode}
                            onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold mb-1">Alamat Lengkap <span className="text-red-600">*</span></label>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            rows="2"
                            value={addressForm.address}
                            ref={addressRefs.address}
                            onChange={(e) => setAddressForm((f) => ({ ...f, address: e.target.value }))}
                          ></textarea>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold mb-1">Catatan (opsional)</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.notes}
                            onChange={(e) => setAddressForm((f) => ({ ...f, notes: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Button type="button" className="bg-red-600 hover:bg-red-700 cursor-pointer" onClick={handleSaveAddress}>
                          Simpan Alamat
                        </Button>
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => { setShowAddressForm(false); setAddressForm({ label: '', receiver: '', phone: '', address: '', city: '', province: '', postalCode: '', notes: '' }); }}>
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            

            {/* Metode Pengiriman */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Metode Pengiriman</h2>
                </div>
                
                <div className="space-y-3">
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShipping === 'regular' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value="regular"
                          checked={selectedShipping === 'regular'}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold">Reguler</span>
                          <p className="text-sm text-gray-600">Estimasi tiba 3-5 hari</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">GRATIS</span>
                    </div>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShipping === 'same-day' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value="same-day"
                          checked={selectedShipping === 'same-day'}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold">Same Day Delivery</span>
                          <p className="text-sm text-gray-600">Estimasi tiba hari ini</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">Rp 15.000</span>
                    </div>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShipping === 'instant' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value="instant"
                          checked={selectedShipping === 'instant'}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-semibold">Instant Delivery</span>
                          <p className="text-sm text-gray-600">Estimasi tiba 2-4 jam</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">Rp 30.000</span>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Ringkasan Belanja</h2>
                {/* Produk yang dipesan */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Produk</h3>
                  <div className="divide-y border rounded-lg">
                    {checkoutItems.map((item, idx) => (
                      <div key={item.id || item.product_id || idx} className="py-2 px-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={getItemImage(item)} alt={item.name} className="w-12 h-12 object-cover rounded-md border" loading="lazy" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                    {checkoutItems.length === 0 && (
                      <div className="p-3 text-sm text-gray-500">Tidak ada item terpilih untuk checkout.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({itemsCount} barang)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Ongkos Kirim</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm">📦 Info Pengiriman</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Gratis Ongkir Min. Belanja Rp 50.000</li>
                    <li>✓ Same Day Delivery Available</li>
                    <li>✓ Instant Delivery Available</li>
                  </ul>
                </div>



                <Button 
                  onClick={handleCheckout}
                  disabled={!selectedAddress}
                  className={`w-full h-12 text-white text-lg font-semibold ${selectedAddress ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {isPaying ? 'Memproses…' : 'Bayar Sekarang'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
