import axios from 'axios';
import { getAuthHeaders, validateAuth, debugAuth, clearAuth } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

export const getStore = async () => {
  try {
    validateAuth();
    debugAuth();

    const response = await axios.get(`${BASE_URL}/store`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error('❌ [storeAPI] Error fetching store:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateStore = async (payload) => {
  try {
    validateAuth();
    debugAuth();

    const response = await axios.put(`${BASE_URL}/store`, payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error('❌ [storeAPI] Error updating store:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const uploadStorePhoto = async (file) => {
  try {
    validateAuth();
    debugAuth();

    const formData = new FormData();
    formData.append('store_photo', file);

    const response = await axios.post(`${BASE_URL}/store/photo`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ [storeAPI] Error uploading store photo:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export default {
  getStore,
  updateStore,
  uploadStorePhoto,
};
