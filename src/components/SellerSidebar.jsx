import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authAPI';
import NotificationDropdown from './NotificationDropdown';
import { getTotalUnreadCount } from '../utils/chatUtils';
import { 
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function SellerSidebar({ isOpen, setIsOpen, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Load initial unread count
    updateUnreadCount();
    
    // Update unread count every 5 seconds
    const interval = setInterval(updateUnreadCount, 5000);
    
    // Listen for chat unread count changes
    const handleUnreadCountChange = () => {
      updateUnreadCount();
    };
    window.addEventListener('chatUnreadCountChanged', handleUnreadCountChange);

    const handleProfileUpdate = (e) => {
      setUser(e.detail || getCurrentUser());
    };
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        setUser(getCurrentUser());
      }
    };
    window.addEventListener('sellerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('chatUnreadCountChanged', handleUnreadCountChange);
      window.removeEventListener('sellerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Reset scroll position to top whenever route changes so new pages don't inherit previous scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  
  const updateUnreadCount = () => {
    const count = getTotalUnreadCount();
    setUnreadChatCount(count);
  };

  const getUserInitials = () => {
    const fallback = 'S';
    if (!user) return fallback;
    const baseName = user.store_name || user.full_name || user.username;
    if (!baseName) return fallback;
    const names = baseName.split(' ');
    return names.length > 1 ? (names[0][0] + names[1][0]).toUpperCase() : baseName[0].toUpperCase();
  };

  const getUserName = () => {
    return user?.store_name || user?.full_name || user?.username || 'Seller';
  };

  const getUserEmail = () => {
    return user?.store_email || user?.email || 'seller@ecommerce.com';
  };

  const getProfileImage = () => {
    return user?.profile_picture || user?.store_logo || null;
  };

  const menuItems = [
    { path: '/seller', icon: ShoppingBagIcon, label: 'Produk Saya', badge: null },
    { path: '/seller/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat', badge: unreadChatCount > 0 ? unreadChatCount : null },
    { path: '/seller/produk-terjual', icon: ShoppingCartIcon, label: 'Produk Terjual', badge: null },
    { path: '/seller/pesanan', icon: DocumentTextIcon, label: 'Pesanan', badge: null },
    { path: '/seller/ulasan', icon: ChatBubbleLeftIcon, label: 'Ulasan', badge: null },
    { path: '/seller/pengiriman', icon: PaperAirplaneIcon, label: 'Pengiriman', badge: null },
    { path: '/seller/rekening', icon: CreditCardIcon, label: 'Rekening Pembayaran', badge: null },
    { path: '/seller/pengaturan', icon: Cog6ToothIcon, label: 'Pengaturan', badge: null },
    { path: '/seller/syarat', icon: ShieldCheckIcon, label: 'Syarat & Ketentuan', badge: null },
    { path: '/seller/privasi', icon: BookOpenIcon, label: 'Privasi & Kebijakan', badge: null },
    { path: '/seller/faq', icon: QuestionMarkCircleIcon, label: 'FAQ', badge: null },
  ];

  const isActive = (path) => {
    if (path === '/seller') {
      return location.pathname === '/seller' || location.pathname === '/seller/dashboard';
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar Menu */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-64 bg-white shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Profile */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-bold text-blue-600">Seller Dashboard</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="md:hidden cursor-pointer">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Profile Section - Clickable */}
            <button
              onClick={() => {
                navigate('/seller/profile');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 cursor-pointer"
            >
              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt={getUserName()}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 border-2 border-white shadow-md">
                  {getUserInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-gray-900 truncate">{getUserName()}</h3>
                <p className="text-xs text-gray-600 truncate">{getUserEmail()}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">Lihat Profil →</p>
              </div>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-4 pb-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false); // Close sidebar on mobile after navigation
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active 
                          ? 'text-red-600 bg-red-50 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-100'
                      } cursor-pointer`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 font-medium cursor-pointer"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Logout</h3>
                <p className="text-sm text-gray-600 mt-1">Anda akan keluar dari akun seller.</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Tutup"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen bg-gray-50">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-blue-600">Seller Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </>
  );
}
