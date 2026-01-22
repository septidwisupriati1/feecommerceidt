/**
 * Seller Product Management API
 * Endpoints untuk seller mengelola produk
 * Base URL: /api/ecommerce/products
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Get seller's products with filters and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status: active, inactive
 * @param {number} params.category_id - Filter by category ID
 * @param {string} params.search - Search in name and description
 * @returns {Promise<Object>} Products list with pagination
 */
export const getProducts = async (params = {}) => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengambil daftar produk');
    }

    return data;
  } catch (error) {
    console.warn('Backend tidak tersedia, menggunakan fallback data:', error.message);
    return getFallbackProducts(params);
  }
};

/**
 * Get product categories
 * @returns {Promise<Object>} Categories list
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengambil kategori');
    }

    return data;
  } catch (error) {
    console.warn('Backend tidak tersedia, menggunakan fallback categories:', error.message);
    return getFallbackCategories();
  }
};

/**
 * Get single product details
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product detail
 */
export const getProductDetail = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengambil detail produk');
    }

    return data;
  } catch (error) {
    console.warn('Backend tidak tersedia, menggunakan fallback data:', error.message);
    return getFallbackProductDetail(productId);
  }
};

/**
 * Create new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    
    const isFormData = typeof FormData !== 'undefined' && productData instanceof FormData;

    const headers = isFormData
      ? { 'Authorization': `Bearer ${token}` }
      : {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers,
      body: isFormData ? productData : JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal membuat produk');
    }

    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Upload product images (multipart/form-data)
 * @param {File[]} filesArray - Array of File objects
 * @returns {Promise<Object>} Upload response containing image URLs
 */
