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

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "User",
    email: "user@email.com",
    joinDate: "Januari 2024",
    avatar: "U"
  });
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const getUserInitials = () => {
        if (currentUser.full_name) {
          const names = currentUser.full_name.split(' ');
          return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
        }
        return currentUser.username ? currentUser.username[0].toUpperCase() : 'U';
      };

      const getJoinDate = () => {
        if (!currentUser.created_at) return 'Januari 2024';
        const date = new Date(currentUser.created_at);
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      };

      setProfileData({
        fullName: currentUser.full_name || currentUser.username || "User",
        email: currentUser.email || "user@email.com",
        joinDate: getJoinDate(),
        avatar: getUserInitials()
      });
    }
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
                {/* Avatar Circle */}
                <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Camera Button */}
                <button className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full shadow-lg hover:bg-red-600 transition">
                  <CameraIcon className="h-4 w-4 text-white" />
                </button>
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
