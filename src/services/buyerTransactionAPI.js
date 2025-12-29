import axios from 'axios';
import { validateAuth, getAuthHeaders, debugAuth } from '../utils/auth';

const BASE_URL = 'http://localhost:5000/api/ecommerce';

/**
 * Buyer Transaction API Service
 * Endpoints untuk buyer melihat histori transaksi, detail order, tracking info
 */
export const buyerTransactionAPI = {
  /**
   * GET /buyer/transactions - List histori transaksi dengan filtering & pagination
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by order_status (pending, paid, processing, shipped, delivered, completed, cancelled)
   * @param {string} params.payment_status - Filter by payment_status (unpaid, paid, refunded)
   * @param {string} params.search - Search by order_number atau product_name
   * @param {string} params.date_from - Filter dari tanggal (YYYY-MM-DD)
   * @param {string} params.date_to - Filter sampai tanggal (YYYY-MM-DD)
   * @param {number} params.page - Halaman (default: 1)
   * @param {number} params.limit - Jumlah per halaman (default: 10, max: 100)
   * @param {string} params.sort_by - Sort by field (created_at, total_amount, order_status, payment_status)
   * @param {string} params.sort_order - Sort order (asc, desc)
   * @returns {Promise<Object>} Response dengan transactions, pagination, summary
   */
  getTransactions: async (params = {}) => {
    try {
      console.log('🛒 [buyerTransactionAPI] Fetching transactions with params:', params);
      
      // Validate authentication
      validateAuth();
      debugAuth();

      const response = await axios.get(`${BASE_URL}/buyer/transactions`, {
        headers: getAuthHeaders(),
        params
      });

      console.log('✅ [buyerTransactionAPI] Transactions fetched:', response.data.data?.transactions?.length || 0, 'orders');
      return response.data;
    } catch (error) {
      console.error('❌ [buyerTransactionAPI] Error fetching transactions:', error.response?.data || error.message);
      
      // Check for 401 unauthorized
      if (error.response?.status === 401) {
        console.warn('⚠️ Token expired or invalid, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw error;
      }
      
      // Fallback mode - return dummy data for development
      console.warn('⚠️ [buyerTransactionAPI] Using fallback mode - returning dummy data');
      return {
        success: true,
        message: 'Transactions retrieved (fallback mode)',
        data: {
          transactions: [
            {
              transaction_id: 1,
              order_number: 'ORD-2024-001',
              seller_id: 1,
              seller_name: 'Toko Elektronik',
              total_amount: 5500000,
              order_status: 'shipped',
              payment_status: 'paid',
              payment_method: 'manual_transfer',
              shipping_courier: 'jne',
              tracking_number: 'JNE1234567890',
              shipping_address: 'Jl. Sudirman No. 123, Jakarta',
              created_at: '2024-11-20T10:00:00.000Z',
              items: [
                {
                  product_name: 'Smartphone Android',
                  quantity: 1,
                  price: 5000000,
                  product_image: 'https://via.placeholder.com/150'
                }
              ]
            },
            {
              transaction_id: 2,
              order_number: 'ORD-2024-002',
              seller_id: 2,
              seller_name: 'Fashion Store',
              total_amount: 350000,
              order_status: 'delivered',
              payment_status: 'paid',
              payment_method: 'transfer',
              shipping_courier: 'sicepat',
              tracking_number: 'SCP9876543210',
              shipping_address: 'Jl. Thamrin No. 45, Jakarta',
              created_at: '2024-11-18T14:30:00.000Z',
              items: [
                {
                  product_name: 'Kaos Polos Premium',
                  quantity: 2,
                  price: 150000,
                  product_image: 'https://via.placeholder.com/150'
                }
              ]
            },
            {
              transaction_id: 3,
              order_number: 'ORD-2024-003',
              seller_id: 3,
              seller_name: 'Toko Buku',
              total_amount: 250000,
              order_status: 'pending',
              payment_status: 'unpaid',
              payment_method: 'manual_transfer',
              shipping_courier: 'jnt',
              shipping_address: 'Jl. Asia Afrika No. 78, Bandung',
              created_at: '2024-11-23T09:15:00.000Z',
              items: [
                {
                  product_name: 'Buku Programming',
                  quantity: 3,
                  price: 75000,
                  product_image: 'https://via.placeholder.com/150'
                }
              ]
            }
          ],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: 3,
            total_pages: 1
          },
          summary: {
            total_orders: 3,
            total_spent: 6100000,
            pending_orders: 1,
            completed_orders: 1
          }
        }
      };
    }
  },

  /**
   * GET /buyer/transactions/:id - Detail lengkap transaksi
   * @param {number} transactionId - ID transaksi
   * @returns {Promise<Object>} Detail transaksi lengkap dengan tracking, seller info, payment info
   */
  getTransactionDetail: async (transactionId) => {
    try {
      console.log('📦 [buyerTransactionAPI] Fetching transaction detail for ID:', transactionId);
      
      validateAuth();
      
      const response = await axios.get(`${BASE_URL}/buyer/transactions/${transactionId}`, {
        headers: getAuthHeaders()
      });

      console.log('✅ [buyerTransactionAPI] Transaction detail fetched:', response.data.data?.order_number);
      return response.data;
    } catch (error) {
      console.error('❌ [buyerTransactionAPI] Error fetching transaction detail:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw error;
      }
      
      // Fallback mode
      console.warn('⚠️ [buyerTransactionAPI] Using fallback mode for transaction detail');
      return {
        success: true,
        message: 'Transaction detail retrieved (fallback mode)',
        data: {
          transaction_id: transactionId,
          order_number: `ORD-2024-${String(transactionId).padStart(3, '0')}`,
          seller_id: 1,
          seller_name: 'Toko Elektronik',
          total_amount: 5500000,
          order_status: 'shipped',
          payment_status: 'paid',
          payment_method: 'manual_transfer',
          shipping_courier: 'jne',
          tracking_number: 'JNE1234567890',
          shipping_address: 'Jl. Sudirman No. 123, Jakarta',
          created_at: '2024-11-20T10:00:00.000Z',
          items: [
            {
              product_name: 'Smartphone Android',
              quantity: 1,
              price: 5000000,
              product_image: 'https://via.placeholder.com/150'
            }
          ]
        }
      };
    }
  },

  /**
   * GET /buyer/transactions/:id/tracking - Quick tracking info
   * @param {number} transactionId - ID transaksi
   * @returns {Promise<Object>} Tracking information only (lighter response)
   */
  getTrackingInfo: async (transactionId) => {
    try {
      console.log('🚚 [buyerTransactionAPI] Fetching tracking info for ID:', transactionId);
      
      validateAuth();
      
      const response = await axios.get(`${BASE_URL}/buyer/transactions/${transactionId}/tracking`, {
        headers: getAuthHeaders()
      });

      console.log('✅ [buyerTransactionAPI] Tracking info fetched:', response.data.data?.tracking?.tracking_number || 'No tracking yet');
      return response.data;
    } catch (error) {
      console.error('❌ [buyerTransactionAPI] Error fetching tracking info:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw error;
      }
      
      // Fallback mode
      console.warn('⚠️ [buyerTransactionAPI] Using fallback mode for tracking info');
      return {
        success: true,
        message: 'Tracking info retrieved (fallback mode)',
        data: {
          tracking: {
            tracking_number: 'JNE1234567890',
            courier: 'jne',
            status: 'shipped',
            estimated_delivery: '2024-11-25',
            last_update: '2024-11-23T15:30:00.000Z',
            history: [
              {
                timestamp: '2024-11-23T15:30:00.000Z',
                status: 'In Transit',
                location: 'Jakarta Hub'
              },
              {
                timestamp: '2024-11-23T10:00:00.000Z',
                status: 'Picked Up',
                location: 'Seller Location'
              }
            ]
          }
        }
      };
    }
  },

  /**
   * GET /buyer/transactions/summary - Statistik/summary transaksi buyer
   * @returns {Promise<Object>} Summary counts dan total pengeluaran
   */
  getSummary: async () => {
    try {
      console.log('📊 [buyerTransactionAPI] Fetching transaction summary...');
      
      validateAuth();
      
      const response = await axios.get(`${BASE_URL}/buyer/transactions/summary`, {
        headers: getAuthHeaders()
      });

      console.log('✅ [buyerTransactionAPI] Summary fetched:', response.data.data);
      return response.data;
    } catch (error) {
      console.error('❌ [buyerTransactionAPI] Error fetching summary:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw error;
      }
      
      // Fallback mode - return dummy summary
      console.warn('⚠️ [buyerTransactionAPI] Using fallback mode for summary');
      return {
        success: true,
        message: 'Summary retrieved (fallback mode)',
        data: {
          total_orders: 3,
          total_spent: 6100000,
          pending_orders: 1,
          completed_orders: 1,
          cancelled_orders: 0,
          active_orders: 2
        }
      };
    }
  }
};

export default buyerTransactionAPI;
