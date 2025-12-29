import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { 
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    { 
      label: 'Total Produk', 
      value: '45', 
      change: '+5 baru', 
      icon: ShoppingBagIcon, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: 'up'
    },
    { 
      label: 'Pesanan Baru', 
      value: '23', 
      change: '+8 hari ini', 
      icon: UserGroupIcon, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      trend: 'up'
    },
    { 
      label: 'Total Pendapatan', 
      value: 'Rp 15.5 Jt', 
      change: '+12% bulan ini', 
      icon: CurrencyDollarIcon, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50',
      trend: 'up'
    },
    { 
      label: 'Rating Toko', 
      value: '4.8', 
      change: '320 ulasan', 
      icon: ChartBarIcon, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      trend: 'up'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'Smartphone Android', qty: 2, total: 'Rp 5.998.000', status: 'pending' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Kaos Polo Premium', qty: 3, total: 'Rp 267.000', status: 'processing' },
    { id: 'ORD-003', customer: 'Bob Johnson', product: 'Sepatu Sneakers', qty: 1, total: 'Rp 450.000', status: 'shipped' },
    { id: 'ORD-004', customer: 'Alice Brown', product: 'Tas Ransel', qty: 1, total: 'Rp 350.000', status: 'delivered' }
  ];

  const myProducts = [
    { id: 1, name: 'Smartphone Android Terbaru', price: 'Rp 2.999.000', stock: 15, sold: 45, image: '📱' },
    { id: 2, name: 'Kaos Polo Premium Cotton', price: 'Rp 89.000', stock: 50, sold: 120, image: '👕' },
    { id: 3, name: 'Sepatu Sneakers Sport', price: 'Rp 450.000', stock: 8, sold: 32, image: '👟' },
    { id: 4, name: 'Tas Ransel Anti Air', price: 'Rp 350.000', stock: 20, sold: 65, image: '🎒' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    const labels = {
      pending: 'Menunggu',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai'
    };
    return { class: badges[status], label: labels[status] };
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Dashboard Penjual
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola toko dan produk Anda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pesanan Terbaru</h2>
                <Button variant="outline" onClick={() => navigate('/seller/orders')}>
                  Lihat Semua
                </Button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.product} (x{order.qty})</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{order.total}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Detail
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Produk Saya</h2>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => navigate('/seller/products/add')}>
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Tambah Produk
                </Button>
              </div>
              <div className="space-y-4">
                {myProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Harga: {product.price}</span>
                        <span>Stok: {product.stock}</span>
                        <span>Terjual: {product.sold}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-full transition-colors">
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-yellow-100 rounded-full transition-colors">
                        <PencilIcon className="h-5 w-5 text-yellow-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-full transition-colors">
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </SellerSidebar>
  );
}
