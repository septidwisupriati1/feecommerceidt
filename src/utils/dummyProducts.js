// Dummy products untuk testing frontend tanpa backend
// NOTE: This function is disabled to allow new sellers to start with empty state
// Uncomment if you need dummy data for testing
export const initializeDummyProducts = () => {
  // DISABLED: Let new sellers start with empty products
  return;
  
  /* COMMENTED OUT - Enable if needed for testing
  const existingProducts = localStorage.getItem('seller_products');
  
  // Jika sudah ada produk di localStorage, jangan override
  if (existingProducts && JSON.parse(existingProducts).length > 0) {
    return;
  }

  const dummyProducts = [
    {
      id: 1,
      product_id: 1,
      name: 'Laptop Gaming ASUS ROG',
      description: 'Laptop gaming dengan performa tinggi, RAM 16GB, SSD 512GB, RTX 3060',
      price: 15000000,
      stock: 5,
      category: 'Elektronik',
      weight: 2500,
      condition: 'new',
      status: 'active',
      images: [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23667eea" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E💻%3C/text%3E%3C/svg%3E'
      ],
      primary_image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23667eea" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E💻%3C/text%3E%3C/svg%3E',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      views: 150,
      sold: 2
    },
    {
      id: 2,
      product_id: 2,
      name: 'Smartphone Samsung Galaxy S23',
      description: 'Smartphone flagship dengan kamera 50MP, 5G ready, layar AMOLED 6.1 inch',
      price: 12500000,
      stock: 10,
      category: 'Elektronik',
      weight: 500,
      condition: 'new',
      status: 'active',
      images: [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2364b5f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E📱%3C/text%3E%3C/svg%3E'
      ],
      primary_image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2364b5f6" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      views: 230,
      sold: 5
    },
    {
      id: 3,
      product_id: 3,
      name: 'Sepatu Nike Air Max',
      description: 'Sepatu olahraga original Nike dengan teknologi Air Max, nyaman untuk running',
      price: 1500000,
      stock: 0,
      category: 'Fashion Pria',
      weight: 800,
      condition: 'new',
      status: 'active',
      images: [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ff6b6b" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E👟%3C/text%3E%3C/svg%3E'
      ],
      primary_image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ff6b6b" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E👟%3C/text%3E%3C/svg%3E',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      views: 89,
      sold: 3
    },
    {
      id: 4,
      product_id: 4,
      name: 'Tas Ransel Anti Air',
      description: 'Tas ransel dengan bahan waterproof, cocok untuk travelling dan outdoor',
      price: 350000,
      stock: 15,
      category: 'Fashion Pria',
      weight: 600,
      condition: 'new',
      status: 'active',
      images: [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%234ecdc4" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E🎒%3C/text%3E%3C/svg%3E'
      ],
      primary_image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%234ecdc4" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E🎒%3C/text%3E%3C/svg%3E',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      views: 45,
      sold: 1
    },
    {
      id: 5,
      product_id: 5,
      name: 'Headphone Sony WH-1000XM5',
      description: 'Headphone wireless dengan noise cancelling terbaik, battery life 30 jam',
      price: 4500000,
      stock: 3,
      category: 'Elektronik',
      weight: 300,
      condition: 'new',
      status: 'inactive',
      images: [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f39c12" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E🎧%3C/text%3E%3C/svg%3E'
      ],
      primary_image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f39c12" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="100" fill="white"%3E🎧%3C/text%3E%3C/svg%3E',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      views: 67,
      sold: 0
    }
  ];

  localStorage.setItem('seller_products', JSON.stringify(dummyProducts));
  console.log('✅ Dummy products initialized:', dummyProducts.length);
  */
};

// Function untuk reset dummy products
export const resetDummyProducts = () => {
  localStorage.removeItem('seller_products');
  console.log('🗑️ Dummy products cleared');
};

// Function untuk get statistics dari localStorage
export const getDummyStats = () => {
  const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
  
  return {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length
  };
};
