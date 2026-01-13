/**
 * Public Product Browse API
 * For buyers and guests to browse products
 * Base URL: /api/ecommerce/browse
 */
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce'}/browse`;

/**
 * Browse products (public access)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {number} params.category_id - Filter by category
 * @param {string} params.search - Search in name and description
 * @param {number} params.min_price - Minimum price filter
 * @param {number} params.max_price - Maximum price filter
 * @param {string} params.sort_by - Sort field (created_at, price, rating_average, total_views, name)
 * @param {string} params.sort_order - Sort direction (asc, desc)
 * @returns {Promise<Object>} Products list with pagination
 */
export const browseProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return useFallbackProducts(params);
    }

    const data = await response.json();
    
    if (!data.success) {
      return useFallbackProducts(params);
    }

    return {
      success: true,
      data: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error browsing products:', error);
    return useFallbackProducts(params);
  }
};

/**
 * Get product details (public access)
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Product details with images, variants, reviews
 */
export const getProductDetail = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch product detail' };
    }

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, error: data.error || 'Failed to fetch product detail' };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error getting product detail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get product categories (public access)
 * @returns {Promise<Object>} Categories list
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return useFallbackCategories();
    }

    const data = await response.json();
    
    if (!data.success) {
      return useFallbackCategories();
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return useFallbackCategories();
  }
};

/**
 * Report a product (public/anonymous)
 * @param {number} productId - Product ID to report
 * @param {Object} reportData - Report information
 * @param {string} reportData.name - Reporter name
 * @param {string} reportData.email - Reporter email
 * @param {string} reportData.report_type - Type of report
 * @param {string} reportData.description - Report description
 * @returns {Promise<Object>} Report submission result
 */
export const reportProduct = async (productId, reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to submit report'
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Error reporting product:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit report'
    };
  }
};

// ============ FALLBACK MODE (untuk development tanpa backend) ============

const FALLBACK_CATEGORIES = [
  {
    category_id: 1,
    name: "Elektronik",
    description: "Produk elektronik dan gadget",
    icon: "/uploads/categories/elektronik.png",
    product_count: 2
  },
  {
    category_id: 2,
    name: "Fashion",
    description: "Pakaian dan aksesoris",
    icon: "/uploads/categories/fashion.png",
    product_count: 1
  },
  {
    category_id: 3,
    name: "Makanan & Minuman",
    description: "Produk makanan dan minuman",
    icon: "/uploads/categories/food.png",
    product_count: 0
  },
  {
    category_id: 4,
    name: "Kesehatan",
    description: "Produk kesehatan dan kecantikan",
    icon: "/uploads/categories/health.png",
    product_count: 0
  },
  {
    category_id: 5,
    name: "Rumah Tangga",
    description: "Perlengkapan rumah tangga",
    icon: "/uploads/categories/home.png",
    product_count: 0
  }
];

const FALLBACK_PRODUCTS = [
  {
    product_id: 1,
    name: "Smartphone Android X1",
    description: "Smartphone dengan layar AMOLED 6.5 inch, kamera 108MP, RAM 8GB, Storage 128GB, Battery 5000mAh",
    price: 3500000,
    stock: 50,
    rating_average: 4.7,
    total_reviews: 25,
    total_views: 500,
    created_at: new Date('2025-10-17T07:30:00').toISOString(),
    category: {
      category_id: 1,
      name: "Elektronik"
    },
    seller: {
      seller_id: 1,
      store_name: "Toko Elektronik Jaya",
      seller_name: "Seller One",
      rating_average: 4.5
    },
    primary_image: "/uploads/products/phone1-1.jpg"
  },
  {
    product_id: 2,
    name: "Laptop Gaming Pro",
    description: "Laptop gaming dengan processor Intel Core i7 Gen 11, RAM 16GB, RTX 3060, SSD 512GB, layar 144Hz",
    price: 15000000,
    stock: 15,
    rating_average: 4.9,
    total_reviews: 15,
    total_views: 800,
    created_at: new Date('2025-10-17T07:35:00').toISOString(),
    category: {
      category_id: 1,
      name: "Elektronik"
    },
    seller: {
      seller_id: 1,
      store_name: "Toko Elektronik Jaya",
      seller_name: "Seller One",
      rating_average: 4.5
    },
    primary_image: "/uploads/products/laptop1-1.jpg"
  },
  {
    product_id: 3,
    name: "Kemeja Kasual Premium",
    description: "Kemeja kasual berbahan katun premium, tersedia dalam berbagai ukuran dan warna",
    price: 250000,
    stock: 100,
    rating_average: 4.6,
    total_reviews: 40,
    total_views: 650,
    created_at: new Date('2025-10-17T07:40:00').toISOString(),
    category: {
      category_id: 2,
      name: "Fashion"
    },
    seller: {
      seller_id: 2,
      store_name: "Fashion Store Indonesia",
      seller_name: "Seller Two",
      rating_average: 4.7
    },
    primary_image: "/uploads/products/shirt1-1.jpg"
  },
  {
    product_id: 4,
    name: "Sepatu Sneakers Sport",
    description: "Sepatu sneakers untuk olahraga, nyaman dan berkualitas tinggi",
    price: 450000,
    stock: 75,
    rating_average: 4.5,
    total_reviews: 30,
    total_views: 420,
    created_at: new Date('2025-10-17T07:45:00').toISOString(),
    category: {
      category_id: 2,
      name: "Fashion"
    },
    seller: {
      seller_id: 2,
      store_name: "Fashion Store Indonesia",
      seller_name: "Seller Two",
      rating_average: 4.7
    },
    primary_image: "/uploads/products/shoes1-1.jpg"
  },
  {
    product_id: 5,
    name: "Smartwatch Fitness Tracker",
    description: "Smartwatch dengan fitur fitness tracker, heart rate monitor, dan notifikasi smartphone",
    price: 1200000,
    stock: 30,
    rating_average: 4.4,
    total_reviews: 18,
    total_views: 320,
    created_at: new Date('2025-10-17T07:50:00').toISOString(),
    category: {
      category_id: 1,
      name: "Elektronik"
    },
    seller: {
      seller_id: 1,
      store_name: "Toko Elektronik Jaya",
      seller_name: "Seller One",
      rating_average: 4.5
    },
    primary_image: "/uploads/products/watch1-1.jpg"
  }
];

