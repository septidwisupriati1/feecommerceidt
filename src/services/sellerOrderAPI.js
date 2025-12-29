/**
 * Seller Order Management API
 * Endpoints untuk seller mengelola pesanan masuk dan riwayat pesanan
 * Base URL: /api/ecommerce/seller/orders
 */

import { getAuthHeaders, validateAuth, debugAuth } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api/ecommerce';

// Helper function to get token from localStorage (legacy - use auth utils instead)
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  
  // Debug: log token status
  if (!token) {
    console.warn('⚠️ Token tidak ditemukan di localStorage');
  } else {
    console.log('✅ Token ditemukan:', token.substring(0, 20) + '...');
  }
  
  return token;
};

// Helper function to get headers with authentication (legacy - use auth utils instead)
const getAuthHeadersLegacy = () => {
  const token = getAuthToken();
  
  if (!token) {
    console.error('❌ Token tidak tersedia untuk request');
  }
  
  // Debug: log user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('👤 User info:', {
    username: user.username,
    role: user.role || user.roles?.[0],
    userId: user.user_id
  });
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Get seller's orders with filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status: pending, paid, processing, shipped, delivered, completed, cancelled
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search by order_number or recipient_name
 * @returns {Promise<Object>} Orders list with pagination
 */
export const getOrders = async (params = {}) => {
  try {
    // Validate authentication before making request
    validateAuth();
    
    // Debug current auth state
    debugAuth();
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.page) {
      queryParams.append('page', params.page);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/seller/orders${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    // Check for unauthorized (401) response
    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - Token invalid atau expired');
      console.log('📝 Response data:', data);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data.message
      });
      throw new Error(data.error || data.message || 'Gagal mengambil daftar pesanan');
    }

    return data;
  } catch (error) {
    // If unauthorized, throw specific error
    if (error.message === 'UNAUTHORIZED') {
      throw error;
    }
    console.warn('Backend tidak tersedia, menggunakan fallback data:', error.message);
    // Return fallback data if backend is not available
    return getFallbackOrders(params);
  }
};

/**
 * Get order detail by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order detail
 */
export const getOrderDetail = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    // Check for unauthorized (401) response
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengambil detail pesanan');
    }

    return data;
  } catch (error) {
    // If unauthorized, throw specific error
    if (error.message === 'UNAUTHORIZED') {
      throw error;
    }
    console.warn('Backend tidak tersedia, menggunakan fallback data:', error.message);
    // Return fallback data if backend is not available
    return getFallbackOrderDetail(orderId);
  }
};

/**
 * Update order status (process order)
 * @param {number} orderId - Order ID
 * @param {string} status - New status: processing, shipped, delivered, cancelled
 * @param {string} notes - Optional seller notes
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, notes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, seller_notes: notes })
    });

    const data = await response.json();

    // Check for unauthorized (401) response
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengubah status pesanan');
    }

    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Add tracking number to shipped order (Old method - deprecated)
 * @param {number} orderId - Order ID
 * @param {string} trackingNumber - Shipping tracking number
 * @param {string} shippingService - Shipping service name
 * @returns {Promise<Object>} Updated order
 */
export const addTrackingNumber = async (orderId, trackingNumber, shippingService) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        tracking_number: trackingNumber,
        shipping_service: shippingService 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal menambahkan nomor resi');
    }

    return data;
  } catch (error) {
    console.error('Error adding tracking number:', error);
    throw error;
  }
};

/**
 * Input shipping information (courier + tracking number)
 * @param {number} orderId - Order ID
 * @param {string} courierName - Courier code: jne, sicepat, sap, ninja, jnt, tiki, wahana, pos, lion
 * @param {string} trackingNumber - Tracking number (5-50 characters)
 * @returns {Promise<Object>} Updated order with shipping info
 */
export const inputShipping = async (orderId, courierName, trackingNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/shipping`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        courier_name: courierName,
        tracking_number: trackingNumber
      })
    });

    const data = await response.json();

    // Check for unauthorized (401) response
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal menyimpan informasi pengiriman');
    }

    return data;
  } catch (error) {
    console.error('Error inputting shipping:', error);
    throw error;
  }
};

/**
 * Get shipping status and validation result
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Shipping status and validation info
 */
export const getShippingStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/shipping-status`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengambil status pengiriman');
    }

    return data;
  } catch (error) {
    console.error('Error getting shipping status:', error);
    throw error;
  }
};

/**
 * Manually validate shipping (for testing)
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Validation result
 */
