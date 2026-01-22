import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import Footer from '../../components/Footer';
import { getCurrentUser } from '../../services/authAPI';
import { 
  CameraIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  TicketIcon,
  CalendarIcon,
  ShoppingCartIcon,
  EnvelopeIcon,
  HeartIcon as HeartIconOutline,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const apiOrigin = import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).origin : '';
const buildImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return apiOrigin ? `${apiOrigin}${url}` : url;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: 'User',
    email: 'user@email.com',
    joinDate: 'Januari 2024',
    avatarText: 'U',
    avatarUrl: ''
  });
  
  useEffect(() => {
    const applyUser = (currentUser) => {
      setUser(currentUser);
      if (!currentUser) return;

      const getUserInitials = () => {
        const baseName = currentUser.full_name || currentUser.username || 'U';
        const names = baseName.split(' ');
        return names.length > 1 ? (names[0][0] + names[1][0]).toUpperCase() : baseName[0].toUpperCase();
      };

      const getJoinDate = () => {
        if (!currentUser.created_at) return 'Januari 2024';
        const date = new Date(currentUser.created_at);
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      };

      setProfileData({
        fullName: currentUser.seller_profile?.store_name || currentUser.store_name || currentUser.full_name || currentUser.username || 'User',
        email: currentUser.email || 'user@email.com',
        joinDate: getJoinDate(),
        avatarText: getUserInitials(),
        avatarUrl: buildImageUrl(
          currentUser.profile_picture ||
          currentUser.seller_profile?.store_photo ||
          currentUser.store_photo ||
          currentUser.store_logo ||
          ''
        )
      });
    };

    applyUser(getCurrentUser());

    const handleProfileUpdate = (e) => applyUser(e.detail || getCurrentUser());
    const handleStorageChange = (e) => {
      if (e.key === 'user') applyUser(getCurrentUser());
    };

    window.addEventListener('sellerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sellerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const stats = [
    { 
      label: "Pesanan", 
      value: 12, 
      icon: ShoppingBagIcon, 
      bgColor: "bg-blue-50", 
      textColor: "text-blue-600",
      iconColor: "text-blue-600"
    },
    { 
      label: "Chat", 
      value: 8, 
      icon: ChatBubbleLeftIcon, 
      bgColor: "bg-green-50", 
      textColor: "text-green-600",
      iconColor: "text-green-600"
    }
  ];

  const menuItems = [
    { 
      label: "Pesanan Saya", 
      icon: ShoppingCartIcon, 
      onClick: () => navigate('/seller/pesanan'),
      hasArrow: true
    },
    { 
      label: "Pesan", 
      icon: EnvelopeIcon, 
      onClick: () => navigate('/seller/chat'),
      hasArrow: true
    },
    { 
      label: "Pengaturan", 
      icon: Cog6ToothIcon, 
      onClick: () => navigate('/seller/pengaturan'),
      hasArrow: true
    },
    { 
      label: "Keluar", 
      icon: ArrowRightOnRectangleIcon, 
      onClick: () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
          navigate('/');
        }
      },
      hasArrow: false,
      isLogout: true
    }
  ];

  return (
    <SellerSidebar>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden border-2 border-white shadow">
                  {profileData.avatarUrl ? (
                    <img src={profileData.avatarUrl} alt={profileData.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-white font-bold">{profileData.avatarText}</span>
                  )}
                </div>
              </div>

              {/* Name and Email */}
              <h2 className="text-xl font-bold text-gray-800 mb-1">{profileData.fullName}</h2>
              <p className="text-gray-600 text-sm mb-3">{profileData.email}</p>
              
              {/* Join Date */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>Bergabung sejak {profileData.joinDate}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${stat.bgColor} rounded-xl p-4 text-center`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.isLogout 
                        ? 'hover:bg-red-50 text-red-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.hasArrow && (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
};

export default ProfilePage;
