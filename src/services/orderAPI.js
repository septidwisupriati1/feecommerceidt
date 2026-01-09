import axios from 'axios';
import { validateAuth, getAuthHeaders, debugAuth } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Order API (buyer)
 */
const orderAPI = {
  /**
   * Direct checkout (bypass cart on backend)
   * Expects payload: { seller_id, items, shipping_address_id?, shipping_address?, shipping_cost?, buyer_notes?, payment_method?, bank_account_id? }
   */
  createOrder: async (payload) => {
    validateAuth();
    debugAuth();
    const res = await axios.post(`${BASE_URL}/buyer/orders/checkout-direct`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  /**
   * Upload payment proof for an order
   */
  uploadPaymentProof: async (orderId, formData) => {
    validateAuth();
    debugAuth();
    const res = await axios.post(`${BASE_URL}/buyer/orders/${orderId}/payment-proof`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  /**
   * Confirm Midtrans payment from client callback
   */
  confirmMidtransPayment: async (payload) => {
    validateAuth();
    debugAuth();
    const res = await axios.post(`${BASE_URL}/payments/midtrans/confirm`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },
};

export default orderAPI;
