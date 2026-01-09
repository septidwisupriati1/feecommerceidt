import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authAPI';
import NotificationDropdown from './NotificationDropdown';
import '../pages/admin/admin-interactions.css';
import { 
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  TagIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  TruckIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

function AdminSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const getUserInitials = () => {
    if (!user) return 'A';
    if (user.full_name) {
      const names = user.full_name.split(' ');
      return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
    }
    return user.username ? user.username[0].toUpperCase() : 'A';
  };

  const getUserName = () => {
    return user?.full_name || user?.username || 'Admin';
  };

  const getUserEmail = () => {
    return user?.email || 'admin@ecommerce.com';
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
    {
      section: 'LAINNYA',
      items: [
        { path: '/admin/laporan', icon: DocumentTextIcon, label: 'Laporan' },
        { path: '/admin/pesanan', icon: ShoppingCartIcon, label: 'Pesanan' },
        { path: '/admin/pengiriman', icon: TruckIcon, label: 'Pengiriman' },
        { path: '/admin/kotak-masuk', icon: EnvelopeIcon, label: 'Kotak Masuk' },
        { path: '/admin/rekening-admin', icon: BanknotesIcon, label: 'Rekening Admin' },
        { path: '/admin/payment-verification', icon: ClipboardDocumentListIcon, label: 'Verifikasi Pembayaran' },
        { path: '/admin/pembayaran', icon: CurrencyDollarIcon, label: 'Pembayaran' },
        { path: '/admin/syarat-ketentuan', icon: DocumentDuplicateIcon, label: 'Syarat Ketentuan' },
        { path: '/admin/kebijakan-privasi', icon: ShieldCheckIcon, label: 'Kebijakan Privasi' },
        { path: '/admin/faq', icon: QuestionMarkCircleIcon, label: 'FAQ' },
        { path: '/admin/profil-stp', icon: DocumentChartBarIcon, label: 'Profil STP' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogoutConfirm = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`admin-area fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-600 to-blue-700 transform flex flex-col ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}>
        
        {/* Header with Logo */}
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-white font-bold text-lg">E-COMMERCE</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white hover:bg-blue-500 p-1 rounded"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4">
          {menuItems.map((item, index) => {
            // If it's a direct menu item (Dashboard)
            if (item.path) {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    active 
                      ? 'bg-white text-blue-600 font-semibold shadow-md' 
                      : 'text-white hover:bg-blue-500'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            }
            
            // If it's a section with items
            return (
              <div key={index} className="mb-3">
                <div className="flex justify-center">
                  <div className="h-0.5 w-[calc(100%-24px)] rounded-full bg-blue-200"></div>
                </div>
                {item.items.map((subItem, subIndex) => {
                  const Icon = subItem.icon;
                  const active = isActive(subItem.path);
                  
                  return (
                    <button
                      key={subIndex}
                      onClick={() => {
                        navigate(subItem.path);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${subIndex === 0 ? 'mt-2' : ''} ${
                        active 
                          ? 'bg-white text-blue-600 font-semibold shadow-md' 
                          : 'text-white hover:bg-blue-500'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{subItem.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-4 border-t border-blue-500 pt-4 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-white hover:bg-red-500 font-medium"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Modal (portal to body) */}
      {showLogoutModal && createPortal(
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Logout</h3>
                  <p className="text-sm text-gray-600 mt-1">Anda akan keluar dari akun admin.</p>
                </div>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label="Tutup"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ),
        document.body
      )}

      {/* Main Content Area */}
      <div className="md:ml-64 admin-area-content">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Hamburger + Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  aria-label="Toggle Menu"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
              </div>
            
              {/* Right Icons */}
              <div className="flex items-center space-x-4">
                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Profile Section */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{getUserName()}</p>
                    <p className="text-xs text-gray-500">{getUserEmail()}</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/profile')}
                    className="relative"
                    aria-label="Profil"
                  >
                    {user?.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={getUserName()}
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold border-2 border-blue-500">
                        {getUserInitials()}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {children}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;
