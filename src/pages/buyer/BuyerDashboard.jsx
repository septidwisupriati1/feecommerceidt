import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  HomeIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import authAPI from '../../services/authAPI';
import buyerTransactionAPI from '../../services/buyerTransactionAPI';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';

export default function BuyerDashboard() {
  const navigate = useNavigate();
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

  useEffect(() => {
    console.log('🏠 [BuyerDashboard] Component mounted, checking auth...');
    
    const currentUser = authAPI.getCurrentUser();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('🔍 [BuyerDashboard] Full Auth State:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 30) + '...' : null,
      hasUser: !!currentUser,
      rawUserStr: userStr,
      parsedUser: currentUser,
      userRole: currentUser?.role,
      userRoles: currentUser?.roles,
      userId: currentUser?.user_id
    });
    
    if (!currentUser || !token) {
      console.error('❌ [BuyerDashboard] Auth failed - redirecting to login', {
        hasToken: !!token,
        hasUser: !!currentUser,
        reason: !token ? 'No token' : 'No user data'
      });
      navigate('/login', { replace: true });
      return;
    }
    
    console.log('✅ [BuyerDashboard] User authenticated:', {
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role || currentUser.roles?.[0]
    });
    
    setUser(currentUser);
    fetchDashboardData();
  }, [navigate]);

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

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navbar */}
      <BuyerNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Selamat Datang! 🎉</h2>
              <p className="text-blue-50 text-lg">
                Halo, {user?.username || user?.email}! Mulai belanja produk favorit Anda sekarang
              </p>
            </div>
            <Link
              to="/produk"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition flex items-center whitespace-nowrap"
            >
              Mulai Belanja
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pesanan Aktif</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {summary.orders_by_status?.processing + summary.orders_by_status?.shipped || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Menunggu Bayar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {summary.orders_by_status?.pending || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ClockIcon className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Dalam Pengiriman</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {summary.orders_by_status?.shipped || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TruckIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Selesai</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {summary.orders_by_status?.completed || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-blue-900">Pesanan Terbaru</h3>
            <Link
              to="/pesanan-saya"
              className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
            >
              Lihat Semua →
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Belum ada pesanan</p>
              <Link
                to="/produk"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#111827'
                }}
              >
                Mulai Belanja Sekarang
              </Link>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
