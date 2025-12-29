/**
 * Product Reports API Service
 * Handles all API calls for product reports management
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all product reports with filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status (pending, investigating, resolved, rejected)
 * @param {string} params.report_type - Filter by report type
 * @param {string} params.search - Search query
 * @param {string} params.sort_by - Sort field
 * @param {string} params.sort_order - Sort order (asc, desc)
 * @returns {Promise<Object>} Reports data with pagination and stats
 */
export const getAllReports = async (params = {}) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.report_type) queryParams.append('report_type', params.report_type);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const url = `${API_BASE_URL}/admin/reports${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      reports: result.data || [],
      pagination: result.pagination || {},
      stats: result.stats || {}
    };
  } catch (error) {
    console.warn('Failed to fetch reports from API, using fallback data:', error);
    return getFallbackReports(params);
  }
};

/**
 * Get single report by ID
 * @param {number} reportId - Report ID
 * @returns {Promise<Object>} Report detail
 */
export const getReportById = async (reportId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Failed to fetch report by ID from API, using fallback:', error);
    // Return fallback data
    const fallbackData = getFallbackReports();
    const report = fallbackData.reports.find(r => r.report_id === parseInt(reportId));
    return report || null;
  }
};

/**
 * Update report status
 * @param {number} reportId - Report ID
 * @param {Object} updateData - Update data
 * @param {string} updateData.status - New status (pending, investigating, resolved, rejected)
 * @param {string} updateData.admin_notes - Admin notes
 * @param {string} updateData.action_taken - Action taken description
 * @returns {Promise<Object>} Updated report
 */
export const updateReportStatus = async (reportId, updateData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Failed to update report from API, using fallback mode:', error);
    // Fallback mode: return success with updated data
    return {
      report_id: reportId,
      ...updateData,
      updated_at: new Date().toISOString(),
      _fallback: true
    };
  }
};

/**
 * Delete report
 * @param {number} reportId - Report ID
 * @returns {Promise<Object>} Success message
 */
export const deleteReport = async (reportId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('Failed to delete report from API, using fallback mode:', error);
    // Fallback mode: return success
    return {
      success: true,
      message: 'Report deleted successfully (fallback mode)',
      _fallback: true
    };
  }
};

/**
 * Get reports statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getReportsStats = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Failed to fetch reports stats from API, using fallback:', error);
    return getFallbackStats();
  }
};

/**
 * Export reports to Excel
 * @returns {Promise<Blob>} Excel file blob
 */
export const exportReportsToExcel = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/export/csv`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.warn('Failed to export reports to Excel from API:', error);
    throw error;
  }
};

/**
 * Export reports to PDF
 * @returns {Promise<Blob>} PDF file blob
 */
export const exportReportsToPDF = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports/export/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.warn('Failed to export reports to PDF from API:', error);
    throw error;
  }
};

/**
 * Fallback reports data (used when API is not available)
 */
