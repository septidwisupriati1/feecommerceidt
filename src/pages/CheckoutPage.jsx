import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from '../context/CartContext';
import { formatPrice } from "../data/products";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from "../services/authAPI";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    selectedItems, 
    getSelectedTotal, 
    getSelectedItemsCount,
    removeFromCart,
    createOrder
  } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
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

  // Filter only selected items for checkout
  const checkoutItems = cartItems.filter(item => selectedItems.includes(item.id));

  const shippingCost = selectedShipping === 'regular' ? 0 : selectedShipping === 'same-day' ? 15000 : 30000;
  const subtotal = getSelectedTotal();
  const total = subtotal + shippingCost;

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

    const savedAddresses = JSON.parse(localStorage.getItem(STORAGE_KEYS.addresses) || '[]');
    const savedSelected = localStorage.getItem(STORAGE_KEYS.selected);

    const mergedAddresses = profileAddress
      ? [profileAddress, ...savedAddresses.filter((addr) => addr.id !== 'profile-address')]
      : savedAddresses;

    const defaultSelected = savedSelected && mergedAddresses.some((a) => a.id === savedSelected)
      ? savedSelected
      : profileAddress?.id || mergedAddresses[0]?.id || null;

    setAddresses(mergedAddresses);
    setSelectedAddress(defaultSelected);
    setMissingProfileAddress(!hasProfileAddress);
    setShowAddressForm(!mergedAddresses.length);
  }, []);

  const handleSaveAddress = () => {
    const required = ['label', 'receiver', 'phone', 'address', 'city', 'province', 'postalCode'];
    const hasEmpty = required.some((key) => !addressForm[key].trim());
    if (hasEmpty) return;

    const id = `addr-${Date.now()}`;
    const newAddress = { id, ...addressForm };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setSelectedAddress(id);
    persistAddresses(updated, id);
    setShowAddressForm(false);
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
      if (!next.length) {
        setShowAddressForm(true);
      }
      persistAddresses(next, nextSelected);
      return next;
    });
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      setShowAddressForm(true);
      return;
    }

    const shippingAddress = addresses.find((a) => a.id === selectedAddress);
    if (!shippingAddress) return;

    // Create order data
    const orderData = {
      order_id: 'ORD-' + Date.now(),
      items: checkoutItems,
      items_count: checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal,
      shipping_cost: shippingCost,
      total: total,
      shippingAddress,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save order to context
    createOrder(orderData);

    // Redirect to payment page
    navigate('/payment', { state: { order: orderData } });
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
              <Button onClick={() => navigate('/keranjang')} className="bg-red-600 hover:bg-red-700">
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
            className="text-gray-700 hover:text-blue-600 font-medium"
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
                      <span>Alamat di profil belum diisi. Lengkapi di Profil atau tambah alamat di sini.</span>
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
                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
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
                    className="w-full border-dashed border-2 border-gray-300 hover:border-red-600 text-gray-600 hover:text-red-600"
                    type="button"
                    onClick={() => setShowAddressForm((v) => !v)}
                  >
                    {showAddressForm ? 'Tutup Form Alamat' : '+ Tambah Alamat Baru'}
                  </Button>

                  {showAddressForm && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold mb-1">Label Alamat</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Contoh: Rumah, Kantor"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Nama Penerima</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.receiver}
                            onChange={(e) => setAddressForm((f) => ({ ...f, receiver: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">No. HP</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Kota/Kabupaten</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Provinsi</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.province}
                            onChange={(e) => setAddressForm((f) => ({ ...f, province: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1">Kode Pos</label>
                          <input
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold mb-1">Alamat Lengkap</label>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            rows="2"
                            value={addressForm.address}
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
                        <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleSaveAddress}>
                          Simpan Alamat
                        </Button>
                        <Button type="button" variant="outline" onClick={() => { setShowAddressForm(false); setAddressForm({ label: '', receiver: '', phone: '', address: '', city: '', province: '', postalCode: '', notes: '' }); }}>
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

            {/* Metode Pembayaran */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-bold text-gray-900">Metode Pembayaran</h2>
                </div>
                
                <div className="space-y-3">
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === 'transfer' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={selectedPayment === 'transfer'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">Transfer Bank</span>
                    <p className="ml-6 text-sm text-gray-600">BCA, Mandiri, BNI, BRI</p>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === 'ewallet' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="ewallet"
                      checked={selectedPayment === 'ewallet'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">E-Wallet</span>
                    <p className="ml-6 text-sm text-gray-600">OVO, GoPay, Dana, ShopeePay</p>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === 'credit' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={selectedPayment === 'credit'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">Kartu Kredit/Debit</span>
                    <p className="ml-6 text-sm text-gray-600">Visa, Mastercard, JCB</p>
                  </label>

                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === 'cod' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === 'cod'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">COD (Cash on Delivery)</span>
                    <p className="ml-6 text-sm text-gray-600">Bayar di tempat saat barang tiba</p>
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
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({getSelectedItemsCount()} barang)</span>
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
                  Bayar Sekarang
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
