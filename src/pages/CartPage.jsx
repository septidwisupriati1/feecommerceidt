import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { formatPrice, getCategoryGradient } from "../data/products";
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    selectedItems,
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getSelectedTotal,
    getSelectedItemsCount,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
    removeSelectedItems
  } = useCart();

  if (cartItems.length === 0) {
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
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Keranjang Kosong
              </h2>
              <p className="text-gray-600 mb-6">
                Belum ada produk di keranjang Anda
              </p>
              <Button 
                onClick={() => navigate('/produk')}
                className="bg-blue-600 hover:bg-blue-700"
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
            Keranjang Belanja
          </h1>
          <p className="text-lg text-center" style={{ color: '#6b7280' }}>
            {cartItems.length} produk di keranjang Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <h2 className="text-2xl font-bold">Pilih Semua ({cartItems.length})</h2>
                  </div>
                  <div className="flex gap-2">
                    {selectedItems.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={removeSelectedItems}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Hapus Dipilih ({selectedItems.length})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Hapus Semua
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-4 border-2 rounded-lg transition-all ${
                        selectedItems.includes(item.id) 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                        />
                      </div>

                      {/* Product Image */}
                      <div
                        onClick={() => navigate(`/produk/${item.id}`)}
                        className={`w-24 h-24 flex-shrink-0 bg-gradient-to-br ${getCategoryGradient(item.category)} rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
                      >
                        <span className="text-4xl">{item.image}</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3
                          onClick={() => navigate(`/produk/${item.id}`)}
                          className="font-semibold text-lg mb-1 hover:text-blue-600 cursor-pointer"
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Kategori: {item.category}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-blue-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Button
              variant="outline"
              onClick={() => navigate('/produk')}
              className="mt-4 w-full"
            >
              ← Lanjut Belanja
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Ringkasan Belanja</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Total Produk</span>
                    <span className="font-semibold">{cartItems.length} item</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Dipilih untuk Checkout</span>
                    <span className="font-semibold text-red-600">{selectedItems.length} item ({getSelectedItemsCount()} barang)</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-gray-700">
                    <span>Subtotal Dipilih</span>
                    <span className="font-semibold">{formatPrice(getSelectedTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold text-green-600">GRATIS</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Pembayaran</span>
                      <span className="text-red-600 text-2xl">{formatPrice(getSelectedTotal())}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert('Silakan pilih produk yang ingin di-checkout');
                      return;
                    }
                    navigate('/checkout');
                  }}
                  disabled={selectedItems.length === 0}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Checkout ({selectedItems.length} item)
                </Button>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">💳 Metode Pembayaran</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Transfer Bank</li>
                    <li>✓ E-Wallet (OVO, GoPay, Dana)</li>
                    <li>✓ Kartu Kredit/Debit</li>
                    <li>✓ COD (Cash on Delivery)</li>
                  </ul>
                </div>

                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">🚚 Info Pengiriman</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Gratis Ongkir Min. Belanja Rp 50.000</li>
                    <li>✓ Same Day Delivery</li>
                    <li>✓ Instant Delivery Available</li>
                  </ul>
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
