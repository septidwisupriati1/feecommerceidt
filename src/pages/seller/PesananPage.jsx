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
  CheckIcon,
  TruckIcon,
  XMarkIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CartSuccessToast from '../../components/CartSuccessToast';

// Generate dummy order data based on products
const generateOrderData = (products) => {
  const buyers = [
    { name: 'John Doe', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110' },
    { name: 'Jane Smith', phone: '081234567891', address: 'Jl. Gatot Subroto No. 45, Bandung, Jawa Barat 40263' },
    { name: 'Bob Johnson', phone: '081234567892', address: 'Jl. Ahmad Yani No. 78, Surabaya, Jawa Timur 60231' },
    { name: 'Alice Brown', phone: '081234567893', address: 'Jl. Diponegoro No. 56, Semarang, Jawa Tengah 50241' },
    { name: 'Charlie Davis', phone: '081234567894', address: 'Jl. Pemuda No. 90, Yogyakarta, DI Yogyakarta 55161' },
    { name: 'Diana Evans', phone: '081234567895', address: 'Jl. Pahlawan No. 34, Medan, Sumatera Utara 20111' },
    { name: 'Frank Miller', phone: '081234567896', address: 'Jl. Veteran No. 67, Malang, Jawa Timur 65145' },
    { name: 'Grace Lee', phone: '081234567897', address: 'Jl. Merdeka No. 21, Makassar, Sulawesi Selatan 90111' }
  ];
  
  const paymentMethods = ['Transfer Bank BCA', 'Transfer Bank Mandiri', 'E-Wallet OVO', 'E-Wallet GoPay', 'E-Wallet Dana'];
  const shippingServices = ['JNE Regular', 'JNE YES', 'JNT Express', 'SiCepat Reguler', 'AnterAja Standard'];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusWeights = [0.15, 0.25, 0.20, 0.35, 0.05]; // Distribution of statuses
  
  const ordersData = [];
  let orderId = 1001;
  
  // Generate 15-25 orders
  const orderCount = Math.floor(Math.random() * 11) + 15;
  
  for (let i = 0; i < orderCount; i++) {
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);
    
    // Select 1-3 random products for this order
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const orderProducts = [];
    const usedProducts = new Set();
    
    for (let j = 0; j < itemCount && j < products.length; j++) {
      let randomProduct;
      do {
        randomProduct = products[Math.floor(Math.random() * products.length)];
      } while (usedProducts.has(randomProduct.id) && usedProducts.size < products.length);
      
      usedProducts.add(randomProduct.id);
      
      const qty = Math.floor(Math.random() * 3) + 1;
      orderProducts.push({
        id: randomProduct.id,
        name: randomProduct.name,
        image: randomProduct.image,
        price: randomProduct.price,
        qty: qty,
        subtotal: randomProduct.price * qty
      });
    }
    
    const totalAmount = orderProducts.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = Math.floor(Math.random() * 30000) + 10000; // 10k - 40k
    
    // Select status based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedStatus = statuses[0];
    for (let k = 0; k < statuses.length; k++) {
      cumulativeWeight += statusWeights[k];
      if (random <= cumulativeWeight) {
        selectedStatus = statuses[k];
        break;
      }
    }
    
    ordersData.push({
      id: `ORD-${String(orderId).padStart(4, '0')}`,
      orderNumber: `ORD-${String(orderId).padStart(4, '0')}`,
      buyer: buyer,
      items: orderProducts,
      totalAmount: totalAmount,
      shippingCost: shippingCost,
      grandTotal: totalAmount + shippingCost,
      orderDate: orderDate.toISOString(),
      status: selectedStatus,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingService: shippingServices[Math.floor(Math.random() * shippingServices.length)],
      trackingNumber: selectedStatus === 'shipped' || selectedStatus === 'delivered' 
        ? `TRK${Math.random().toString(36).substr(2, 12).toUpperCase()}`
        : null
    });
    
    orderId++;
  }
  
  // Sort by date (newest first)
  return ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

export default function PesananPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load orders data
  useEffect(() => {
    const existingOrdersData = localStorage.getItem('seller_orders_data');
    
    if (existingOrdersData) {
      setOrders(JSON.parse(existingOrdersData));
    } else {
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      if (products.length > 0) {
        const ordersData = generateOrderData(products);
        setOrders(ordersData);
        localStorage.setItem('seller_orders_data', JSON.stringify(ordersData));
      } else {
        // Fallback dummy data
        const fallbackData = [
          {
            id: 'ORD-1001',
            orderNumber: 'ORD-1001',
            buyer: { name: 'John Doe', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta' },
            items: [{
              id: 1,
              name: 'Produk Demo',
              image: '/images/products/product-1.jpg',
              price: 100000,
              qty: 1,
              subtotal: 100000
            }],
            totalAmount: 100000,
            shippingCost: 15000,
            grandTotal: 115000,
            orderDate: new Date().toISOString(),
            status: 'pending',
            paymentMethod: 'Transfer Bank BCA',
            shippingService: 'JNE Regular',
            trackingNumber: null
          }
        ];
        setOrders(fallbackData);
        localStorage.setItem('seller_orders_data', JSON.stringify(fallbackData));
      }
    }
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-yellow-100 text-yellow-800', label: 'Menunggu', icon: ClockIcon },
      processing: { class: 'bg-blue-100 text-blue-800', label: 'Diproses', icon: CheckIcon },
      shipped: { class: 'bg-purple-100 text-purple-800', label: 'Dikirim', icon: TruckIcon },
      delivered: { class: 'bg-green-100 text-green-800', label: 'Selesai', icon: CheckIcon },
      cancelled: { class: 'bg-red-100 text-red-800', label: 'Dibatalkan', icon: XCircleIcon }
    };
    return badges[status] || badges.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.grandTotal, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegenerateOrders = () => {
    if (confirm('Apakah Anda yakin ingin membuat ulang data pesanan? Data pesanan yang ada akan diganti dengan data baru.')) {
      const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
      if (products.length > 0) {
          const ordersData = generateOrderData(products);
          setOrders(ordersData);
          localStorage.setItem('seller_orders_data', JSON.stringify(ordersData));
          setToast({ show: true, message: 'Data pesanan berhasil dibuat ulang!' });
        setCurrentPage(1);
      } else {
          setToast({ show: true, message: 'Tidak ada produk untuk membuat data pesanan. Silakan tambahkan produk terlebih dahulu.' });
      }
    }
  };

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Daftar Pesanan
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Kelola dan pantau semua pesanan dari pembeli
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Menunggu</p>
                <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Diproses</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.processing}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Dikirim</p>
                <h3 className="text-2xl font-bold text-purple-600">{stats.shipped}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Selesai</p>
                <h3 className="text-2xl font-bold text-green-600">{stats.delivered}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Dibatalkan</p>
                <h3 className="text-2xl font-bold text-red-600">{stats.cancelled}</h3>
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
                    placeholder="Cari nomor pesanan, pembeli, atau produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Regenerate Button */}
              <Button
                onClick={handleRegenerateOrders}
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
                Semua ({orders.length})
              </Button>
              <Button
                onClick={() => setFilterStatus('pending')}
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                className={filterStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Menunggu ({stats.pending})
              </Button>
              <Button
                onClick={() => setFilterStatus('processing')}
                variant={filterStatus === 'processing' ? 'default' : 'outline'}
                className={filterStatus === 'processing' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Diproses ({stats.processing})
              </Button>
              <Button
                onClick={() => setFilterStatus('shipped')}
                variant={filterStatus === 'shipped' ? 'default' : 'outline'}
                className={filterStatus === 'shipped' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Dikirim ({stats.shipped})
              </Button>
              <Button
                onClick={() => setFilterStatus('delivered')}
                variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                className={filterStatus === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Selesai ({stats.delivered})
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

        {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400">
                  <p className="text-lg font-semibold mb-2">Tidak ada pesanan</p>
                  <p className="text-sm">Belum ada pesanan atau tidak ditemukan</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            paginatedOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-start justify-between mb-4 pb-4 border-b">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-blue-600">{order.orderNumber}</h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                            <StatusIcon className="h-4 w-4" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/seller/pesanan/${order.id}`)}
                        className="mt-2 md:mt-0"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Lihat Detail
                      </Button>
                    </div>

                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Pembeli</p>
                          <p className="font-semibold text-gray-900">{order.buyer.name}</p>
                          <p className="text-sm text-gray-600">{order.buyer.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                          <p className="text-sm text-gray-900">{order.buyer.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            <img 
                              src={getProductImageUrl(item.image)} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} x {item.qty}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal Produk</span>
                        <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ongkos Kirim ({order.shippingService})</span>
                        <span className="font-semibold">{formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-gray-600">Metode Pembayaran</span>
                        <span className="font-semibold">{order.paymentMethod}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">No. Resi</span>
                          <span className="font-mono font-semibold text-blue-600">{order.trackingNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-green-600">{formatCurrency(order.grandTotal)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="mt-6 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrders.length)} dari {filteredOrders.length} pesanan
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
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
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
            </CardContent>
          </Card>
        )}
      </div>
        <Footer />
        <CartSuccessToast
          show={toast.show}
          message={toast.message}
          onClose={() => setToast({ show: false, message: '' })}
        />
    </SellerSidebar>
  );
}
