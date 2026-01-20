import axios from 'axios';
import { getAuthHeaders, validateAuth, debugAuth, clearAuth } from '../utils/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Profile API Service
 * Handles buyer profile retrieval and updates (including primary shipping address).
 */
export const getProfile = async () => {
  try {
    validateAuth();
    debugAuth();

    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error('❌ [profileAPI] Error fetching profile:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateProfile = async (payload) => {
  try {
    validateAuth();
    debugAuth();

    const response = await axios.put(`${BASE_URL}/profile`, payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error('❌ [profileAPI] Error updating profile:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    validateAuth();
    debugAuth();

    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await axios.post(`${BASE_URL}/profile/picture`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ [profileAPI] Error uploading profile picture:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
  uploadProfilePicture,
};
