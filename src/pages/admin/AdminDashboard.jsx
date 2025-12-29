import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { adminDashboardAPI, formatCurrency, formatNumber } from '../../services/adminAPI';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellers, setTopSellers] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics
        const statsResponse = await adminDashboardAPI.getStatistics();
        if (statsResponse.success) {
          setDashboardData(statsResponse.data);
        }

        // Fetch recent orders
        const ordersResponse = await adminDashboardAPI.getRecentOrders(5);
        if (ordersResponse.success) {
          setRecentOrders(ordersResponse.data.orders);
        }

        // Fetch top sellers
        const sellersResponse = await adminDashboardAPI.getTopSellers(5, 'month');
        if (sellersResponse.success) {
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
      color: 'blue' 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
              green: { text: 'text-green-600', bg: 'bg-green-50' },
              purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
              yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' },
              red: { text: 'text-red-600', bg: 'bg-red-50' }
            };
            const colors = colorClasses[stat.color] || colorClasses.blue;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isPositive ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left border-t-4 border-blue-500 hover:scale-105">
            <div className="text-blue-600 font-bold text-lg mb-2">Kelola Pengguna</div>
            <div className="text-gray-600 text-sm">Tambah atau edit pengguna</div>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left border-t-4 border-green-500 hover:scale-105">
            <div className="text-green-600 font-bold text-lg mb-2">Lihat Laporan</div>
            <div className="text-gray-600 text-sm">Analisis penjualan lengkap</div>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left border-t-4 border-purple-500 hover:scale-105">
            <div className="text-purple-600 font-bold text-lg mb-2">Kelola Kategori</div>
            <div className="text-gray-600 text-sm">Tambah atau edit kategori</div>
          </button>
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left border-t-4 border-yellow-500 hover:scale-105">
            <div className="text-yellow-600 font-bold text-lg mb-2">Pengaturan</div>
            <div className="text-gray-600 text-sm">Konfigurasi platform</div>
          </button>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default AdminDashboard;
