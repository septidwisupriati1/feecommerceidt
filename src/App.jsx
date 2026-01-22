import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardRouter from './components/DashboardRouter';
import DebugPanel from './components/DebugPanel';

// Public Pages
import LandingPage from './pages/LandingPage-New';
import HomePage from './pages/HomePage-New';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterBuyerPage from './pages/auth/RegisterBuyerPage';
import RegisterSellerPage from './pages/auth/RegisterSellerPage';
import RegisterAdminPage from './pages/auth/RegisterAdminPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import VerifyEmailLocalPage from './pages/VerifyEmailLocalPage';
import VerifyPhoneLocalPage from './pages/VerifyPhoneLocalPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import NotificationPage from './pages/buyer/NotificationPage';
import WishlistPage from './pages/buyer/Wishlist';

// Seller Pages
import SellerChatPage from './pages/seller/SellerChatPage';
import SellerProductPage from './pages/seller/ProductPage';
import AddProductPage from './pages/seller/AddProductPage';
import EditProductPage from './pages/seller/EditProductPage';
import SellerProductDetailPage from './pages/seller/ProductDetailPage';
import ProdukTerjualPage from './pages/seller/ProdukTerjualPage';
import PesananPage from './pages/seller/PesananPage';
import SellerOrderDetailPage from './pages/seller/OrderDetailPage';
import UlasanPage from './pages/seller/UlasanPage';
import PengirimanPage from './pages/seller/PengirimanPage';
import PengaturanPage from './pages/seller/PengaturanPage';
import SellerProfilePage from './pages/seller/ProfilePage';
import SyaratKetentuanPage from './pages/seller/SyaratKetentuanPage';
import PrivasiKebijakanPage from './pages/seller/PrivasiKebijakanPage';
import FAQPage from './pages/seller/FAQPage';
import RekeningPage from './pages/seller/RekeningPage';
import SellerEmailVerificationPage from './pages/seller/SellerEmailVerificationPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PaymentVerificationPage from './pages/admin/PaymentVerificationPage';
import RekeningAdminPage from './pages/admin/RekeningAdminPage';
import KelolaStorePage from './pages/admin/KelolaStorePage';
import KelolaUserPage from './pages/admin/KelolaUserPage';
import KelolaProductPage from './pages/admin/KelolaProductPage';
import KategoriPage from './pages/admin/KategoriPage';
import LaporanPage from './pages/admin/LaporanPage';
import AdminPesananPage from './pages/admin/PesananPage';
import AdminPengirimanPage from './pages/admin/PengirimanPage';
import KotakMasukPage from './pages/admin/KotakMasukPage';
import PembayaranPage from './pages/admin/PembayaranPage';
import AutoCancelConfigPage from './pages/admin/AutoCancelConfigPage';
import AdminSyaratKetentuanPage from './pages/admin/SyaratKetentuanPage';
import AdminKebijakanPrivasiPage from './pages/admin/KebijakanPrivasiPage';
import AdminFAQPage from './pages/admin/FAQPage';
import ProfilSTPPage from './pages/admin/ProfilSTPPage';
import AdminProfilePage from './pages/admin/ProfilePage';
import StoreProfilePage from './pages/StoreProfilePage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Root Route - Smart routing: Landing page if not logged in, Dashboard if logged in */}
          <Route path="/" element={<DashboardRouter />} />
          
          {/* Landing Page - Always show landing page */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Auth Routes - Redirect to dashboard if already logged in */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/register/buyer" element={<PublicRoute><RegisterBuyerPage /></PublicRoute>} />
          <Route path="/register/seller" element={<PublicRoute><RegisterSellerPage /></PublicRoute>} />
          <Route path="/register/admin" element={<PublicRoute><RegisterAdminPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
          
          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={<ProtectedRoute requiredRole="buyer"><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/produk" element={<ProductPage />} />
          <Route path="/produk/:id" element={<ProductDetailPage />} />
          <Route path="/keranjang" element={<CartPage />} />
          <Route path="/ubah-password" element={<ChangePasswordPage />} />
          <Route path="/verifikasi-email" element={<VerifyEmailLocalPage />} />
          <Route path="/verifikasi-telepon" element={<VerifyPhoneLocalPage />} />
          <Route path="/checkout" element={<ProtectedRoute requiredRole="buyer"><CheckoutPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute requiredRole="buyer"><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment-status" element={<ProtectedRoute requiredRole="buyer"><PaymentStatusPage /></ProtectedRoute>} />
          <Route path="/pesanan-saya" element={<ProtectedRoute requiredRole="buyer"><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/pesanan/:id" element={<ProtectedRoute requiredRole="buyer"><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute requiredRole="buyer"><ChatPage /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute requiredRole="buyer"><ProfilePage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute requiredRole="buyer"><WishlistPage /></ProtectedRoute>} />
          <Route path="/notifikasi" element={<ProtectedRoute requiredRole="buyer"><NotificationPage /></ProtectedRoute>} />
          
          {/* Seller Routes */}
          <Route path="/seller/verify-email" element={<ProtectedRoute requiredRole="seller" allowUnverifiedSeller><SellerEmailVerificationPage /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute requiredRole="seller"><SellerProductPage /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedRoute requiredRole="seller"><SellerProductPage /></ProtectedRoute>} />
          <Route path="/seller/product" element={<ProtectedRoute requiredRole="seller"><SellerProductPage /></ProtectedRoute>} />
          <Route path="/seller/product/add" element={<ProtectedRoute requiredRole="seller"><AddProductPage /></ProtectedRoute>} />
          <Route path="/seller/product/edit/:id" element={<ProtectedRoute requiredRole="seller"><EditProductPage /></ProtectedRoute>} />
          <Route path="/seller/product/:id" element={<ProtectedRoute requiredRole="seller"><SellerProductDetailPage /></ProtectedRoute>} />
          <Route path="/seller/chat" element={<ProtectedRoute requiredRole="seller"><SellerChatPage /></ProtectedRoute>} />
          <Route path="/seller/produk-terjual" element={<ProtectedRoute requiredRole="seller"><ProdukTerjualPage /></ProtectedRoute>} />
          <Route path="/seller/pesanan" element={<ProtectedRoute requiredRole="seller"><PesananPage /></ProtectedRoute>} />
          <Route path="/seller/pesanan/:orderId" element={<ProtectedRoute requiredRole="seller"><SellerOrderDetailPage /></ProtectedRoute>} />
          <Route path="/seller/ulasan" element={<ProtectedRoute requiredRole="seller"><UlasanPage /></ProtectedRoute>} />
          <Route path="/seller/pengiriman" element={<ProtectedRoute requiredRole="seller"><PengirimanPage /></ProtectedRoute>} />
          <Route path="/seller/pengaturan" element={<ProtectedRoute requiredRole="seller"><PengaturanPage /></ProtectedRoute>} />
          <Route path="/seller/profile" element={<ProtectedRoute requiredRole="seller"><SellerProfilePage /></ProtectedRoute>} />
          <Route path="/seller/syarat" element={<ProtectedRoute requiredRole="seller"><SyaratKetentuanPage /></ProtectedRoute>} />
          <Route path="/seller/privasi" element={<ProtectedRoute requiredRole="seller"><PrivasiKebijakanPage /></ProtectedRoute>} />
          <Route path="/seller/faq" element={<ProtectedRoute requiredRole="seller"><FAQPage /></ProtectedRoute>} />
          <Route path="/seller/rekening" element={<ProtectedRoute requiredRole="seller"><RekeningPage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/kelola-store" element={<ProtectedRoute requiredRole="admin"><KelolaStorePage /></ProtectedRoute>} />
          <Route path="/admin/kelola-user" element={<ProtectedRoute requiredRole="admin"><KelolaUserPage /></ProtectedRoute>} />
          <Route path="/admin/kelola-product" element={<ProtectedRoute requiredRole="admin"><KelolaProductPage /></ProtectedRoute>} />
          <Route path="/admin/kategori" element={<ProtectedRoute requiredRole="admin"><KategoriPage /></ProtectedRoute>} />
          <Route path="/admin/laporan" element={<ProtectedRoute requiredRole="admin"><LaporanPage /></ProtectedRoute>} />
          <Route path="/admin/pesanan" element={<ProtectedRoute requiredRole="admin"><AdminPesananPage /></ProtectedRoute>} />
          <Route path="/admin/pengiriman" element={<ProtectedRoute requiredRole="admin"><AdminPengirimanPage /></ProtectedRoute>} />
          <Route path="/admin/kotak-masuk" element={<ProtectedRoute requiredRole="admin"><KotakMasukPage /></ProtectedRoute>} />
          <Route path="/admin/pembayaran" element={<ProtectedRoute requiredRole="admin"><PembayaranPage /></ProtectedRoute>} />
          <Route path="/admin/payment-verification" element={<ProtectedRoute requiredRole="admin"><PaymentVerificationPage /></ProtectedRoute>} />
          <Route path="/admin/auto-cancel-config" element={<ProtectedRoute requiredRole="admin"><AutoCancelConfigPage /></ProtectedRoute>} />
          <Route path="/admin/rekening-admin" element={<ProtectedRoute requiredRole="admin"><RekeningAdminPage /></ProtectedRoute>} />
          <Route path="/admin/syarat-ketentuan" element={<ProtectedRoute requiredRole="admin"><AdminSyaratKetentuanPage /></ProtectedRoute>} />
          <Route path="/admin/kebijakan-privasi" element={<ProtectedRoute requiredRole="admin"><AdminKebijakanPrivasiPage /></ProtectedRoute>} />
          <Route path="/admin/faq" element={<ProtectedRoute requiredRole="admin"><AdminFAQPage /></ProtectedRoute>} />
          <Route path="/admin/profil-stp" element={<ProtectedRoute requiredRole="admin"><ProfilSTPPage /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfilePage /></ProtectedRoute>} />
          {/* Public store profile by store name (placed last to avoid clashing with other routes) */}
          <Route path="/:storeName" element={<StoreProfilePage />} />
        </Routes>
        
        {/* Debug Panel - Only shows in development */}
        <DebugPanel />
      </Router>
    </CartProvider>
  );
}

export default App;
