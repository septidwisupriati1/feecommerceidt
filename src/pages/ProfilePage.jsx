import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import CartSuccessToast from "../components/CartSuccessToast";
import { getCurrentUser } from '../services/authAPI';
import authAPI from '../services/authAPI';
import buyerTransactionAPI from '../services/buyerTransactionAPI';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  UserCircleIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_orders: 0,
    total_spending: 0,
    orders_by_status: {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [profileToast, setProfileToast] = useState({ show: false, message: '' });
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setProfileData({
        name: currentUser.full_name || currentUser.username || 'User',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        birthDate: currentUser.birth_date || '',
        gender: currentUser.gender || '',
        address: currentUser.address || '',
        province: currentUser.province || '',
        city: currentUser.city || '',
        postalCode: currentUser.postal_code || '',
        avatar: currentUser.profile_picture || null
      });
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch summary stats
      const summaryResponse = await buyerTransactionAPI.getSummary();
      if (summaryResponse.success) {
        setSummary(summaryResponse.data);
      }

      // Fetch recent orders (limit 5)
      const ordersResponse = await buyerTransactionAPI.getTransactions({
        page: 1,
        limit: 5,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'User',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    province: '',
    city: '',
    postalCode: '',
    avatar: null
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditData({ ...editData, avatar: reader.result });
        } else {
          setProfileData({ ...profileData, avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
    setProfileToast({ show: true, message: 'Profil berhasil diperbarui.' });
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const stats = [
    { icon: ShoppingBagIcon, label: 'Total Pesanan', value: summary.total_orders || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: ClockIcon, label: 'Menunggu', value: summary.orders_by_status?.pending || 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: TruckIcon, label: 'Diproses', value: (summary.orders_by_status?.processing || 0) + (summary.orders_by_status?.shipped || 0), color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: CheckCircleIcon, label: 'Selesai', value: summary.orders_by_status?.completed || 0, color: 'text-green-600', bg: 'bg-green-50' }
  ];

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
            Profil Saya
          </h1>
          <p className="text-lg text-center" style={{ color: '#6b7280' }}>
            Kelola informasi profil Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    {(isEditing ? editData.avatar : profileData.avatar) ? (
                      <img
                        src={isEditing ? editData.avatar : profileData.avatar}
                        alt="Profile"
                        style={{
                          width: '128px',
                          height: '128px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '4px solid #3b82f6',
                          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '128px',
                        height: '128px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #3b82f6',
                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                      }}>
                        <UserCircleIcon className="w-20 h-20 text-white" />
                      </div>
                    )}
                    
                    {/* Camera Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        boxShadow: '0 4px 6px rgba(251, 191, 36, 0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      <CameraIcon className="w-5 h-5" />
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center">
                    {isEditing ? editData.name : profileData.name}
                  </h2>
                  <p className="text-gray-600 text-center">{profileData.email}</p>
                  
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Bergabung sejak Januari 2024</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div
                        key={index}
                        className={`${stat.bg} p-3 rounded-lg text-center transition-transform hover:scale-105 cursor-pointer`}
                      >
                        <IconComponent className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/pesanan-saya')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    Pesanan Saya
                  </Button>
                  <Button
                    onClick={() => navigate('/chat')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
                    Pesan
                  </Button>
                  <Button
                    onClick={() => navigate('/wishlist')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <HeartIcon className="w-5 h-5 mr-2" />
                    Wishlist
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">Pesanan Terbaru</h2>
                  <Button
                    onClick={() => navigate('/pesanan-saya')}
                    variant="outline"
                    className="text-yellow-500 hover:text-yellow-600 border-yellow-500 hover:bg-yellow-50"
                  >
                    Lihat Semua →
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Belum ada pesanan</p>
                    <Button
                      onClick={() => navigate('/produk')}
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: '#111827'
                      }}
                    >
                      Mulai Belanja Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 cursor-pointer transition-all"
                        onClick={() => navigate('/pesanan-saya')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{order.order_number}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.order_status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.order_status === 'completed' ? 'bg-teal-100 text-teal-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.order_status === 'pending' ? 'Menunggu Pembayaran' :
                             order.order_status === 'processing' ? 'Diproses' :
                             order.order_status === 'shipped' ? 'Dikirim' :
                             order.order_status === 'delivered' ? 'Telah Sampai' :
                             order.order_status === 'completed' ? 'Selesai' :
                             'Dibatalkan'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{order.total_items || 0} produk</span>
                          <span className="font-bold text-yellow-600">
                            Rp {order.total_amount?.toLocaleString('id-ID') || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card>
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Pribadi</h2>
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white'
                      }}
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Edit Profil
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white'
                        }}
                      >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Simpan
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XMarkIcon className="w-5 h-5 mr-2" />
                        Batal
                      </Button>
                    </div>
                  )}
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <UserCircleIcon className="w-6 h-6 mr-2 text-blue-600" />
                      Data Diri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="w-full pl-10"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                            <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400" />
                            {profileData.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type="tel"
                              value={editData.phone}
                              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                              className="w-full pl-10"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                            <PhoneIcon className="w-5 h-5 mr-2 text-gray-400" />
                            {profileData.phone}
                          </p>
                        )}
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Lahir
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type="date"
                              value={editData.birthDate}
                              onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                              className="w-full pl-10"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                            {new Date(profileData.birthDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Kelamin
                        </label>
                        {isEditing ? (
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="Laki-laki"
                                checked={editData.gender === 'Laki-laki'}
                                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                className="mr-2"
                              />
                              <span>Laki-laki</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="Perempuan"
                                checked={editData.gender === 'Perempuan'}
                                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                className="mr-2"
                              />
                              <span>Perempuan</span>
                            </label>
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.gender}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPinIcon className="w-6 h-6 mr-2 text-blue-600" />
                      Alamat
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Full Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat Lengkap
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editData.address}
                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.address}</p>
                        )}
                      </div>

                      {/* Province, City, Postal Code */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provinsi
                          </label>
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editData.province}
                              onChange={(e) => setEditData({ ...editData, province: e.target.value })}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.province}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kota/Kabupaten
                          </label>
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editData.city}
                              onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kode Pos
                          </label>
                          {isEditing ? (
                            <Input
                              type="text"
                              value={editData.postalCode}
                              onChange={(e) => setEditData({ ...editData, postalCode: e.target.value })}
                              className="w-full"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{profileData.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  {!isEditing && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Keamanan</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          Ubah Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Verifikasi Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Verifikasi Nomor Telepon
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <CartSuccessToast
        show={profileToast.show}
        message={profileToast.message || "Profil berhasil diperbarui"}
        onClose={() => setProfileToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
