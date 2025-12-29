/**
 * Admin User Management API Service
 * Handles all API calls for user CRUD operations
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get all users with filters and pagination
 */
export const getUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.username) queryParams.append('username', params.username);
    if (params.email) queryParams.append('email', params.email);
    if (params.full_name) queryParams.append('full_name', params.full_name);
    if (params.role_type) queryParams.append('role_type', params.role_type);
    if (params.status) queryParams.append('status', params.status);
    if (params.email_verified !== undefined) queryParams.append('email_verified', params.email_verified);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users?${queryParams}`,
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
      throw new Error(result.message || 'Gagal mengambil data user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getUsersFallback(params);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}`,
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
      throw new Error(result.message || 'Gagal mengambil detail user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    const fallback = getUsersFallback();
    const user = fallback.data.users.find(u => u.user_id === parseInt(userId));
    return { success: true, data: user || null };
  }
};

/**
 * Create new user
 */
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Gagal membuat user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'User created successfully (FALLBACK MODE)',
      data: {
        user_id: Math.floor(Math.random() * 10000),
        ...userData,
        password: undefined, // Don't return password
        email_verified: userData.email_verified || false,
        status: userData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: {
          role_id: Math.floor(Math.random() * 100),
          role_type: userData.role_type || 'seller'
        }
      },
      _fallback: true
    };
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Gagal update user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'User updated successfully (FALLBACK MODE)',
      data: {
        user_id: userId,
        ...userData,
        password: undefined,
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Gagal menghapus user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback mode:', error.message);
    return {
      success: true,
      message: 'User deactivated successfully (FALLBACK MODE)',
      data: {
        user_id: userId,
        status: 'inactive',
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users/statistics`,
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
      throw new Error(result.message || 'Gagal mengambil statistik user');
    }

    return result;
  } catch (error) {
    console.warn('Backend not available, using fallback data:', error.message);
    return getUserStatisticsFallback();
  }
};

/**
 * Export users to Excel
 */
export const exportUsersToExcel = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.username) queryParams.append('username', params.username);
    if (params.email) queryParams.append('email', params.email);
    if (params.role_type) queryParams.append('role_type', params.role_type);
    if (params.status) queryParams.append('status', params.status);
    if (params.email_verified !== undefined) queryParams.append('email_verified', params.email_verified);
    
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/admin/users/export/excel?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Gagal export data');
    }

    return await response.blob();
  } catch (error) {
    console.warn('Backend not available, export failed:', error.message);
    throw error;
  }
};

// Fallback data
const FALLBACK_USERS = [
  {
    user_id: 2,
    username: 'seller1',
    email: 'seller1@ecommerce.com',
    full_name: 'John Doe Seller',
    phone: '081234567890',
    profile_picture: null,
    email_verified: true,
    email_verified_at: '2025-10-17T03:30:18.000Z',
    status: 'active',
    created_at: '2025-10-17T03:30:18.000Z',
    updated_at: '2025-10-21T02:12:19.000Z',
    roles: [{ role_id: 2, role_type: 'seller' }],
    seller_profile: {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      rating_average: 4.5,
      total_reviews: 50
    }
  },
  {
    user_id: 3,
    username: 'seller2',
    email: 'seller2@ecommerce.com',
    full_name: 'Jane Smith',
    phone: '082345678901',
    profile_picture: null,
    email_verified: true,
    email_verified_at: '2025-10-18T10:15:20.000Z',
    status: 'active',
    created_at: '2025-10-18T10:15:20.000Z',
    updated_at: '2025-10-20T14:20:30.000Z',
    roles: [{ role_id: 3, role_type: 'seller' }],
    seller_profile: {
      seller_id: 2,
      store_name: 'Fashion Paradise',
      rating_average: 4.8,
      total_reviews: 120
    }
  },
  {
    user_id: 4,
    username: 'buyer1',
    email: 'buyer1@example.com',
    full_name: 'Mike Johnson',
    phone: '083456789012',
    profile_picture: null,
    email_verified: false,
    email_verified_at: null,
    status: 'active',
    created_at: '2025-10-19T08:20:00.000Z',
    updated_at: '2025-10-19T08:20:00.000Z',
    roles: [],
    seller_profile: null
  },
  {
    user_id: 5,
    username: 'suspended_user',
    email: 'suspended@example.com',
    full_name: 'Suspended Account',
    phone: '084567890123',
    profile_picture: null,
    email_verified: true,
    email_verified_at: '2025-10-15T12:00:00.000Z',
    status: 'suspended',
    created_at: '2025-10-15T12:00:00.000Z',
    updated_at: '2025-10-21T16:00:00.000Z',
    roles: [{ role_id: 5, role_type: 'seller' }],
    seller_profile: null
  },
  {
    user_id: 6,
    username: 'inactive_user',
    email: 'inactive@example.com',
    full_name: 'Inactive User',
    phone: '085678901234',
    profile_picture: null,
    email_verified: false,
    email_verified_at: null,
    status: 'inactive',
    created_at: '2025-10-10T09:00:00.000Z',
    updated_at: '2025-10-20T10:00:00.000Z',
    roles: [],
    seller_profile: null
  }
];

/**
 * Fallback: Get users from static data
 */
export const getUsersFallback = (params = {}) => {
  let filtered = [...FALLBACK_USERS];
  
  // Filter by username
  if (params.username) {
    const search = params.username.toLowerCase();
    filtered = filtered.filter(u => u.username.toLowerCase().includes(search));
  }
  
  // Filter by email
  if (params.email) {
    const search = params.email.toLowerCase();
    filtered = filtered.filter(u => u.email.toLowerCase().includes(search));
  }
  
  // Filter by full_name
  if (params.full_name) {
    const search = params.full_name.toLowerCase();
    filtered = filtered.filter(u => u.full_name?.toLowerCase().includes(search));
  }
  
  // Filter by role_type
  if (params.role_type) {
    filtered = filtered.filter(u => 
      u.roles.some(r => r.role_type === params.role_type)
    );
  }
  
  // Filter by status
  if (params.status) {
    filtered = filtered.filter(u => u.status === params.status);
  }
  
  // Filter by email_verified
  if (params.email_verified !== undefined) {
    filtered = filtered.filter(u => u.email_verified === params.email_verified);
  }
  
  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  return {
    success: true,
    message: 'Users retrieved successfully (FALLBACK MODE)',
    data: {
      users: paginatedUsers,
      pagination: {
        page: page,
        limit: limit,
        total: filtered.length,
        total_pages: Math.ceil(filtered.length / limit),
        has_next: endIndex < filtered.length,
        has_prev: page > 1
      }
    }
  };
};

/**
 * Fallback: Get user statistics
 */
export const getUserStatisticsFallback = () => {
  return {
    success: true,
    message: 'User statistics retrieved successfully (FALLBACK MODE)',
    data: {
      overview: {
        total_users: 5,
        active_users: 3,
        inactive_users: 1,
        suspended_users: 1,
        verified_emails: 3,
        unverified_emails: 2
      },
      by_role: {
        total_admins: 0,
        total_sellers: 3
      },
      recent_registrations: {
        today: 0,
        this_week: 1,
        this_month: 5
      },
      recent_users: FALLBACK_USERS.slice(0, 3)
    }
  };
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStatistics,
  exportUsersToExcel,
  getUsersFallback,
  getUserStatisticsFallback
};
