/**
 * Admin Order API Service
 * Handles all admin order management API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get all orders (admin view)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {string} params.payment_status - Filter by payment status
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 */
export const getOrders = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.payment_status) queryParams.append('payment_status', params.payment_status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/orders?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil data pesanan');
    }

    return result;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

/**
 * Get order detail
 * @param {number} orderId - Order ID
 */
export const getOrderDetail = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil detail pesanan');
    }

    return result;
  } catch (error) {
    console.error('Get order detail error:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {Object} data - Update data
 * @param {string} data.order_status - New order status
 * @param {string} data.seller_notes - Seller notes (optional)
 */
export const updateOrderStatus = async (orderId, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/orders/${orderId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengupdate status pesanan');
    }

    return result;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
};

/**
 * Verify payment
 * @param {number} orderId - Order ID
 * @param {Object} data - Verification data
 * @param {boolean} data.is_verified - Verification status
 * @param {string} data.notes - Admin notes (optional)
 */
export const verifyPayment = async (orderId, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/orders/${orderId}/verify-payment`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal memverifikasi pembayaran');
    }

    return result;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw error;
  }
};

/**
 * Get order statistics
 */
export const getOrderStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/orders/statistics`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengambil statistik pesanan');
    }

    return result;
  } catch (error) {
    console.error('Get order statistics error:', error);
    throw error;
  }
};

// Fallback mode untuk development tanpa backend
const FALLBACK_ORDERS = [
  {
    order_id: 1,
    order_number: 'ORD-20231115-00001',
    buyer_id: 1,
    seller_id: 1,
    buyer_name: 'John Doe',
    seller_name: 'Toko ABC',
    order_status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'manual_transfer',
    total_amount: 150000,
    total_items: 3,
    created_at: new Date().toISOString(),
  },
  {
    order_id: 2,
    order_number: 'ORD-20231115-00002',
    buyer_id: 2,
    seller_id: 1,
    buyer_name: 'Jane Smith',
    seller_name: 'Toko ABC',
    order_status: 'paid',
    payment_status: 'paid',
    payment_method: 'manual_transfer',
    total_amount: 250000,
    total_items: 5,
    created_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
  },
];

/**
 * Fallback: Get orders from static data
 */
export const getOrdersFallback = (params = {}) => {
  let filtered = [...FALLBACK_ORDERS];
  
  if (params.status) {
    filtered = filtered.filter(order => order.order_status === params.status);
  }
  
  if (params.payment_status) {
    filtered = filtered.filter(order => order.payment_status === params.payment_status);
  }
  
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    success: true,
    message: 'Data pesanan berhasil diambil (FALLBACK MODE)',
    data: {
      orders: filtered.slice(start, end),
      pagination: {
        total: filtered.length,
        page,
        limit,
        total_pages: Math.ceil(filtered.length / limit),
      },
    },
  };
};

// Default export
export default {
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  verifyPayment,
  getOrderStatistics,
  getOrdersFallback,
};