export const validateShipping = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/validate-shipping`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal memvalidasi pengiriman');
    }

    return data;
  } catch (error) {
    console.error('Error validating shipping:', error);
    throw error;
  }
};

// ============================================
// FALLBACK DATA (for development/offline mode)
// ============================================

const FALLBACK_ORDERS = [
  {
    order_id: 1,
    order_number: 'ORD-20251113-00001',
    buyer_id: 4,
    recipient_name: 'John Buyer',
    recipient_phone: '081234567890',
    shipping_address: {
      province: 'DKI Jakarta',
      regency: 'Jakarta Selatan',
      district: 'Kebayoran Baru',
      village: 'Senayan',
      postal_code: '12190',
      full_address: 'Jl. Sudirman No. 123'
    },
    subtotal: 100000,
    shipping_cost: 15000,
    total_amount: 115000,
    payment_method: 'manual_transfer',
    payment_status: 'paid',
    payment_proof: 'http://localhost:5000/uploads/payment-proof/proof-123.jpg',
    paid_at: '2025-11-13T10:30:00.000Z',
    order_status: 'processing',
    buyer_notes: 'Tolong dikemas dengan baik',
    seller_notes: null,
    cancel_reason: null,
    created_at: '2025-11-13T08:00:00.000Z',
    updated_at: '2025-11-13T10:35:00.000Z',
    confirmed_at: '2025-11-13T10:35:00.000Z',
    shipped_at: null,
    delivered_at: null,
    completed_at: null,
    cancelled_at: null,
    items: [
      {
        order_item_id: 1,
        product_name: 'Laptop Gaming',
        product_image: 'http://localhost:5000/uploads/products/laptop-123.jpg',
        variant: 'RAM: 16GB',
        price: 100000,
        quantity: 1,
        subtotal: 100000
      }
    ],
    total_items: 1
  },
  {
    order_id: 2,
    order_number: 'ORD-20251113-00002',
    buyer_id: 5,
    recipient_name: 'Jane Smith',
    recipient_phone: '081234567891',
    shipping_address: {
      province: 'Jawa Barat',
      regency: 'Bandung',
      district: 'Coblong',
      village: 'Dago',
      postal_code: '40135',
      full_address: 'Jl. Dago No. 45'
    },
    subtotal: 517000,
    shipping_cost: 12000,
    total_amount: 529000,
    payment_method: 'cod',
    payment_status: 'pending',
    payment_proof: null,
    paid_at: null,
    order_status: 'pending',
    buyer_notes: '',
    seller_notes: null,
    cancel_reason: null,
    created_at: '2025-11-13T09:15:00.000Z',
    updated_at: '2025-11-13T09:15:00.000Z',
    confirmed_at: null,
    shipped_at: null,
    delivered_at: null,
    completed_at: null,
    cancelled_at: null,
    items: [
      {
        order_item_id: 2,
        product_name: 'Kaos Polo Premium Cotton',
        product_image: 'http://localhost:5000/uploads/products/polo-1.jpg',
        variant: 'Ukuran: L, Warna: Biru',
        price: 89000,
        quantity: 3,
        subtotal: 267000
      },
      {
        order_item_id: 3,
        product_name: 'Celana Jeans Slim Fit',
        product_image: 'http://localhost:5000/uploads/products/jeans-1.jpg',
        variant: 'Ukuran: 32, Warna: Hitam',
        price: 250000,
        quantity: 1,
        subtotal: 250000
      }
    ],
    total_items: 2
  },
  {
    order_id: 3,
    order_number: 'ORD-20251112-00003',
    buyer_id: 6,
    recipient_name: 'Bob Johnson',
    recipient_phone: '081234567892',
    shipping_address: {
      province: 'Jawa Timur',
      regency: 'Surabaya',
      district: 'Gubeng',
      village: 'Airlangga',
      postal_code: '60286',
      full_address: 'Jl. Ahmad Yani No. 78'
    },
    subtotal: 450000,
    shipping_cost: 18000,
    total_amount: 468000,
    payment_method: 'e-wallet',
    payment_status: 'paid',
    payment_proof: 'http://localhost:5000/uploads/payment-proof/proof-456.jpg',
    paid_at: '2025-11-12T15:45:00.000Z',
    order_status: 'shipped',
    buyer_notes: '',
    seller_notes: 'Dikirim via JNT Express',
    cancel_reason: null,
    created_at: '2025-11-12T14:00:00.000Z',
    updated_at: '2025-11-12T16:00:00.000Z',
    confirmed_at: '2025-11-12T15:50:00.000Z',
    shipped_at: '2025-11-12T16:00:00.000Z',
    delivered_at: null,
    completed_at: null,
    cancelled_at: null,
    tracking_number: 'JT1234567890',
    shipping_service: 'JNT Express',
    items: [
      {
        order_item_id: 4,
        product_name: 'Sepatu Sneakers Sport',
        product_image: 'http://localhost:5000/uploads/products/sneakers-1.jpg',
        variant: 'Ukuran: 42, Warna: Putih',
        price: 450000,
        quantity: 1,
        subtotal: 450000
      }
    ],
    total_items: 1
  },
  {
    order_id: 4,
    order_number: 'ORD-20251111-00004',
    buyer_id: 7,
    recipient_name: 'Alice Brown',
    recipient_phone: '081234567893',
    shipping_address: {
      province: 'Jawa Tengah',
      regency: 'Semarang',
      district: 'Semarang Selatan',
      village: 'Mugassari',
      postal_code: '50249',
      full_address: 'Jl. Diponegoro No. 234'
    },
    subtotal: 350000,
    shipping_cost: 15000,
    total_amount: 365000,
    payment_method: 'manual_transfer',
    payment_status: 'paid',
    payment_proof: 'http://localhost:5000/uploads/payment-proof/proof-789.jpg',
    paid_at: '2025-11-11T11:20:00.000Z',
    order_status: 'delivered',
    buyer_notes: 'Kirim secepatnya',
    seller_notes: 'Dikirim via JNE YES',
    cancel_reason: null,
    created_at: '2025-11-11T10:00:00.000Z',
    updated_at: '2025-11-12T14:00:00.000Z',
    confirmed_at: '2025-11-11T11:25:00.000Z',
    shipped_at: '2025-11-11T12:00:00.000Z',
    delivered_at: '2025-11-12T14:00:00.000Z',
    completed_at: null,
    cancelled_at: null,
    tracking_number: 'JNE9876543210',
    shipping_service: 'JNE YES',
    items: [
      {
        order_item_id: 5,
        product_name: 'Tas Ransel Anti Air',
        product_image: 'http://localhost:5000/uploads/products/backpack-1.jpg',
        variant: 'Warna: Hitam',
        price: 350000,
        quantity: 1,
        subtotal: 350000
      }
    ],
    total_items: 1
  },
  {
    order_id: 5,
    order_number: 'ORD-20251110-00005',
    buyer_id: 8,
    recipient_name: 'Charlie Davis',
    recipient_phone: '081234567894',
    shipping_address: {
      province: 'Sumatera Utara',
      regency: 'Medan',
      district: 'Medan Kota',
      village: 'Pasar Baru',
      postal_code: '20111',
      full_address: 'Jl. Gajah Mada No. 56'
    },
    subtotal: 1250000,
    shipping_cost: 20000,
    total_amount: 1270000,
    payment_method: 'manual_transfer',
    payment_status: 'paid',
    payment_proof: 'http://localhost:5000/uploads/payment-proof/proof-101.jpg',
    paid_at: '2025-11-10T14:30:00.000Z',
    order_status: 'completed',
    buyer_notes: '',
    seller_notes: 'Pesanan selesai',
    cancel_reason: null,
    created_at: '2025-11-10T13:00:00.000Z',
    updated_at: '2025-11-13T08:00:00.000Z',
    confirmed_at: '2025-11-10T14:35:00.000Z',
    shipped_at: '2025-11-10T15:00:00.000Z',
    delivered_at: '2025-11-12T10:00:00.000Z',
    completed_at: '2025-11-13T08:00:00.000Z',
    cancelled_at: null,
    tracking_number: 'JNE5555555555',
    shipping_service: 'JNE Regular',
    items: [
      {
        order_item_id: 6,
        product_name: 'Smartwatch Fitness Tracker',
        product_image: 'http://localhost:5000/uploads/products/smartwatch-1.jpg',
        variant: 'Warna: Silver',
        price: 1250000,
        quantity: 1,
        subtotal: 1250000
      }
    ],
    total_items: 1
  },
  {
    order_id: 6,
    order_number: 'ORD-20251109-00006',
    buyer_id: 9,
    recipient_name: 'Diana Evans',
    recipient_phone: '081234567895',
    shipping_address: {
      province: 'DI Yogyakarta',
      regency: 'Yogyakarta',
      district: 'Gondokusuman',
      village: 'Baciro',
      postal_code: '55225',
      full_address: 'Jl. Pahlawan No. 99'
    },
    subtotal: 1700000,
    shipping_cost: 15000,
    total_amount: 1715000,
    payment_method: 'e-wallet',
    payment_status: 'paid',
    paid_at: '2025-11-09T10:00:00.000Z',
    order_status: 'paid',
    buyer_notes: '',
    seller_notes: null,
    cancel_reason: null,
    created_at: '2025-11-09T09:30:00.000Z',
    updated_at: '2025-11-09T10:05:00.000Z',
    confirmed_at: null,
    shipped_at: null,
    delivered_at: null,
    completed_at: null,
    cancelled_at: null,
    items: [
      {
        order_item_id: 7,
        product_name: 'Headphone Wireless Premium',
        product_image: 'http://localhost:5000/uploads/products/headphone-1.jpg',
        variant: 'Warna: Putih',
        price: 850000,
        quantity: 2,
        subtotal: 1700000
      }
    ],
    total_items: 1
  },
  {
    order_id: 7,
    order_number: 'ORD-20251108-00007',
    buyer_id: 10,
    recipient_name: 'Frank Miller',
    recipient_phone: '081234567896',
    shipping_address: {
      province: 'Jawa Timur',
      regency: 'Malang',
      district: 'Klojen',
      village: 'Kauman',
      postal_code: '65119',
      full_address: 'Jl. Veteran No. 12'
    },
    subtotal: 700000,
    shipping_cost: 12000,
    total_amount: 712000,
    payment_method: 'cod',
    payment_status: 'pending',
    payment_proof: null,
    paid_at: null,
    order_status: 'cancelled',
    buyer_notes: '',
    seller_notes: null,
    cancel_reason: 'Pembeli tidak bisa dihubungi',
    created_at: '2025-11-08T08:00:00.000Z',
    updated_at: '2025-11-08T12:00:00.000Z',
    confirmed_at: null,
    shipped_at: null,
    delivered_at: null,
    completed_at: null,
    cancelled_at: '2025-11-08T12:00:00.000Z',
    items: [
      {
        order_item_id: 8,
        product_name: 'Mouse Gaming Wireless',
        product_image: 'http://localhost:5000/uploads/products/mouse-1.jpg',
        variant: 'Warna: RGB',
        price: 350000,
        quantity: 2,
        subtotal: 700000
      }
    ],
    total_items: 1
  }
];

/**
 * Get fallback orders (offline mode)
 */
const getFallbackOrders = (params = {}) => {
  let filteredOrders = [...FALLBACK_ORDERS];

  // Filter by status
  if (params.status && params.status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.order_status === params.status);
  }

  // Search by order_number or recipient_name
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredOrders = filteredOrders.filter(order =>
      order.order_number.toLowerCase().includes(searchLower) ||
      order.recipient_name.toLowerCase().includes(searchLower)
    );
  }

  // Sort by created_at descending (newest first)
  filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return {
    success: true,
    message: 'Daftar pesanan berhasil diambil (fallback)',
    data: {
      orders: paginatedOrders,
      pagination: {
        current_page: page,
        per_page: limit,
        total_items: filteredOrders.length,
        total_pages: Math.ceil(filteredOrders.length / limit),
        has_next_page: endIndex < filteredOrders.length,
        has_prev_page: page > 1
      },
      filters: {
        status: params.status || 'all',
        search: params.search || null
      }
    }
  };
};

/**
 * Get fallback order detail
 */
const getFallbackOrderDetail = (orderId) => {
  const order = FALLBACK_ORDERS.find(o => o.order_id === parseInt(orderId));

  if (!order) {
    return {
      success: false,
      error: 'Pesanan tidak ditemukan'
    };
  }

  return {
    success: true,
    message: 'Detail pesanan berhasil diambil (fallback)',
    data: {
      ...order,
      total_quantity: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get order status label in Indonesian
 */
export const getOrderStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu Pembayaran',
    paid: 'Sudah Dibayar',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Sampai Tujuan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  return labels[status] || status;
};

/**
 * Get order status color classes
 */
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get payment status label in Indonesian
 */
export const getPaymentStatusLabel = (status) => {
  const labels = {
    pending: 'Belum Bayar',
    paid: 'Lunas',
    failed: 'Gagal',
    refunded: 'Refund'
  };
  return labels[status] || status;
};

/**
 * Get payment status color classes
 */
export const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format currency to IDR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get order statistics
 */
export const getOrderStats = (orders) => {
  return {
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    paid: orders.filter(o => o.order_status === 'paid').length,
    processing: orders.filter(o => o.order_status === 'processing').length,
    shipped: orders.filter(o => o.order_status === 'shipped').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    completed: orders.filter(o => o.order_status === 'completed').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length
  };
};

export default {
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  addTrackingNumber,
  inputShipping,
  getShippingStatus,
  validateShipping,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  formatCurrency,
  formatDate,
  getOrderStats
};