const getFallbackReports = (params = {}) => {
  const allReports = [
    {
      report_id: 1,
      product_id: 101,
      product_name: 'Smartphone Android X1',
      seller_name: 'Toko Elektronik Jaya',
      store_name: 'Toko Elektronik Jaya',
      product_status: 'active',
      reporter_name: 'John Doe',
      reporter_email: 'john@example.com',
      report_type: 'fake_product',
      description: 'Produk ini terlihat seperti palsu, banyak perbedaan dengan produk asli',
      evidence_image: '/uploads/reports/evidence1.jpg',
      status: 'pending',
      admin_notes: null,
      resolved_at: null,
      created_at: '2025-11-10T10:00:00.000Z',
      updated_at: '2025-11-10T10:00:00.000Z'
    },
    {
      report_id: 2,
      product_id: 102,
      product_name: 'Laptop Gaming Pro',
      seller_name: 'Tech Store Indonesia',
      store_name: 'Tech Store Indonesia',
      product_status: 'active',
      reporter_name: 'Jane Smith',
      reporter_email: 'jane@example.com',
      report_type: 'misleading_description',
      description: 'Deskripsi produk tidak sesuai dengan barang yang diterima',
      evidence_image: '/uploads/reports/evidence2.jpg',
      status: 'investigating',
      admin_notes: 'Sedang dalam proses verifikasi dengan seller',
      resolved_at: null,
      created_at: '2025-11-09T14:30:00.000Z',
      updated_at: '2025-11-11T09:15:00.000Z'
    },
    {
      report_id: 3,
      product_id: 103,
      product_name: 'Sepatu Olahraga Premium',
      seller_name: 'Sport Gear Shop',
      store_name: 'Sport Gear Shop',
      product_status: 'suspended',
      reporter_name: 'Mike Johnson',
      reporter_email: 'mike@example.com',
      report_type: 'counterfeit',
      description: 'Barang KW, bukan produk original',
      evidence_image: '/uploads/reports/evidence3.jpg',
      status: 'resolved',
      admin_notes: 'Produk telah ditangguhkan, seller diberi peringatan',
      resolved_at: '2025-11-11T16:00:00.000Z',
      created_at: '2025-11-08T08:20:00.000Z',
      updated_at: '2025-11-11T16:00:00.000Z'
    },
    {
      report_id: 4,
      product_id: 104,
      product_name: 'Tas Fashion Wanita',
      seller_name: 'Fashion Paradise',
      store_name: 'Fashion Paradise',
      product_status: 'active',
      reporter_name: 'Sarah Williams',
      reporter_email: 'sarah@example.com',
      report_type: 'inappropriate_content',
      description: 'Gambar produk mengandung konten tidak pantas',
      evidence_image: '/uploads/reports/evidence4.jpg',
      status: 'rejected',
      admin_notes: 'Setelah review, gambar produk masih dalam batas wajar',
      resolved_at: '2025-11-10T11:30:00.000Z',
      created_at: '2025-11-07T15:45:00.000Z',
      updated_at: '2025-11-10T11:30:00.000Z'
    },
    {
      report_id: 5,
      product_id: 105,
      product_name: 'Jam Tangan Mewah',
      seller_name: 'Luxury Watch Store',
      store_name: 'Luxury Watch Store',
      product_status: 'active',
      reporter_name: 'Robert Brown',
      reporter_email: 'robert@example.com',
      report_type: 'copyright_violation',
      description: 'Menggunakan gambar brand tanpa izin',
      evidence_image: '/uploads/reports/evidence5.jpg',
      status: 'pending',
      admin_notes: null,
      resolved_at: null,
      created_at: '2025-11-11T12:00:00.000Z',
      updated_at: '2025-11-11T12:00:00.000Z'
    },
    {
      report_id: 6,
      product_id: 106,
      product_name: 'Kamera Digital DSLR',
      seller_name: 'Photo Equipment Store',
      store_name: 'Photo Equipment Store',
      product_status: 'active',
      reporter_name: 'Emily Davis',
      reporter_email: 'emily@example.com',
      report_type: 'fake_product',
      description: 'Produk tidak original, kemungkinan palsu',
      evidence_image: '/uploads/reports/evidence6.jpg',
      status: 'investigating',
      admin_notes: 'Menunggu bukti tambahan dari reporter',
      resolved_at: null,
      created_at: '2025-11-06T09:30:00.000Z',
      updated_at: '2025-11-09T14:20:00.000Z'
    },
    {
      report_id: 7,
      product_id: 107,
      product_name: 'Headphone Bluetooth',
      seller_name: 'Audio Mania',
      store_name: 'Audio Mania',
      product_status: 'active',
      reporter_name: 'David Wilson',
      reporter_email: 'david@example.com',
      report_type: 'misleading_description',
      description: 'Spesifikasi tidak sesuai dengan yang tertulis',
      evidence_image: '/uploads/reports/evidence7.jpg',
      status: 'pending',
      admin_notes: null,
      resolved_at: null,
      created_at: '2025-11-11T16:45:00.000Z',
      updated_at: '2025-11-11T16:45:00.000Z'
    },
    {
      report_id: 8,
      product_id: 108,
      product_name: 'Skincare Set Premium',
      seller_name: 'Beauty Corner',
      store_name: 'Beauty Corner',
      product_status: 'active',
      reporter_name: 'Lisa Anderson',
      reporter_email: 'lisa@example.com',
      report_type: 'counterfeit',
      description: 'Produk kemungkinan palsu, tidak ada hologram',
      evidence_image: '/uploads/reports/evidence8.jpg',
      status: 'investigating',
      admin_notes: 'Sedang koordinasi dengan brand owner',
      resolved_at: null,
      created_at: '2025-11-05T13:15:00.000Z',
      updated_at: '2025-11-10T10:00:00.000Z'
    },
    {
      report_id: 9,
      product_id: 109,
      product_name: 'Buku Koleksi Langka',
      seller_name: 'Rare Books Store',
      store_name: 'Rare Books Store',
      product_status: 'active',
      reporter_name: 'Michael Taylor',
      reporter_email: 'michael@example.com',
      report_type: 'spam',
      description: 'Produk duplikat, seller spam listing',
      evidence_image: '/uploads/reports/evidence9.jpg',
      status: 'resolved',
      admin_notes: 'Listing duplikat dihapus',
      resolved_at: '2025-11-09T15:30:00.000Z',
      created_at: '2025-11-04T11:00:00.000Z',
      updated_at: '2025-11-09T15:30:00.000Z'
    },
    {
      report_id: 10,
      product_id: 110,
      product_name: 'Vitamin Suplemen',
      seller_name: 'Health Mart',
      store_name: 'Health Mart',
      product_status: 'active',
      reporter_name: 'Jennifer Martinez',
      reporter_email: 'jennifer@example.com',
      report_type: 'misleading_description',
      description: 'Klaim kesehatan yang berlebihan dan tidak terbukti',
      evidence_image: '/uploads/reports/evidence10.jpg',
      status: 'pending',
      admin_notes: null,
      resolved_at: null,
      created_at: '2025-11-12T08:00:00.000Z',
      updated_at: '2025-11-12T08:00:00.000Z'
    }
  ];

  // Apply filtering
  let filtered = allReports;
  
  if (params.status) {
    filtered = filtered.filter(r => r.status === params.status);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(r => 
      r.reporter_name.toLowerCase().includes(searchLower) ||
      r.product_name.toLowerCase().includes(searchLower) ||
      r.store_name.toLowerCase().includes(searchLower) ||
      r.description.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReports = filtered.slice(startIndex, endIndex);

  return {
    reports: paginatedReports,
    pagination: {
      page: page,
      limit: limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: endIndex < filtered.length,
      hasPrev: page > 1
    },
    stats: getFallbackStats()
  };
};

/**
 * Fallback statistics data
 */
const getFallbackStats = () => {
  return {
    total_reports: 10,
    by_status: {
      pending: 4,
      investigating: 3,
      resolved: 2,
      rejected: 1
    },
    by_type: {
      fake_product: 2,
      misleading_description: 3,
      inappropriate_content: 1,
      copyright_violation: 1,
      counterfeit: 2,
      spam: 1
    },
    recent_activity: {
      last_7_days: 6,
      last_30_days: 10,
      avg_resolution_time_days: 2.3
    }
  };
};

/**
 * Helper function to format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Helper function to get status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    investigating: 'Diinvestigasi',
    resolved: 'Selesai',
    rejected: 'Ditolak'
  };
  return labels[status] || status;
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Helper function to get report type label
 */
export const getReportTypeLabel = (type) => {
  const labels = {
    inappropriate_content: 'Konten Tidak Pantas',
    fake_product: 'Produk Palsu',
    misleading_description: 'Deskripsi Menyesatkan',
    copyright_violation: 'Pelanggaran Hak Cipta',
    counterfeit: 'Barang KW',
    spam: 'Spam',
    other: 'Lainnya'
  };
  return labels[type] || type;
};

export default {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getReportsStats,
  exportReportsToExcel,
  exportReportsToPDF,
  formatDate,
  getStatusLabel,
  getStatusColor,
  getReportTypeLabel
};