function useFallbackProducts(params = {}) {
  console.warn('🔄 FALLBACK MODE: Using dummy product data');
  
  let filtered = [...FALLBACK_PRODUCTS];
  
  // Category filter
  if (params.category_id) {
    filtered = filtered.filter(p => p.category.category_id === parseInt(params.category_id));
  }
  
  // Search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Price filter
  if (params.min_price) {
    filtered = filtered.filter(p => p.price >= parseInt(params.min_price));
  }
  if (params.max_price) {
    filtered = filtered.filter(p => p.price <= parseInt(params.max_price));
  }
  
  // Sorting
  if (params.sort_by) {
    const sortField = params.sort_by;
    const sortOrder = params.sort_order || 'desc';
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  }
  
  // Pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: endIndex < filtered.length,
      hasPrev: page > 1
    },
    message: 'FALLBACK MODE - Using dummy data'
  };
}

function useFallbackProductDetail(productId) {
  console.warn('🔄 FALLBACK MODE: Using dummy product detail');
  
  const product = FALLBACK_PRODUCTS.find(p => p.product_id === parseInt(productId));
  
  if (!product) {
    return {
      success: false,
      error: 'Product not found'
    };
  }
  
  // Enhanced product detail with images, variants, reviews
  const detailProduct = {
    ...product,
    images: [
      {
        image_id: 1,
        image_url: product.primary_image,
        is_primary: true,
        order_index: 1
      },
      {
        image_id: 2,
        image_url: product.primary_image.replace('-1.', '-2.'),
        is_primary: false,
        order_index: 2
      }
    ],
    variants: product.product_id === 1 ? [
      {
        variant_id: 1,
        variant_name: "Warna",
        variant_value: "Hitam",
        price_adjust: 0,
        stock_adjust: 25
      },
      {
        variant_id: 2,
        variant_name: "Warna",
        variant_value: "Putih",
        price_adjust: 0,
        stock_adjust: 25
      }
    ] : product.product_id === 3 ? [
      {
        variant_id: 3,
        variant_name: "Ukuran",
        variant_value: "M",
        price_adjust: 0,
        stock_adjust: 30
      },
      {
        variant_id: 4,
        variant_name: "Ukuran",
        variant_value: "L",
        price_adjust: 0,
        stock_adjust: 40
      },
      {
        variant_id: 5,
        variant_name: "Ukuran",
        variant_value: "XL",
        price_adjust: 50000,
        stock_adjust: 30
      }
    ] : [],
    reviews: [
      {
        review_id: 1,
        rating: 5,
        review_text: "Produk sangat bagus, sesuai dengan deskripsi. Pengiriman cepat!",
        created_at: new Date('2025-10-01T00:00:00').toISOString(),
        user: {
          username: "user1",
          full_name: "Regular User One"
        }
      }
    ],
    seller: {
      ...product.seller,
      about_store: "Toko elektronik terpercaya sejak 2015",
      total_reviews: 50,
      total_products: 25
    }
  };
  
  return {
    success: true,
    data: detailProduct,
    message: 'FALLBACK MODE - Using dummy data'
  };
}

function useFallbackCategories() {
  console.warn('🔄 FALLBACK MODE: Using dummy categories');
  
  return {
    success: true,
    data: FALLBACK_CATEGORIES,
    message: 'FALLBACK MODE - Using dummy data'
  };
}

// Helper functions untuk formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Habis', color: 'red' };
  if (stock < 10) return { label: 'Stok Terbatas', color: 'yellow' };
  return { label: 'Tersedia', color: 'green' };
};

export const getRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return { fullStars, hasHalfStar, emptyStars: 5 - fullStars - (hasHalfStar ? 1 : 0) };
};
