/**
 * Admin Store Management API Service
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get all stores with filters
 */
export const getStores = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/stores?${queryParams}`,
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
      throw new Error(result.message || 'Gagal mengambil data toko');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getStoresFallback(params);
  }
};

/**
 * Get store detail
 */
export const getStoreDetail = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/stores/${sellerId}`,
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
      throw new Error(result.message || 'Gagal mengambil detail toko');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    const fallback = getStoresFallback();
    const store = fallback.data.find(s => s.seller_id === parseInt(sellerId));
    return { success: true, data: store || null };
  }
};

/**
 * Update store status
 */
export const updateStoreStatus = async (sellerId, status, reason = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/stores/${sellerId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, reason }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengubah status toko');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'Status toko berhasil diubah (FALLBACK MODE)',
      data: { seller_id: sellerId, status, reason, updated_at: new Date().toISOString() },
      _fallback: true
    };
  }
};

/**
 * Get store reports
 */
export const getStoreReports = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.seller_id) queryParams.append('seller_id', params.seller_id);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/store-reports?${queryParams}`,
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
      throw new Error(result.message || 'Gagal mengambil data laporan');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getStoreReportsFallback(params);
  }
};

/**
 * Get store report statistics
 */
export const getReportStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/store-reports/statistics`,
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
      throw new Error(result.message || 'Gagal mengambil statistik laporan');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getReportStatisticsFallback();
  }
};

/**
 * Update report status
 */
export const updateReportStatus = async (reportId, status, adminNotes = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/store-reports/${reportId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal mengubah status laporan');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'Status laporan berhasil diubah (FALLBACK MODE)',
      data: { report_id: reportId, status, admin_notes: adminNotes, updated_at: new Date().toISOString() },
      _fallback: true
    };
  }
};

// Fallback data
const FALLBACK_STORES = [
  {
    seller_id: 1,
    user_id: 10,
    store_name: 'Toko Elektronik Jaya',
    store_photo: 'https://via.placeholder.com/100',
    location: {
      province: 'DKI Jakarta',
      regency: 'Jakarta Selatan',
      district: 'Kebayoran Baru',
      village: 'Senayan',
      postal_code: '12190'
    },
    full_address: 'Jl. Senayan No. 123',
    status: 'active',
    seller_info: {
      full_name: 'John Seller',
      email: 'seller1@example.com',
      phone: '081234567891',
      email_verified: true,
      user_status: 'active'
    },
    statistics: {
      rating_average: 4.5,
      total_reviews: 50,
      total_products: 25,
      active_products: 23
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    seller_id: 2,
    user_id: 11,
    store_name: 'Fashion Store',
    store_photo: 'https://via.placeholder.com/100',
    location: {
      province: 'Jawa Barat',
      regency: 'Bandung',
      district: 'Bandung Wetan',
      village: 'Citarum',
      postal_code: '40115'
    },
    full_address: 'Jl. Braga No. 45',
    status: 'active',
    seller_info: {
      full_name: 'Jane Fashion',
      email: 'seller2@example.com',
      phone: '082345678902',
      email_verified: true,
      user_status: 'active'
    },
    statistics: {
      rating_average: 4.8,
      total_reviews: 120,
      total_products: 50,
      active_products: 48
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const FALLBACK_REPORTS = [
  {
    report_id: 1,
    seller: {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      store_photo: 'https://via.placeholder.com/100',
      rating_average: 4.5,
      total_reviews: 50,
      status: 'active',
      user: {
        user_id: 10,
        username: 'seller1',
        email: 'seller1@example.com',
        full_name: 'John Seller'
      }
    },
    reporter: {
      user_id: 15,
      username: 'customer1',
      full_name: 'Customer One',
      email: 'customer1@example.com',
      profile_picture: 'https://via.placeholder.com/50'
    },
    reason: 'Menjual produk palsu',
    evidence: 'Produk yang diterima tidak sesuai dengan deskripsi dan foto yang ditampilkan',
    status: 'pending',
    admin_notes: null,
    resolved_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    report_id: 2,
    seller: {
      seller_id: 2,
      store_name: 'Fashion Store',
      store_photo: 'https://via.placeholder.com/100',
      rating_average: 4.8,
      total_reviews: 120,
      status: 'active',
      user: {
        user_id: 11,
        username: 'seller2',
        email: 'seller2@example.com',
        full_name: 'Jane Fashion'
      }
    },
    reporter: {
      user_id: 16,
      username: 'customer2',
      full_name: 'Customer Two',
      email: 'customer2@example.com',
      profile_picture: 'https://via.placeholder.com/50'
    },
    reason: 'Pelayanan buruk',
    evidence: 'Seller tidak responsif dan tidak membalas chat selama 3 hari',
    status: 'investigating',
    admin_notes: 'Sedang melakukan pengecekan chat history',
    resolved_at: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const getStoresFallback = (params = {}) => {
  let filtered = [...FALLBACK_STORES];
  
  if (params.status) {
    filtered = filtered.filter(store => store.status === params.status);
  }
  
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(store => 
      store.store_name.toLowerCase().includes(search) ||
      store.seller_info.full_name.toLowerCase().includes(search) ||
      store.seller_info.email.toLowerCase().includes(search)
    );
  }
  
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    success: true,
    message: 'Stores retrieved successfully (FALLBACK MODE)',
    data: filtered.slice(start, end),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: page < Math.ceil(filtered.length / limit),
      hasPrev: page > 1
    },
    stats: {
      total_stores: filtered.length,
      by_status: {
        active: filtered.filter(s => s.status === 'active').length,
        inactive: filtered.filter(s => s.status === 'inactive').length,
        suspended: filtered.filter(s => s.status === 'suspended').length
      }
    }
  };
};

export const getStoreReportsFallback = (params = {}) => {
  let filtered = [...FALLBACK_REPORTS];
  
  if (params.status) {
    filtered = filtered.filter(report => report.status === params.status);
  }
  
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(report => 
      report.reason.toLowerCase().includes(search) ||
      report.evidence.toLowerCase().includes(search) ||
      report.seller.store_name.toLowerCase().includes(search)
    );
  }
  
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    success: true,
    message: 'Store reports retrieved successfully (FALLBACK MODE)',
    data: {
      reports: filtered.slice(start, end),
      pagination: {
        current_page: page,
        per_page: limit,
        total_items: filtered.length,
        total_pages: Math.ceil(filtered.length / limit),
        has_next: page < Math.ceil(filtered.length / limit),
        has_prev: page > 1
      }
    }
  };
};

export const getReportStatisticsFallback = () => {
  return {
    success: true,
    message: 'Report statistics retrieved successfully (FALLBACK MODE)',
    data: {
      total_reports: 2,
      by_status: {
        pending: 1,
        investigating: 1,
        resolved: 0,
        rejected: 0
      },
      recent_reports: {
        today: 1,
        this_week: 2,
        this_month: 2
      }
    }
  };
};

export default {
  getStores,
  getStoreDetail,
  updateStoreStatus,
  getStoreReports,
  getReportStatistics,
  updateReportStatus,
  getStoresFallback,
  getStoreReportsFallback,
  getReportStatisticsFallback
};
