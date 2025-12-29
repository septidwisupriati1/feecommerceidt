/**
 * Category API Service
 * Handles all category-related API calls for admin
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

// Local storage for fallback mode
let fallbackCategories = null;
let fallbackMode = false;

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all categories with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status (active, inactive)
 * @param {string} params.search - Search by name or description
 * @param {string} params.sort_by - Sort field (created_at, name, status)
 * @param {string} params.sort_order - Sort order (asc, desc)
 */
export const getAllCategories = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const response = await fetch(
      `${API_BASE_URL}/admin/categories?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    fallbackMode = false;
    // API returns: { success, message, data: { categories, pagination, stats } }
    return result.data;
  } catch (error) {
    console.error('Error fetching categories, using fallback mode:', error);
    fallbackMode = true;
    
    // Initialize fallback data if not exists
    if (!fallbackCategories) {
      const fallbackData = getFallbackCategories();
      fallbackCategories = fallbackData.categories;
    }
    
    // Apply filters to fallback data
    let filtered = [...fallbackCategories];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(search) ||
        (cat.description && cat.description.toLowerCase().includes(search))
      );
    }
    
    if (params.status) {
      filtered = filtered.filter(cat => cat.status === params.status);
    }
    
    // Calculate stats from all categories (not filtered)
    const stats = {
      totalCategories: fallbackCategories.length,
      activeCategories: fallbackCategories.filter(c => c.status === 'active').length,
      inactiveCategories: fallbackCategories.filter(c => c.status === 'inactive').length,
    };
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      categories: filtered.slice(start, end),
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total, 
        totalPages 
      },
      stats
    };
  }
};

/**
 * Get single category by ID
 * @param {number} categoryId - Category ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // API returns: { success, message, data: { category } }
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    fallbackMode = true;
  }
  
  // Fallback
  if (!fallbackCategories) {
    const fallbackData = getFallbackCategories();
    fallbackCategories = fallbackData.categories;
  }
  
  const category = fallbackCategories.find(cat => cat.category_id === categoryId);
  return category || null;
};

/**
 * Create new category
 * @param {Object} data - Category data
 * @param {string} data.name - Category name (required)
 * @param {string} data.description - Category description (optional)
 * @param {string} data.icon - Icon URL (optional)
 * @param {string} data.status - Status (active/inactive, default: active)
 */
export const createCategory = async (data) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/categories`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('Error creating category, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback: simulate successful creation
  if (!fallbackCategories) {
    const fallbackData = getFallbackCategories();
    fallbackCategories = fallbackData.categories;
  }
  
  const newCategory = {
    category_id: Date.now(),
    name: data.name,
    description: data.description || '',
    icon: data.icon || '',
    status: data.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    _count: { products: 0 }
  };
  
  fallbackCategories.unshift(newCategory);
  return newCategory;
};

/**
 * Update existing category
 * @param {number} categoryId - Category ID
 * @param {Object} data - Updated category data
 * @param {string} data.name - Category name
 * @param {string} data.description - Category description
 * @param {string} data.icon - Icon URL
 * @param {string} data.status - Status (active/inactive)
 */
export const updateCategory = async (categoryId, data) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('Error updating category, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback: update in local array
  if (!fallbackCategories) {
    const fallbackData = getFallbackCategories();
    fallbackCategories = fallbackData.categories;
  }
  
  const index = fallbackCategories.findIndex(cat => cat.category_id === categoryId);
  if (index !== -1) {
    fallbackCategories[index] = {
      ...fallbackCategories[index],
      name: data.name !== undefined ? data.name : fallbackCategories[index].name,
      description: data.description !== undefined ? data.description : fallbackCategories[index].description,
      icon: data.icon !== undefined ? data.icon : fallbackCategories[index].icon,
      status: data.status !== undefined ? data.status : fallbackCategories[index].status,
      updated_at: new Date().toISOString()
    };
    return fallbackCategories[index];
  }
  
  return {
    category_id: categoryId,
    ...data,
    updated_at: new Date().toISOString()
  };
};

/**
 * Delete category
 * @param {number} categoryId - Category ID
 */
export const deleteCategory = async (categoryId) => {
  try {
    if (!fallbackMode) {
      const response = await fetch(
        `${API_BASE_URL}/admin/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error deleting category, using fallback mode:', error);
    fallbackMode = true;
  }
  
  // Fallback: delete from local array
  if (!fallbackCategories) {
    const fallbackData = getFallbackCategories();
    fallbackCategories = fallbackData.categories;
  }
  
  const index = fallbackCategories.findIndex(cat => cat.category_id === categoryId);
  if (index !== -1) {
    // Check if has products, do soft delete
    if (fallbackCategories[index]._count?.products > 0) {
      fallbackCategories[index].status = 'inactive';
      return {
        success: true,
        message: 'Category has active products, status changed to inactive instead of deletion'
      };
    }
    // Hard delete
    fallbackCategories.splice(index, 1);
  }
  
  return {
    success: true,
    message: 'Category deleted successfully'
  };
};

/**
 * Get category statistics
 * This is extracted from the getAllCategories response
 */
export const getCategoryStats = async () => {
  try {
    const data = await getAllCategories({ limit: 1 });
    return data.stats || {
      totalCategories: 0,
      activeCategories: 0,
      inactiveCategories: 0,
    };
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return {
      totalCategories: 0,
      activeCategories: 0,
      inactiveCategories: 0,
    };
  }
};

/**
 * Fallback data when API is unavailable
 * Returns sample categories for development
 * Structure matches API response
 */
export const getFallbackCategories = () => {
  return {
    categories: [
      {
        category_id: 1,
        name: 'Elektronik',
        description: 'Produk elektronik dan gadget',
        icon: 'https://via.placeholder.com/50/4A90E2/ffffff?text=E',
        status: 'active',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        _count: { products: 15 }
      },
      {
        category_id: 2,
        name: 'Fashion',
        description: 'Pakaian, sepatu, dan aksesoris',
        icon: 'https://via.placeholder.com/50/E91E63/ffffff?text=F',
        status: 'active',
        created_at: '2024-01-02T00:00:00.000Z',
        updated_at: '2024-01-02T00:00:00.000Z',
        _count: { products: 23 }
      },
      {
        category_id: 3,
        name: 'Makanan & Minuman',
        description: 'Produk makanan dan minuman',
        icon: 'https://via.placeholder.com/50/4CAF50/ffffff?text=M',
        status: 'active',
        created_at: '2024-01-03T00:00:00.000Z',
        updated_at: '2024-01-03T00:00:00.000Z',
        _count: { products: 18 }
      },
      {
        category_id: 4,
        name: 'Kesehatan & Kecantikan',
        description: 'Produk kesehatan dan kecantikan',
        icon: 'https://via.placeholder.com/50/FF9800/ffffff?text=K',
        status: 'active',
        created_at: '2024-01-04T00:00:00.000Z',
        updated_at: '2024-01-04T00:00:00.000Z',
        _count: { products: 12 }
      },
      {
        category_id: 5,
        name: 'Rumah Tangga',
        description: 'Perlengkapan rumah tangga',
        icon: 'https://via.placeholder.com/50/9C27B0/ffffff?text=R',
        status: 'active',
        created_at: '2024-01-05T00:00:00.000Z',
        updated_at: '2024-01-05T00:00:00.000Z',
        _count: { products: 20 }
      },
      {
        category_id: 6,
        name: 'Olahraga & Outdoor',
        description: 'Produk olahraga dan aktivitas outdoor',
        icon: 'https://via.placeholder.com/50/F44336/ffffff?text=O',
        status: 'active',
        created_at: '2024-01-06T00:00:00.000Z',
        updated_at: '2024-01-06T00:00:00.000Z',
        _count: { products: 8 }
      },
      {
        category_id: 7,
        name: 'Buku & Alat Tulis',
        description: 'Buku, majalah, dan alat tulis',
        icon: 'https://via.placeholder.com/50/3F51B5/ffffff?text=B',
        status: 'active',
        created_at: '2024-01-07T00:00:00.000Z',
        updated_at: '2024-01-07T00:00:00.000Z',
        _count: { products: 14 }
      },
      {
        category_id: 8,
        name: 'Mainan & Hobi',
        description: 'Mainan anak dan hobi',
        icon: 'https://via.placeholder.com/50/00BCD4/ffffff?text=M',
        status: 'inactive',
        created_at: '2024-01-08T00:00:00.000Z',
        updated_at: '2024-01-08T00:00:00.000Z',
        _count: { products: 0 }
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 8,
      totalPages: 1,
    },
    stats: {
      totalCategories: 8,
      activeCategories: 7,
      inactiveCategories: 1,
    },
  };
};

/**
 * Helper function to format date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Helper function to get status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    active: 'Aktif',
    inactive: 'Nonaktif',
  };
  return labels[status] || status;
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
