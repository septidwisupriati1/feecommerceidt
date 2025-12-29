// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/ecommerce';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('admin_token') || '';
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Admin Dashboard API
export const adminDashboardAPI = {
  // Get dashboard statistics
  getStatistics: async () => {
    try {
      return await apiRequest('/admin/dashboard/statistics');
    } catch (error) {
      // Return mock data if API not available
      console.warn('Using mock dashboard statistics data');
      return {
        success: true,
        data: {
          users: {
            total: 1250,
            active: 1100,
            new_this_month: 45,
            by_role: {
              admin: 5,
              seller: 450,
              buyer: 795
            }
          },
          orders: {
            total: 3420,
            pending: 125,
            processing: 89,
            completed: 3150,
            cancelled: 56,
            revenue_total: 4250000000,
            revenue_this_month: 450000000
          },
          products: {
            total: 850,
            active: 780,
            inactive: 70,
            low_stock: 25,
            out_of_stock: 8
          },
          transactions: {
            total: 3420,
            this_month: 245,
            today: 12,
            average_value: 1242424
          }
        }
      };
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      return await apiRequest(`/admin/dashboard/recent-orders?limit=${limit}`);
    } catch (error) {
      console.warn('Using mock recent orders data');
      return {
        success: true,
        data: {
          orders: [
            {
              order_id: 1,
              order_number: 'ORD-2025-001',
              customer_name: 'Budi Santoso',
              product_name: 'Laptop ASUS ROG',
              total_amount: 15000000,
              status: 'pending',
              created_at: '2025-11-10T08:30:00.000Z'
            },
            {
              order_id: 2,
              order_number: 'ORD-2025-002',
              customer_name: 'Siti Nurhaliza',
              product_name: 'iPhone 15 Pro',
              total_amount: 18500000,
              status: 'completed',
              created_at: '2025-11-10T07:15:00.000Z'
            },
            {
              order_id: 3,
              order_number: 'ORD-2025-003',
              customer_name: 'Ahmad Wijaya',
              product_name: 'Samsung Galaxy S24',
              total_amount: 12000000,
              status: 'processing',
              created_at: '2025-11-10T06:45:00.000Z'
            },
            {
              order_id: 4,
              order_number: 'ORD-2025-004',
              customer_name: 'Dewi Lestari',
              product_name: 'iPad Pro 12.9',
              total_amount: 16500000,
              status: 'completed',
              created_at: '2025-11-09T15:20:00.000Z'
            },
            {
              order_id: 5,
              order_number: 'ORD-2025-005',
              customer_name: 'Rizki Pratama',
              product_name: 'MacBook Air M2',
              total_amount: 19000000,
              status: 'completed',
              created_at: '2025-11-09T14:10:00.000Z'
            }
          ],
          total: 5
        }
      };
    }
  },

  // Get top sellers
  getTopSellers: async (limit = 5, period = 'month') => {
    try {
      return await apiRequest(`/admin/dashboard/top-sellers?limit=${limit}&period=${period}`);
    } catch (error) {
      console.warn('Using mock top sellers data');
      return {
        success: true,
        data: {
          sellers: [
            {
              seller_id: 1,
              store_name: 'Toko Elektronik Jaya',
              owner_name: 'Ahmad Suryadi',
              total_sales: 125000000,
              total_orders: 245,
              rating: 4.8,
              trend: 'up',
              growth_percentage: 15.5
            },
            {
              seller_id: 2,
              store_name: 'Fashion Store Indonesia',
              owner_name: 'Siti Nurhaliza',
              total_sales: 98000000,
              total_orders: 189,
              rating: 4.6,
              trend: 'up',
              growth_percentage: 8.2
            },
            {
              seller_id: 3,
              store_name: 'Gadget Paradise',
              owner_name: 'Budi Santoso',
              total_sales: 87500000,
              total_orders: 156,
              rating: 4.7,
              trend: 'down',
              growth_percentage: -3.1
            },
            {
              seller_id: 4,
              store_name: 'Toko Buku Online',
              owner_name: 'Dewi Lestari',
              total_sales: 75000000,
              total_orders: 203,
              rating: 4.9,
              trend: 'up',
              growth_percentage: 12.3
            },
            {
              seller_id: 5,
              store_name: 'Home Appliances Store',
              owner_name: 'Rizki Pratama',
              total_sales: 68000000,
              total_orders: 134,
              rating: 4.5,
              trend: 'stable',
              growth_percentage: 0.5
            }
          ],
          period: period,
          total: 5
        }
      };
    }
  }
};

// Admin Users API
export const adminUsersAPI = {
  // Get all users with filtering
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/users?${queryString}`);
  },

  // Get user by ID
  getUserById: async (id) => {
    return await apiRequest(`/admin/users/${id}`);
  },

  // Create user
  createUser: async (userData) => {
    return await apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Update user
  updateUser: async (id, userData) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Delete user (soft delete)
  deleteUser: async (id) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  },

  // Get user statistics
  getUserStatistics: async () => {
    return await apiRequest('/admin/users/statistics');
  },

  // Export users to Excel
  exportUsersToExcel: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/users/export/excel?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    return blob;
  }
};

// Admin Products API
export const adminProductsAPI = {
  // Get all products with filtering
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/products?${queryString}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return await apiRequest(`/admin/products/${id}`);
  },

  // Create product
  createProduct: async (productData) => {
    return await apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // Update product
  updateProduct: async (id, productData) => {
    return await apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  // Delete product (soft delete)
  deleteProduct: async (id) => {
    return await apiRequest(`/admin/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Get product statistics
  getProductStatistics: async () => {
    return await apiRequest('/admin/products/statistics');
  },

  // Export products to Excel
  exportProductsToExcel: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/products/export/excel?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    return blob;
  },

  // Add product images
  addProductImages: async (productId, images) => {
    return await apiRequest(`/admin/products/${productId}/images`, {
      method: 'POST',
      body: JSON.stringify({ images })
    });
  },

  // Delete product image
  deleteProductImage: async (productId, imageId) => {
    return await apiRequest(`/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE'
    });
  },

  // Add product variants
  addProductVariants: async (productId, variants) => {
    return await apiRequest(`/admin/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify({ variants })
    });
  },

  // Update product variant
  updateProductVariant: async (productId, variantId, variantData) => {
    return await apiRequest(`/admin/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify(variantData)
    });
  },

  // Delete product variant
  deleteProductVariant: async (productId, variantId) => {
    return await apiRequest(`/admin/products/${productId}/variants/${variantId}`, {
      method: 'DELETE'
    });
  }
};

// Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date helper
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format number helper
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};
