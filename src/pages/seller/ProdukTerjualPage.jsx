import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from '../../components/Footer';
import { getProductImageUrl, handleImageError } from '../../utils/imageHelper';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Generate dummy sales data based on products
const generateSalesData = (products) => {
  const buyers = [
    'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Davis',
    'Diana Evans', 'Frank Miller', 'Grace Lee', 'Henry Wilson', 'Ivy Taylor',
    'Jack Anderson', 'Kelly Martinez', 'Liam Thompson', 'Mia Garcia', 'Noah Robinson'
  ];
  
  const paymentMethods = ['Transfer Bank', 'E-Wallet', 'COD', 'Kartu Kredit'];
  const shippingServices = ['JNE Regular', 'JNE YES', 'JNT Express', 'SiCepat Reguler', 'AnterAja'];
  const statuses = ['delivered', 'shipped', 'processing', 'cancelled'];
  const statusWeights = [0.7, 0.15, 0.1, 0.05]; // 70% delivered, 15% shipped, etc.
  
  const salesData = [];
  let orderId = 1;
  
  products.forEach((product, index) => {
    // Generate 1-5 sales per product
    const salesCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < salesCount; i++) {
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      
      // Random quantity (1-3)
      const qty = Math.floor(Math.random() * 3) + 1;
      
      // Select status based on weights
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus = statuses[0];
      for (let j = 0; j < statuses.length; j++) {
        cumulativeWeight += statusWeights[j];
        if (random <= cumulativeWeight) {
          selectedStatus = statuses[j];
          break;
        }
      }
      
      salesData.push({
        id: `ORD-${String(orderId).padStart(3, '0')}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        buyer: buyers[Math.floor(Math.random() * buyers.length)],
        qty: qty,
        price: product.price,
        total: product.price * qty,
        orderDate: orderDate.toISOString().split('T')[0],
        status: selectedStatus,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        shippingService: shippingServices[Math.floor(Math.random() * shippingServices.length)]
      });
      
      orderId++;
    }
  });
  
  // Sort by date (newest first)
  return salesData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

export default function ProdukTerjualPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [soldProducts, setSoldProducts] = useState([]);
  const itemsPerPage = 10;

  // Load products and generate sales data
  useEffect(() => {
    // Check if sales data already exists in localStorage
    const existingSalesData = localStorage.getItem('seller_sales_data');
    
    if (existingSalesData) {
      // Use existing sales data
      setSoldProducts(JSON.parse(existingSalesData));
    } else {
      // Generate new sales data from products
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      if (products.length > 0) {
        const salesData = generateSalesData(products);
        setSoldProducts(salesData);
        // Save to localStorage for consistency
        localStorage.setItem('seller_sales_data', JSON.stringify(salesData));
      } else {
        // Fallback to static dummy data if no products
        const fallbackData = [
          {
            id: 'ORD-001',
            productName: 'Produk Demo',
            productImage: '/images/products/product-1.jpg',
            buyer: 'John Doe',
            qty: 1,
            price: 100000,
            total: 100000,
            orderDate: '2025-01-05',
            status: 'delivered',
            paymentMethod: 'Transfer Bank',
            shippingService: 'JNE Regular'
          }
        ];
        setSoldProducts(fallbackData);
        localStorage.setItem('seller_sales_data', JSON.stringify(fallbackData));
      }
    }
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      delivered: { class: 'bg-green-100 text-green-800', label: 'Selesai', icon: CheckCircleIcon },
      shipped: { class: 'bg-blue-100 text-blue-800', label: 'Dikirim', icon: TruckIcon },
      processing: { class: 'bg-yellow-100 text-yellow-800', label: 'Diproses', icon: ClockIcon },
      cancelled: { class: 'bg-red-100 text-red-800', label: 'Dibatalkan', icon: XCircleIcon }
    };
    return badges[status] || badges.processing;
  };

  const filteredProducts = soldProducts.filter(product => {
    const matchesSearch = 
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const stats = {
    total: soldProducts.length,
    delivered: soldProducts.filter(p => p.status === 'delivered').length,
    shipped: soldProducts.filter(p => p.status === 'shipped').length,
    cancelled: soldProducts.filter(p => p.status === 'cancelled').length,
    totalRevenue: soldProducts
      .filter(p => p.status === 'delivered')
      .reduce((sum, p) => sum + p.total, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleRegenerateSales = () => {
    if (confirm('Apakah Anda yakin ingin membuat ulang data penjualan? Data penjualan yang ada akan diganti dengan data baru.')) {
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      if (products.length > 0) {
        const salesData = generateSalesData(products);
        setSoldProducts(salesData);
        localStorage.setItem('seller_sales_data', JSON.stringify(salesData));
        alert('Data penjualan berhasil dibuat ulang!');
        setCurrentPage(1);
      } else {
        alert('Tidak ada produk untuk membuat data penjualan. Silakan tambahkan produk terlebih dahulu.');
      }
    }
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Produk Terjual
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Riwayat dan statistik produk yang telah terjual
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Terjual</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
                  <p className="text-sm text-green-600 mt-1">Produk</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selesai</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.delivered}</h3>
                  <p className="text-sm text-green-600 mt-1">Pesanan</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dalam Pengiriman</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.shipped}</h3>
                  <p className="text-sm text-blue-600 mt-1">Pesanan</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <TruckIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue).replace('Rp', 'Rp ')}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">Selesai</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari produk, pembeli, atau ID pesanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Regenerate Button */}
              <Button
                onClick={handleRegenerateSales}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Buat Ulang Data
              </Button>
            </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setFilterStatus('all')}
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  className={filterStatus === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Semua ({soldProducts.length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('delivered')}
                  variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                  className={filterStatus === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Selesai ({stats.delivered})
                </Button>
                <Button
                  onClick={() => setFilterStatus('shipped')}
                  variant={filterStatus === 'shipped' ? 'default' : 'outline'}
                  className={filterStatus === 'shipped' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  Dikirim ({stats.shipped})
                </Button>
                <Button
                  onClick={() => setFilterStatus('cancelled')}
                  variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                  className={filterStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Dibatalkan ({stats.cancelled})
                </Button>
              </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID Pesanan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Pembeli
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <p className="text-lg font-semibold mb-2">Tidak ada data</p>
                          <p className="text-sm">Belum ada produk yang terjual atau tidak ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const statusInfo = getStatusBadge(product.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-semibold text-blue-600">
                              {product.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={getProductImageUrl(product.productImage)} 
                                  alt={product.productName}
                                  className="w-full h-full object-cover"
                                  onError={handleImageError}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{product.productName}</p>
                                <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900">{product.buyer}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">{product.qty}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-green-600">
                              {formatCurrency(product.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">
                              {new Date(product.orderDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                              <StatusIcon className="h-4 w-4" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Prev
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </SellerSidebar>
  );
}

