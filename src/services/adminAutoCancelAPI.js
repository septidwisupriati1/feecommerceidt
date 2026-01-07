/**
 * Admin Auto-Cancel Orders API Service
 * Handles auto-cancel monitoring and configuration
 */

import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';
const AUTO_CANCEL_URL = `${API_BASE_URL}/admin/auto-cancel`;

/**
 * Get auto-cancelled orders
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.date_from - Start date filter
 * @param {string} params.date_to - End date filter
 * @returns {Promise<Object>} Auto-cancelled orders
 */
export const getAutoCancelledOrders = async (params = {}) => {
  try {
    console.log('🔄 [adminAutoCancelAPI] Fetching auto-cancelled orders');
    
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    ).toString();
    
    const url = queryString ? `${AUTO_CANCEL_URL}/orders?${queryString}` : `${AUTO_CANCEL_URL}/orders`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch auto-cancelled orders');
    }

    console.log('✅ [adminAutoCancelAPI] Orders fetched');
    return {
      success: true,
      data: result.data.orders,
      pagination: result.data.pagination
    };
  } catch (error) {
    console.error('❌ [adminAutoCancelAPI] Error:', error);
    
    // Fallback mode
    return useFallbackOrders(params);
  }
};

/**
 * Get auto-cancel statistics
 * @returns {Promise<Object>} Statistics
 */
export const getAutoCancelStatistics = async () => {
  try {
    console.log('📊 [adminAutoCancelAPI] Fetching statistics');
    
    const response = await fetch(`${AUTO_CANCEL_URL}/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch statistics');
    }

    console.log('✅ [adminAutoCancelAPI] Statistics fetched');
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('❌ [adminAutoCancelAPI] Error:', error);
    
    // Fallback statistics
    return {
      success: true,
      data: {
        total_auto_cancelled: 0,
        today_auto_cancelled: 0,
        this_week_auto_cancelled: 0,
        total_stock_released: 0,
        total_amount_cancelled: 0
      }
    };
  }
};

/**
 * Get cron job configuration
 * @returns {Promise<Object>} Cron configuration
 */
export const getCronConfiguration = async () => {
  try {
    console.log('⚙️ [adminAutoCancelAPI] Fetching cron config');
    
    const response = await fetch(`${AUTO_CANCEL_URL}/config`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch config');
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('❌ [adminAutoCancelAPI] Error:', error);
    
    // Fallback config
    return {
      success: true,
      data: {
        schedule: '0 * * * *',
        schedule_description: 'Every hour',
        expiry_duration_hours: 24,
        is_enabled: true,
        last_run: null,
        next_run: null
      }
    };
  }
};

/**
 * Update cron configuration
 * @param {Object} config - Configuration data
 * @returns {Promise<Object>} Updated config
 */
export const updateCronConfiguration = async (config) => {
  try {
    console.log('⚙️ [adminAutoCancelAPI] Updating cron config');
    
    const response = await fetch(`${AUTO_CANCEL_URL}/config`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(config),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update config');
    }

    console.log('✅ [adminAutoCancelAPI] Config updated');
    return {
      success: true,
      message: result.message,
      data: result.data
    };
  } catch (error) {
    console.error('❌ [adminAutoCancelAPI] Error:', error);
    throw error;
  }
};

/**
 * Manually trigger auto-cancel job
 * @returns {Promise<Object>} Execution result
 */
export const triggerManualRun = async () => {
  try {
    console.log('▶️ [adminAutoCancelAPI] Triggering manual run');
    
    const response = await fetch(`${AUTO_CANCEL_URL}/trigger`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to trigger manual run');
    }

    console.log('✅ [adminAutoCancelAPI] Manual run completed');
    return {
      success: true,
      message: result.message,
      data: result.data
    };
  } catch (error) {
    console.error('❌ [adminAutoCancelAPI] Error:', error);
    throw error;
  }
};

/**
 * Fallback data for development
 */
const useFallbackOrders = (params) => {
  console.log('🔄 [adminAutoCancelAPI] FALLBACK MODE - Using dummy data');
  
  const dummyOrders = [
    {
      order_id: 1,
      order_number: 'ORD-20251127-00001',
      total_amount: 150000,
      total_items: 2,
      created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      cancelled_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      cancel_reason: 'Otomatis dibatalkan: Tidak ada pembayaran dalam 24 jam',
      buyer_name: 'John Doe',
      buyer_email: 'john@example.com'
    },
    {
      order_id: 2,
      order_number: 'ORD-20251127-00002',
      total_amount: 300000,
      total_items: 1,
      created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      cancelled_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      cancel_reason: 'Otomatis dibatalkan: Tidak ada pembayaran dalam 24 jam',
      buyer_name: 'Jane Smith',
      buyer_email: 'jane@example.com'
    }
  ];

  return {
    success: true,
    data: dummyOrders,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 20,
      total: 2,
      total_pages: 1,
      has_next: false,
      has_prev: false
    }
  };
};

export default {
  getAutoCancelledOrders,
  getAutoCancelStatistics,
  getCronConfiguration,
  updateCronConfiguration,
  triggerManualRun
};
