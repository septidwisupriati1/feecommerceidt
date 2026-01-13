import axios from 'axios';
import { validateAuth, getAuthHeaders, debugAuth } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

const buyerProductAPI = {
  // Public list products (no auth required)
  getProducts: async (params = {}) => {
    const res = await axios.get(`${BASE_URL}/buyer/products`, { params });
    return res.data;
  },

  // Public product detail (no auth required)
  getProductDetail: async (productId) => {
    const res = await axios.get(`${BASE_URL}/buyer/products/${productId}`);
    return res.data;
  },

  // Authenticated variant (if needed for personalized data)
  getProductsAuth: async (params = {}) => {
    validateAuth();
    debugAuth();
    const res = await axios.get(`${BASE_URL}/buyer/products`, {
      params,
      headers: getAuthHeaders(),
    });
    return res.data;
  },
};

export default buyerProductAPI;
