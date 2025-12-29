import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const totalPrice = getCartTotal();

  // Tutup dengan tombol ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const backdropClass = open
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';

  const drawerClass = open ? 'translate-x-0' : 'translate-x-full';

  const handleViewCart = () => {
    onClose();
    navigate('/keranjang');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${backdropClass}`}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${drawerClass}`}
      >
        <header className="px-4 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Keranjang</p>
              <p className="text-sm text-gray-500">{cartItems.length} item</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p className="font-medium">Keranjang kosong</p>
              <p className="text-sm">Tambahkan produk untuk mulai belanja</p>
            </div>
          )}

          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 border rounded-lg p-3 shadow-sm">
              <img
                src={item.image || '/images/placeholder.png'}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-gray-500 line-clamp-1">{item.variant}</p>
                )}
                <p className="font-semibold text-blue-600 mt-1">
                  Rp {Number(item.price || 0).toLocaleString('id-ID')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 rounded border hover:bg-gray-50"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded border hover:bg-gray-50"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto text-sm text-red-500 hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-semibold text-gray-900">
              Rp {Number(totalPrice || 0).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleViewCart}
              className="flex-1 border border-gray-200 rounded-lg py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Lihat Keranjang
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 shadow-blue transition"
            >
              Checkout
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