export const uploadProductImages = async (filesArray = []) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.');

    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append('product_images', file);
    });

    const response = await fetch(`${API_BASE_URL}/products/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengupload gambar produk');
    }

    return data;
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
};

/**
 * Update product
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal mengupdate produk');
    }

    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Gagal menghapus produk');
    }

    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ============================================
// FALLBACK DATA (for development/offline mode)
// ============================================

const FALLBACK_CATEGORIES = [
  {
    category_id: 1,
    name: 'Elektronik',
    description: 'Produk elektronik dan gadget',
    icon: '/uploads/categories/elektronik.png'
  },
  {
    category_id: 2,
    name: 'Fashion',
    description: 'Pakaian dan aksesoris',
    icon: '/uploads/categories/fashion.png'
  },
  {
    category_id: 3,
    name: 'Makanan & Minuman',
    description: 'Produk makanan dan minuman',
    icon: '/uploads/categories/food.png'
  },
  {
    category_id: 4,
    name: 'Kesehatan',
    description: 'Produk kesehatan dan kecantikan',
    icon: '/uploads/categories/health.png'
  },
  {
    category_id: 5,
    name: 'Rumah Tangga',
    description: 'Perlengkapan rumah tangga',
    icon: '/uploads/categories/home.png'
  }
];

const FALLBACK_PRODUCTS = [
  {
    product_id: 1,
    name: 'Smartphone Android X1',
    description: 'Smartphone dengan layar AMOLED 6.5 inch, kamera 108MP, RAM 8GB, storage 256GB',
    price: 3500000,
    stock: 50,
    status: 'active',
    rating_average: 4.7,
    total_reviews: 25,
    total_views: 500,
    weight: 195,
    weight_unit: 'gram',
    length: 14.6,
    width: 7.1,
    height: 0.78,
    created_at: '2025-10-17T07:30:00.000Z',
    updated_at: '2025-10-17T07:30:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik'
    },
    images: [
      {
        image_id: 1,
        image_url: 'http://localhost:5000/uploads/products/phone1-1.jpg',
        is_primary: true,
        order_index: 1
      },
      {
        image_id: 2,
        image_url: 'http://localhost:5000/uploads/products/phone1-2.jpg',
        is_primary: false,
        order_index: 2
      }
    ],
    variants: [
      {
        variant_id: 1,
        variant_name: 'Warna',
        variant_value: 'Hitam',
        price_adjust: 0,
        stock_adjust: 25
      },
      {
        variant_id: 2,
        variant_name: 'Warna',
        variant_value: 'Putih',
        price_adjust: 0,
        stock_adjust: 25
      }
    ]
  },
  {
    product_id: 2,
    name: 'Laptop Gaming Pro',
    description: 'Laptop gaming dengan processor Intel Core i7 Gen 12, RTX 3060, RAM 16GB DDR5, SSD 512GB NVMe',
    price: 15000000,
    stock: 12,
    status: 'active',
    rating_average: 4.9,
    total_reviews: 15,
    total_views: 800,
    weight: 2300,
    weight_unit: 'gram',
    length: 36.0,
    width: 25.4,
    height: 2.3,
    created_at: '2025-09-15T10:00:00.000Z',
    updated_at: '2025-10-01T15:20:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik'
    },
    images: [
      {
        image_id: 3,
        image_url: 'http://localhost:5000/uploads/products/laptop1.jpg',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: []
  },
  {
    product_id: 3,
    name: 'Kemeja Kasual Premium',
    description: 'Kemeja katun premium dengan desain modern, cocok untuk acara formal maupun kasual',
    price: 250000,
    stock: 35,
    status: 'active',
    rating_average: 4.6,
    total_reviews: 40,
    total_views: 650,
    weight: 300,
    weight_unit: 'gram',
    length: 30.0,
    width: 25.0,
    height: 2.0,
    created_at: '2025-08-20T08:00:00.000Z',
    updated_at: '2025-09-10T12:30:00.000Z',
    category: {
      category_id: 2,
      name: 'Fashion'
    },
    images: [
      {
        image_id: 4,
        image_url: 'http://localhost:5000/uploads/products/shirt1-1.jpg',
        is_primary: true,
        order_index: 1
      },
      {
        image_id: 5,
        image_url: 'http://localhost:5000/uploads/products/shirt1-2.jpg',
        is_primary: false,
        order_index: 2
      },
      {
        image_id: 6,
        image_url: 'http://localhost:5000/uploads/products/shirt1-3.jpg',
        is_primary: false,
        order_index: 3
      }
    ],
    variants: [
      {
        variant_id: 3,
        variant_name: 'Ukuran',
        variant_value: 'M',
        price_adjust: 0,
        stock_adjust: 10
      },
      {
        variant_id: 4,
        variant_name: 'Ukuran',
        variant_value: 'L',
        price_adjust: 15000,
        stock_adjust: 15
      },
      {
        variant_id: 5,
        variant_name: 'Ukuran',
        variant_value: 'XL',
        price_adjust: 25000,
        stock_adjust: 10
      }
    ]
  },
  {
    product_id: 4,
    name: 'Tas Ransel Anti Air',
    description: 'Tas ransel dengan material waterproof, banyak kompartemen, cocok untuk laptop 15 inch',
    price: 350000,
    stock: 20,
    status: 'active',
    rating_average: 4.5,
    total_reviews: 18,
    total_views: 320,
    weight: 650,
    weight_unit: 'gram',
    length: 45.0,
    width: 30.0,
    height: 15.0,
    created_at: '2025-07-10T14:00:00.000Z',
    updated_at: '2025-08-05T09:15:00.000Z',
    category: {
      category_id: 2,
      name: 'Fashion'
    },
    images: [
      {
        image_id: 7,
        image_url: 'http://localhost:5000/uploads/products/backpack1.jpg',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: [
      {
        variant_id: 6,
        variant_name: 'Warna',
        variant_value: 'Hitam',
        price_adjust: 0,
        stock_adjust: 10
      },
      {
        variant_id: 7,
        variant_name: 'Warna',
        variant_value: 'Navy',
        price_adjust: 0,
        stock_adjust: 10
      }
    ]
  },
  {
    product_id: 5,
    name: 'Headphone Wireless Premium',
    description: 'Headphone wireless dengan noise cancellation, battery life 30 jam, kualitas audio tinggi',
    price: 850000,
    stock: 0,
    status: 'inactive',
    rating_average: 4.8,
    total_reviews: 32,
    total_views: 580,
    weight: 250,
    weight_unit: 'gram',
    length: 20.0,
    width: 18.0,
    height: 8.0,
    created_at: '2025-06-15T11:00:00.000Z',
    updated_at: '2025-10-15T16:00:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik'
    },
    images: [
      {
        image_id: 8,
        image_url: 'http://localhost:5000/uploads/products/headphone1.jpg',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: []
  }
];

/**
 * Get fallback products (offline mode)
 */
const getFallbackProducts = (params = {}) => {
  let filteredProducts = [...FALLBACK_PRODUCTS];

  // Filter by status
  if (params.status) {
    filteredProducts = filteredProducts.filter(p => p.status === params.status);
  }

  // Filter by category
  if (params.category_id) {
    const categoryId = parseInt(params.category_id);
    filteredProducts = filteredProducts.filter(p => p.category.category_id === categoryId);
  }

  // Search by name and description
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort by created_at descending (newest first)
  filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    success: true,
    message: 'Products retrieved successfully (fallback)',
    data: paginatedProducts,
    pagination: {
      page: page,
      limit: limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  };
};

/**
 * Get fallback categories
 */
const getFallbackCategories = () => {
  return {
    success: true,
    message: 'Categories retrieved successfully (fallback)',
    data: FALLBACK_CATEGORIES
  };
};

/**
 * Get fallback product detail
 */
const getFallbackProductDetail = (productId) => {
  const product = FALLBACK_PRODUCTS.find(p => p.product_id === parseInt(productId));

  if (!product) {
    return {
      success: false,
      error: 'Produk tidak ditemukan'
    };
  }

  return {
    success: true,
    message: 'Product retrieved successfully (fallback)',
    data: product
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format currency to IDR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get product status label
 */
export const getProductStatusLabel = (status) => {
  const labels = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    draft: 'Draft'
  };
  return labels[status] || status;
};

/**
 * Get product status color
 */
export const getProductStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get stock status
 */
export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Habis', color: 'text-red-600' };
  if (stock < 10) return { label: 'Stok Menipis', color: 'text-orange-600' };
  return { label: 'Tersedia', color: 'text-green-600' };
};

/**
 * Calculate product statistics
 */
export const getProductStats = (products) => {
  return {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length
  };
};

export default {
  getProducts,
  getCategories,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  formatCurrency,
  formatDate,
  getProductStatusLabel,
  getProductStatusColor,
  getStockStatus,
  getProductStats
};
