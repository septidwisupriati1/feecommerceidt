import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { adminDashboardAPI, formatCurrency, formatNumber } from '../../services/adminAPI';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  const quickActions = [
    {
      label: 'Pengguna',
      description: 'Tambah atau perbarui akun pengguna',
      color: 'blue',
      path: '/admin/kelola-user'
    },
    {
      label: 'Toko',
      description: 'Atur data toko dan status penjual',
      color: 'blue',
      path: '/admin/kelola-store'
    },
    {
      label: 'Produk',
      description: 'Review, edit, atau nonaktifkan produk',
      color: 'blue',
      path: '/admin/kelola-product'
    },
    {
      label: 'Kategori',
      description: 'Tambah atau ubah kategori produk',
      color: 'blue',
      path: '/admin/kategori'
    }
  ];

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, ordersResponse, sellersResponse] = await Promise.all([
          adminDashboardAPI.getStatistics(),
          adminDashboardAPI.getRecentOrders(5),
          adminDashboardAPI.getTopSellers(5, 'month')
        ]);

        if (statsResponse?.success) {
          setDashboardData(statsResponse.data);
        }
        if (ordersResponse?.success) {
          setRecentOrders(ordersResponse.data.orders);
        }
        if (sellersResponse?.success) {
          setTopSellers(sellersResponse.data.sellers);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats from API data
  const stats = dashboardData ? [
    { 
      label: 'Total Pengguna', 
      value: formatNumber(dashboardData.users.total), 
      change: `+${dashboardData.users.new_this_month} bulan ini`, 
      isPositive: true, 
      icon: UsersIcon, 
      color: 'pink' 
    },
    { 
      label: 'Total Penjual', 
      value: formatNumber(dashboardData.users.by_role.seller), 
      change: `${formatNumber(dashboardData.users.by_role.admin)} admin`, 
      isPositive: true, 
      icon: ShoppingBagIcon, 
      color: 'green' 
    },
    { 
      label: 'Total Pembeli', 
      value: formatNumber(dashboardData.users.by_role.buyer), 
      change: `${dashboardData.users.active} aktif`, 
      isPositive: true, 
      icon: UsersIcon, 
      color: 'purple' 
    },
    { 
      label: 'Total Transaksi', 
      value: formatNumber(dashboardData.transactions.total), 
      change: `${formatNumber(dashboardData.transactions.this_month)} bulan ini`, 
      isPositive: dashboardData.transactions.this_month > dashboardData.transactions.today, 
      icon: CurrencyDollarIcon, 
      color: 'yellow' 
    }
  ] : [];

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'Selesai': 'bg-green-100 text-green-800',
      'Diproses': 'bg-blue-100 text-blue-800',
      'Dikirim': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'completed': 'Selesai',
      'processing': 'Diproses',
      'pending': 'Pending',
      'cancelled': 'Dibatalkan'
    };
    return labels[status] || status;
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-blue-50 text-center">
              Kelola platform E-Commerce Anda
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data dashboard...</p>
            </div>
          </div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola platform E-Commerce Anda
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Statistik Utama</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
                green: { text: 'text-green-600', bg: 'bg-green-50' },
                purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
                yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' },
                red: { text: 'text-red-600', bg: 'bg-red-50' },
                amber: { text: 'text-amber-600', bg: 'bg-amber-50' },
                pink: { text: 'text-pink-600', bg: 'bg-pink-50' }
              };
              const colors = colorClasses[stat.color] || colorClasses.blue;

              return (
                <div key={index} className="flex items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 leading-tight">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pengelolaan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const colorMap = {
              blue: { border: 'border-blue-500', text: 'text-blue-600' },
              green: { border: 'border-green-500', text: 'text-green-600' },
              purple: { border: 'border-purple-500', text: 'text-purple-600' },
              yellow: { border: 'border-yellow-500', text: 'text-yellow-600' }
            };
            const accent = colorMap[action.color] || colorMap.blue;

            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left border-t-4 hover:scale-105 h-full`}
              >
                <div className="flex flex-col gap-2 h-full">
                  <div className={`font-bold text-lg ${accent.text}`}>{action.label}</div>
                  <div className="text-gray-600 text-sm leading-snug">{action.description}</div>
                </div>
              </button>
            );
          })}
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pesanan Terbaru</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembeli</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.product_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatCurrency(order.total_amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatOrderDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Top Penjual</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topSellers.map((seller, index) => (
                  <div key={seller.seller_id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all hover:scale-105">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{seller.store_name}</p>
                        <p className="text-xs text-gray-500">{formatNumber(seller.total_orders)} pesanan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(seller.total_sales)}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-yellow-600">⭐ {seller.rating}</span>
                        {seller.trend === 'up' && <span className="text-green-600">↗ {seller.growth_percentage}%</span>}
                        {seller.trend === 'down' && <span className="text-red-600">↘ {Math.abs(seller.growth_percentage)}%</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default AdminDashboard;
