/**
 * Admin Payment Verification API Service
 * Handles payment verification for manual transfers
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get pending payments
 * @param {Object} params - Query parameters
 * @param {string} params.status - pending_verification, rejected, all
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search query
 * @param {number} params.seller_id - Filter by seller
 */
export const getPendingPayments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.seller_id) queryParams.append('seller_id', params.seller_id);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/payments/pending?${queryParams}`,
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
      throw new Error(result.message || 'Gagal mengambil data pembayaran');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getPendingPaymentsFallback(params);
  }
};

/**
 * Get payment detail
 * @param {number} orderId - Order ID
 */
export const getPaymentDetail = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/payments/${orderId}`,
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
      throw new Error(result.message || 'Gagal mengambil detail pembayaran');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getPaymentDetailFallback(orderId);
  }
};

/**
 * Approve payment
 * @param {number} orderId - Order ID
 * @param {Object} data - Approval data
 * @param {string} data.admin_notes - Admin notes (optional)
 */
export const approvePayment = async (orderId, data = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/payments/${orderId}/approve`,
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
      throw new Error(result.message || 'Gagal menyetujui pembayaran');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'Pembayaran berhasil disetujui (FALLBACK MODE)',
      data: {
        order_id: orderId,
        payment_status: 'approved',
        order_status: 'processing',
        approved_at: new Date().toISOString(),
        admin_notes: data.admin_notes || null
      },
      _fallback: true
    };
  }
};

/**
 * Reject payment
 * @param {number} orderId - Order ID
 * @param {Object} data - Rejection data
 * @param {string} data.rejection_reason - Rejection reason (required)
 */
export const rejectPayment = async (orderId, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/payments/${orderId}/reject`,
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
      throw new Error(result.message || 'Gagal menolak pembayaran');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'Pembayaran berhasil ditolak (FALLBACK MODE)',
      data: {
        order_id: orderId,
        payment_status: 'rejected',
        order_status: 'cancelled',
        rejected_at: new Date().toISOString(),
        rejection_reason: data.rejection_reason
      },
      _fallback: true
    };
  }
};

// Fallback mode untuk development tanpa backend
const FALLBACK_PAYMENTS = [
  {
    order_id: 1,
    order_number: 'ORD-20241112-00001',
    payment_status: 'pending_verification',
    payment_proof: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Payment+Proof+1',
    payment_rejected_at: null,
    payment_rejection_reason: null,
    order_status: 'pending',
    total_amount: 150000,
    created_at: new Date().toISOString(),
    buyer: {
      user_id: 5,
      name: 'John Doe',
      email: 'buyer@example.com',
    },
    seller: {
      seller_id: 2,
      store_name: 'Toko Elektronik',
      owner_name: 'Jane Seller',
      owner_email: 'seller@example.com',
    },
    items_count: 2,
    items: [
      {
        product_name: 'Laptop Gaming',
        quantity: 1,
        price: 120000,
        subtotal: 120000,
      },
      {
        product_name: 'Mouse Wireless',
        quantity: 1,
        price: 30000,
        subtotal: 30000,
      },
    ],
  },
  {
    order_id: 2,
    order_number: 'ORD-20241112-00002',
    payment_status: 'rejected',
    payment_proof: 'https://via.placeholder.com/400x300/F44336/FFFFFF?text=Payment+Proof+2',
    payment_rejected_at: new Date().toISOString(),
    payment_rejection_reason: 'Bukti transfer tidak jelas. Mohon upload ulang dengan foto yang lebih jelas.',
    order_status: 'pending',
    total_amount: 250000,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    buyer: {
      user_id: 6,
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    seller: {
      seller_id: 3,
      store_name: 'Toko Fashion',
      owner_name: 'Bob Seller',
      owner_email: 'bob@example.com',
    },
    items_count: 1,
    items: [
      {
        product_name: 'Dress Casual',
        quantity: 2,
        price: 125000,
        subtotal: 250000,
      },
    ],
  },
];

/**
 * Fallback: Get pending payments from static data
 */
export const getPendingPaymentsFallback = (params = {}) => {
  let filtered = [...FALLBACK_PAYMENTS];
  
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(payment => payment.payment_status === params.status);
  }
  
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(payment => 
      payment.order_number.toLowerCase().includes(search) ||
      payment.buyer.name.toLowerCase().includes(search) ||
      payment.seller.store_name.toLowerCase().includes(search)
    );
  }
  
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    success: true,
    message: 'Daftar pembayaran berhasil diambil (FALLBACK MODE)',
    data: {
      orders: filtered.slice(start, end),
      pagination: {
        current_page: page,
        total_pages: Math.ceil(filtered.length / limit),
        total_items: filtered.length,
        items_per_page: limit,
      },
    },
  };
};

/**
 * Fallback: Get payment detail
 */
export const getPaymentDetailFallback = (orderId) => {
  const payment = FALLBACK_PAYMENTS.find(p => p.order_id === parseInt(orderId));
  
  if (!payment) {
    throw new Error('Order tidak ditemukan');
  }
  
  return {
    success: true,
    message: 'Detail pembayaran berhasil diambil (FALLBACK MODE)',
    data: {
      ...payment,
      subtotal: payment.total_amount - 15000,
      shipping_cost: 15000,
      payment_method: 'manual_transfer',
      buyer: {
        ...payment.buyer,
        phone: '081234567890',
      },
      seller: {
        ...payment.seller,
        owner_phone: '089876543210',
      },
      bank_account: {
        bank_name: 'BCA',
        account_number: '1234567890',
        account_name: payment.seller.owner_name,
        account_type: 'bank',
      },
      shipping_address: {
        recipient_name: payment.buyer.name,
        recipient_phone: '081234567890',
        full_address: 'Jl. Sudirman No. 123, Kelurahan A, Kecamatan B, Kota C, Provinsi D 12345',
      },
      buyer_notes: 'Mohon dikemas dengan bubble wrap',
      seller_notes: null,
      updated_at: payment.created_at,
    },
  };
};

// Default export
export default {
  getPendingPayments,
  getPaymentDetail,
  approvePayment,
  rejectPayment,
  getPendingPaymentsFallback,
  getPaymentDetailFallback,
};
