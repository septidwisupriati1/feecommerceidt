const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Fallback data for products
const FALLBACK_PRODUCTS = [
  {
    product_id: 1,
    name: 'Laptop ASUS ROG Strix G15',
    description: 'Gaming laptop dengan spesifikasi tinggi, Intel Core i7, RTX 3070',
    price: 15000000,
    stock: 25,
    status: 'active',
    rating_average: 4.8,
    total_reviews: 45,
    total_sales: 120,
    total_views: 5420,
    created_at: '2025-10-17T03:30:18.000Z',
    updated_at: '2025-10-20T10:00:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik',
      icon: '🖥️'
    },
    seller: {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      rating_average: 4.5
    },
    images: [
      {
        image_id: 1,
        image_url: 'https://via.placeholder.com/400x300?text=Laptop',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: [
      {
        variant_id: 1,
        variant_name: 'RAM',
        variant_value: '16GB',
        price_adjust: 0,
        stock_adjust: 15
      }
    ]
  },
  {
    product_id: 2,
    name: 'Smartphone Samsung Galaxy S24',
    description: 'Smartphone flagship dengan kamera 200MP dan prosesor Snapdragon 8 Gen 3',
    price: 12999000,
    stock: 50,
    status: 'active',
    rating_average: 4.7,
    total_reviews: 89,
    total_sales: 250,
    total_views: 8920,
    created_at: '2025-10-15T05:20:00.000Z',
    updated_at: '2025-10-19T14:30:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik',
      icon: '🖥️'
    },
    seller: {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      rating_average: 4.5
    },
    images: [
      {
        image_id: 2,
        image_url: 'https://via.placeholder.com/400x300?text=Smartphone',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: []
  },
  {
    product_id: 3,
    name: 'Baju Kaos Polo Pria Premium',
    description: 'Kaos polo berbahan katun combed berkualitas tinggi, nyaman dipakai',
    price: 150000,
    stock: 100,
    status: 'active',
    rating_average: 4.5,
    total_reviews: 120,
    total_sales: 450,
    total_views: 3200,
    created_at: '2025-10-10T08:15:00.000Z',
    updated_at: '2025-10-18T09:00:00.000Z',
    category: {
      category_id: 2,
      name: 'Fashion',
      icon: '👕'
    },
    seller: {
      seller_id: 2,
      store_name: 'Fashion Store',
      rating_average: 4.6
    },
    images: [
      {
        image_id: 3,
        image_url: 'https://via.placeholder.com/400x300?text=Polo+Shirt',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: [
      {
        variant_id: 3,
        variant_name: 'Size',
        variant_value: 'M',
        price_adjust: 0,
        stock_adjust: 40
      },
      {
        variant_id: 4,
        variant_name: 'Size',
        variant_value: 'L',
        price_adjust: 0,
        stock_adjust: 35
      },
      {
        variant_id: 5,
        variant_name: 'Color',
        variant_value: 'Black',
        price_adjust: 0,
        stock_adjust: 50
      }
    ]
  },
  {
    product_id: 4,
    name: 'Headphone Sony WH-1000XM5',
    description: 'Headphone wireless dengan noise cancelling terbaik di kelasnya',
    price: 4500000,
    stock: 15,
    status: 'active',
    rating_average: 4.9,
    total_reviews: 67,
    total_sales: 89,
    total_views: 4500,
    created_at: '2025-10-12T10:00:00.000Z',
    updated_at: '2025-10-20T11:00:00.000Z',
    category: {
      category_id: 1,
      name: 'Elektronik',
      icon: '🖥️'
    },
    seller: {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      rating_average: 4.5
    },
    images: [
      {
        image_id: 4,
        image_url: 'https://via.placeholder.com/400x300?text=Headphone',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: []
  },
  {
    product_id: 5,
    name: 'Sepatu Sneakers Nike Air Max',
    description: 'Sepatu sneakers casual dengan desain modern dan nyaman',
    price: 1200000,
    stock: 0,
    status: 'inactive',
    rating_average: 4.3,
    total_reviews: 35,
    total_sales: 78,
    total_views: 2100,
    created_at: '2025-09-28T14:30:00.000Z',
    updated_at: '2025-10-15T16:45:00.000Z',
    category: {
      category_id: 2,
      name: 'Fashion',
      icon: '👕'
    },
    seller: {
      seller_id: 2,
      store_name: 'Fashion Store',
      rating_average: 4.6
    },
    images: [
      {
        image_id: 5,
        image_url: 'https://via.placeholder.com/400x300?text=Sneakers',
        is_primary: true,
        order_index: 1
      }
    ],
    variants: [
      {
        variant_id: 6,
        variant_name: 'Size',
        variant_value: '40',
        price_adjust: 0,
        stock_adjust: 0
      },
      {
        variant_id: 7,
        variant_name: 'Size',
        variant_value: '42',
        price_adjust: 0,
        stock_adjust: 0
      }
    ]
  }
];

// Fallback statistics
const FALLBACK_STATISTICS = {
  overview: {
    total_products: 150,
    active_products: 135,
    inactive_products: 15,
    total_value: 2500000000,
    low_stock_products: 12,
    out_of_stock: 3
  },
  top_categories: [
    {
      category_id: 1,
      category_name: 'Elektronik',
      product_count: 45,
      percentage: 30.0
    },
    {
      category_id: 2,
      category_name: 'Fashion',
      product_count: 38,
      percentage: 25.3
    }
  ],
  top_sellers: [
    {
      seller_id: 1,
      store_name: 'Toko Elektronik Jaya',
      product_count: 25,
      total_sales: 1250000000,
      avg_rating: 4.5
    }
  ]
};

// Get all products with filtering
export const getProducts = async (params = {}) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.store) queryParams.append('store', params.store);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const response = await fetch(`${API_BASE_URL}/admin/products?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch products');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback product data:', error.message);
    return getProductsFallback(params);
  }
};

// Fallback function for getting products
const getProductsFallback = (params) => {
  let products = [...FALLBACK_PRODUCTS];
  
  // Apply filters
  if (params.name) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(params.name.toLowerCase())
    );
  }
  
  if (params.category) {
    products = products.filter(p => p.category.category_id === parseInt(params.category));
  }
  
  if (params.store) {
    products = products.filter(p => 
      p.seller.store_name.toLowerCase().includes(params.store.toLowerCase())
    );
  }
  
  if (params.status) {
    products = products.filter(p => p.status === params.status);
  }
  
  // Apply sorting
  if (params.sort_by) {
    products.sort((a, b) => {
      let aVal = a[params.sort_by];
      let bVal = b[params.sort_by];
      
      if (params.sort_order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  return {
    success: true,
    message: 'Products retrieved successfully (FALLBACK MODE)',
    data: {
      products: paginatedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length,
        total_pages: Math.ceil(products.length / limit),
        has_next: endIndex < products.length,
        has_prev: page > 1
      }
    }
  };
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch product');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback product detail:', error.message);
    const product = FALLBACK_PRODUCTS.find(p => p.product_id === parseInt(productId));
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return {
      success: true,
      message: 'Product retrieved successfully (FALLBACK)',
      data: product
    };
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Failed to create product');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback create product:', error.message);
    return {
      success: true,
      message: 'Product created successfully (FALLBACK)',
      data: {
        product_id: Date.now(),
        ...productData,
        rating_average: 0,
        total_reviews: 0,
        total_sales: 0,
        total_views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Failed to update product');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback update product:', error.message);
    return {
      success: true,
      message: 'Product updated successfully (FALLBACK)',
      data: {
        product_id: productId,
        ...productData,
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

// Delete product (soft delete)
export const deleteProduct = async (productId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete product');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback delete product:', error.message);
    return {
      success: true,
      message: 'Product deactivated successfully (FALLBACK)',
      data: {
        product_id: productId,
        status: 'inactive',
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

// Get product statistics
export const getProductStatistics = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch statistics');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback statistics:', error.message);
    return {
      success: true,
      message: 'Product statistics retrieved successfully (FALLBACK)',
      data: FALLBACK_STATISTICS
    };
  }
};

// Export products to Excel
export const exportProductsToExcel = async (params = {}) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.category) queryParams.append('category', params.category);
    if (params.store) queryParams.append('store', params.store);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/admin/products/export/excel?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to export products');

    return await response.blob();
  } catch (error) {
    console.warn('Export not available in fallback mode:', error.message);
    throw error;
  }
};

// Add product images
export const addProductImages = async (productId, images) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ images })
    });

    if (!response.ok) throw new Error('Failed to add images');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback add images:', error.message);
    return {
      success: true,
      message: 'Product images added successfully (FALLBACK)',
      data: images.map((img, index) => ({
        image_id: Date.now() + index,
        product_id: productId,
        ...img,
        created_at: new Date().toISOString()
      })),
      _fallback: true
    };
  }
};

// Delete product image
export const deleteProductImage = async (productId, imageId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete image');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback delete image:', error.message);
    return {
      success: true,
      message: 'Product image deleted successfully (FALLBACK)',
      _fallback: true
    };
  }
};

// Add product variants
export const addProductVariants = async (productId, variants) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ variants })
    });

    if (!response.ok) throw new Error('Failed to add variants');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback add variants:', error.message);
    return {
      success: true,
      message: 'Product variants added successfully (FALLBACK)',
      data: variants.map((variant, index) => ({
        variant_id: Date.now() + index,
        product_id: productId,
        ...variant,
        created_at: new Date().toISOString()
      })),
      _fallback: true
    };
  }
};

// Update product variant
export const updateProductVariant = async (productId, variantId, variantData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(variantData)
    });

    if (!response.ok) throw new Error('Failed to update variant');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback update variant:', error.message);
    return {
      success: true,
      message: 'Product variant updated successfully (FALLBACK)',
      data: {
        variant_id: variantId,
        product_id: productId,
        ...variantData,
        updated_at: new Date().toISOString()
      },
      _fallback: true
    };
  }
};

// Delete product variant
export const deleteProductVariant = async (productId, variantId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/variants/${variantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete variant');

    return await response.json();
  } catch (error) {
    console.warn('Using fallback delete variant:', error.message);
    return {
      success: true,
      message: 'Product variant deleted successfully (FALLBACK)',
      _fallback: true
    };
  }
};
