# 📦 E-Commerce Product Management API Documentation

## Overview
Complete API documentation for Product Management in E-Commerce platform, covering both authenticated seller operations and public browsing functionality.

## Base URLs
- **Authenticated Operations**: `http://localhost:5000/api/ecommerce/products`
- **Public Operations**: `http://localhost:5000/api/ecommerce/browse`

## Authentication
Most endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 **AUTHENTICATED ENDPOINTS** (Seller Only)

### 1. Get Product Categories
**Endpoint:** `GET /api/ecommerce/products/categories`  
**Auth Required:** ✅ (Seller)

**Description:** Get list of active product categories for sellers

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "category_id": 1,
      "name": "Elektronik",
      "description": "Produk elektronik dan gadget",
      "icon": "/uploads/categories/elektronik.png"
    }
  ]
}
```

### 2. Create Product
**Endpoint:** `POST /api/ecommerce/products`  
**Auth Required:** ✅ (Seller with verified email and store)

**⚠️ REQUIRED SHIPPING INFORMATION**: All products MUST include weight, weight_unit, and dimensions (length, width, height) for shipping purposes.

**Request Body:**
```json
{
  "name": "Smartphone Android X1",
  "description": "Latest Android smartphone with advanced features",
  "price": 2999000,
  "stock": 50,
  "category_id": 1,
  "status": "active",
  "weight": 195,
  "weight_unit": "gram",
  "length": 14.6,
  "width": 7.1,
  "height": 0.78,
  "variants": [
    {
      "name": "Color",
      "value": "Black",
      "price_adjust": 0,
      "stock_adjust": 25
    },
    {
      "name": "Color",
      "value": "White", 
      "price_adjust": 0,
      "stock_adjust": 25
    }
  ],
  "images": [
    {
      "url": "/uploads/products/phone1-1.jpg"
    },
    {
      "url": "/uploads/products/phone1-2.jpg"
    }
  ]
}
```

**Shipping Fields (REQUIRED):**
- `weight` (number, required): Product weight - must be positive number
- `weight_unit` (string, required): Weight unit - must be one of: `gram`, `kg`, `lb`, `oz`
- `length` (number, required): Length in centimeters - must be positive number
- `width` (number, required): Width in centimeters - must be positive number
- `height` (number, required): Height in centimeters - must be positive number

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product_id": 1,
    "name": "Smartphone Android X1",
    "status": "active",
    "created_at": "2025-10-17T07:30:00.000Z"
  }
}
```

### 3. Get Products (Seller's Products)
**Endpoint:** `GET /api/ecommerce/products`  
**Auth Required:** ✅ (Seller)

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page
- `status` (string): Filter by status (active/inactive)
- `category_id` (integer): Filter by category
- `search` (string): Search in name and description

**Example:** `GET /api/ecommerce/products?page=1&limit=10&status=active&search=smartphone`

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "product_id": 1,
      "name": "Smartphone Android X1",
      "description": "Latest Android smartphone...",
      "price": 2999000.00,
      "stock": 50,
      "status": "active",
      "rating_average": 4.70,
      "total_reviews": 25,
      "total_views": 500,
      "created_at": "2025-10-17T07:30:00.000Z",
      "updated_at": "2025-10-17T07:30:00.000Z",
      "category": {
        "category_id": 1,
        "name": "Elektronik"
      },
      "images": [
        {
          "image_id": 1,
          "image_url": "/uploads/products/phone1-1.jpg",
          "is_primary": true,
          "order_index": 1
        }
      ],
      "variants": [
        {
          "variant_id": 1,
          "variant_name": "Color",
          "variant_value": "Black",
          "price_adjust": 0.00,
          "stock_adjust": 25
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 4. Get Single Product Details
**Endpoint:** `GET /api/ecommerce/products/{productId}`  
**Auth Required:** ✅ (Seller - owns product)

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product_id": 1,
    "seller_id": 1,
    "name": "Smartphone Android X1",
    "description": "Latest Android smartphone...",
    "price": 2999000.00,
    "stock": 50,
    "status": "active",
    "rating_average": 4.70,
    "total_reviews": 25,
    "total_views": 500,
    "created_at": "2025-10-17T07:30:00.000Z",
    "updated_at": "2025-10-17T07:30:00.000Z",
    "category": {
      "category_id": 1,
      "name": "Elektronik",
      "description": "Produk elektronik dan gadget"
    },
    "images": [...],
    "variants": [...]
  }
}
```

### 5. Update Product
**Endpoint:** `PUT /api/ecommerce/products/{productId}`  
**Auth Required:** ✅ (Seller - owns product)

**Request Body (all fields optional):**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 3200000,
  "stock": 45,
  "category_id": 1,
  "status": "active",
  "weight": 200,
  "weight_unit": "gram",
  "length": 15.0,
  "width": 7.5,
  "height": 0.8,
  "variants": [...],
  "images": [...]
}
```

**Note**: Shipping fields (weight, weight_unit, length, width, height) can be updated independently.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product_id": 1,
    "name": "Updated Product Name",
    "status": "active",
    "updated_at": "2025-10-17T08:00:00.000Z"
  }
}
```

### 6. Delete Product
**Endpoint:** `DELETE /api/ecommerce/products/{productId}`  
**Auth Required:** ✅ (Seller - owns product)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🌐 **PUBLIC ENDPOINTS** (No Authentication)

### 7. Browse Products (Public)
**Endpoint:** `GET /api/ecommerce/browse/products`  
**Auth Required:** ❌ (Public access)

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 10): Items per page
- `category_id` (integer): Filter by category
- `search` (string): Search in name and description
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `sort_by` (string): Sort field (created_at, price, rating_average, total_views, name)
- `sort_order` (string): Sort direction (asc, desc)

**Example:** `GET /api/ecommerce/browse/products?category_id=1&min_price=1000000&max_price=5000000&sort_by=price&sort_order=asc`

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "product_id": 1,
      "name": "Smartphone Android X1",
      "description": "Latest Android smartphone...",
      "price": 3500000.00,
      "stock": 50,
      "rating_average": 4.70,
      "total_reviews": 25,
      "total_views": 500,
      "created_at": "2025-10-17T07:30:00.000Z",
      "category": {
        "category_id": 1,
        "name": "Elektronik"
      },
      "seller": {
        "seller_id": 1,
        "store_name": "Toko Elektronik Jaya",
        "seller_name": "Seller One",
        "rating_average": 4.50
      },
      "primary_image": "/uploads/products/phone1-1.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 8. Get Product Details (Public)
**Endpoint:** `GET /api/ecommerce/browse/products/{productId}`  
**Auth Required:** ❌ (Public access)

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product_id": 1,
    "name": "Smartphone Android X1",
    "description": "Smartphone dengan layar AMOLED 6.5 inch...",
    "price": 3500000.00,
    "stock": 50,
    "rating_average": 4.70,
    "total_reviews": 25,
    "total_views": 501,
    "created_at": "2025-10-17T07:30:00.000Z",
    "updated_at": "2025-10-17T07:30:00.000Z",
    "category": {
      "category_id": 1,
      "name": "Elektronik",
      "description": "Produk elektronik dan gadget"
    },
    "seller": {
      "seller_id": 1,
      "store_name": "Toko Elektronik Jaya",
      "about_store": "Toko elektronik terpercaya...",
      "rating_average": 4.50,
      "total_reviews": 50,
      "total_products": 2,
      "seller_name": "Seller One"
    },
    "images": [
      {
        "image_id": 1,
        "image_url": "/uploads/products/phone1-1.jpg",
        "is_primary": true,
        "order_index": 1
      },
      {
        "image_id": 2,
        "image_url": "/uploads/products/phone1-2.jpg",
        "is_primary": false,
        "order_index": 2
      }
    ],
    "variants": [
      {
        "variant_id": 1,
        "variant_name": "Warna",
        "variant_value": "Hitam",
        "price_adjust": 0.00,
        "stock_adjust": 25
      },
      {
        "variant_id": 2,
        "variant_name": "Warna",
        "variant_value": "Putih",
        "price_adjust": 0.00,
        "stock_adjust": 25
      }
    ],
    "reviews": [
      {
        "review_id": 1,
        "rating": 5,
        "review_text": "Produk sangat bagus, sesuai dengan deskripsi. Pengiriman cepat!",
        "created_at": "2025-10-01T00:00:00.000Z",
        "user": {
          "username": "user1",
          "full_name": "Regular User One"
        }
      }
    ]
  }
}
```

### 9. Get Categories (Public)
**Endpoint:** `GET /api/ecommerce/browse/categories`  
**Auth Required:** ❌ (Public access)

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "category_id": 1,
      "name": "Elektronik",
      "description": "Produk elektronik dan gadget",
      "icon": "/uploads/categories/elektronik.png",
      "product_count": 2
    },
    {
      "category_id": 2,
      "name": "Fashion",
      "description": "Pakaian dan aksesoris",
      "icon": "/uploads/categories/fashion.png",
      "product_count": 1
    }
  ]
}
```

### 10. Report Product (Anonymous)
**Endpoint:** `POST /api/ecommerce/browse/products/{productId}/report`  
**Auth Required:** ❌ (Anonymous reporting)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "report_type": "fake_product",
  "description": "This product appears to be counterfeit..."
}
```

**With Evidence Image (multipart/form-data):**
```
Content-Type: multipart/form-data

name=John Doe
email=john.doe@example.com
report_type=misleading_description
description=Product description is inaccurate
evidence_image=@evidence.jpg
```

**Valid Report Types:**
- `inappropriate_content` - Content violating guidelines
- `fake_product` - Fake or scam product  
- `misleading_description` - Inaccurate information
- `copyright_violation` - Unauthorized copyrighted material
- `counterfeit` - Fake branded products
- `spam` - Spam or duplicate listings
- `other` - Other violations

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product report submitted successfully. We will review your report within 24-48 hours.",
  "data": {
    "report_id": 1,
    "product_name": "Smartphone Android X1",
    "report_type": "fake_product",
    "status": "pending",
    "submitted_at": "2025-10-17T08:15:00.000Z",
    "evidence_attached": false
  }
}
```

---

## 🔒 **Authentication & Authorization**

### Required Roles:
- **Seller**: Required for all product management operations
- **Public**: No authentication needed for browsing and reporting

### Store Requirements:
- Email must be verified
- Seller profile (store) must exist
- Store is automatically created on email verification

---

## ❌ **Error Responses**

### Validation Errors (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Product name is required",
    "Valid price is required"
  ]
}
```

### Unauthorized (401 Unauthorized):
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### Forbidden (403 Forbidden):
```json
{
  "success": false,
  "error": "Only sellers can manage products"
}
```

### Not Found (404 Not Found):
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Server Error (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Failed to create product"
}
```

---

## 📝 **Business Rules**

### Product Creation:
- **Shipping information is REQUIRED**: weight, weight_unit, length, width, height
- Maximum 3 images per product
- First image becomes primary automatically
- Product name max 200 characters
- Price must be positive number
- Stock must be non-negative integer
- Weight must be positive number
- Dimensions (length, width, height) must be positive numbers
- Weight unit must be one of: gram, kg, lb, oz (default: gram)
- Dimensions are in centimeters (cm)

### Product Updates:
- Only product owner can update
- Partial updates supported (send only fields to update)
- Updating images/variants replaces all existing ones

### Public Browsing:
- Only active products shown
- View count incremented on detail view
- Results paginated (max 50 per page)

### Product Reporting:
- One report per email per product
- Evidence image max 5MB
- Supported formats: JPEG, JPG, PNG, GIF, WebP

---

## 🧪 **Test Data Available**

Based on seed data in `prisma/seed-ecommerce.js`, these test accounts and data are available:

**User Accounts:**
- **Admin**: `admin@ecommerce.com` / `Admin123!`
- **Seller 1**: `seller1@ecommerce.com` / `Seller123!` (Verified, Store: "Toko Elektronik Jaya")
- **Seller 2**: `seller2@ecommerce.com` / `Seller123!` (Verified, Store: "Fashion Store Indonesia") 
- **User 1**: `user1@ecommerce.com` / `User123!` (Verified - for reviews/testing)
- **User 2**: `user2@ecommerce.com` / `User123!` (Unverified - for error testing)

**Test Products:**
- **Product ID 1**: "Smartphone Android X1" (Seller 1, Elektronik, Price: 3.5M)
  - Variants: Warna (Hitam, Putih)
  - Images: 2 product images
  - Rating: 4.7/5, Reviews: 25, Views: 500
- **Product ID 2**: "Laptop Gaming Pro" (Seller 1, Elektronik, Price: 15M)
  - Images: 1 product image  
  - Rating: 4.9/5, Reviews: 15, Views: 800
- **Product ID 3**: "Kemeja Kasual Premium" (Seller 2, Fashion, Price: 250K)
  - Variants: Ukuran (M, L, XL with price adjust)
  - Images: 3 product images
  - Rating: 4.6/5, Reviews: 40, Views: 650

**Test Categories:**
- **Category ID 1**: "Elektronik" (2 products)
- **Category ID 2**: "Fashion" (1 product)
- **Category ID 3**: "Makanan & Minuman" (0 products)
- **Category ID 4**: "Kesehatan" (0 products)  
- **Category ID 5**: "Rumah Tangga" (0 products)

**Test Reviews:**
- User 1 → Product 1: Rating 5, "Produk sangat bagus, sesuai dengan deskripsi. Pengiriman cepat!"
- User 1 → Product 3: Rating 4, "Kualitas bagus, tapi ukurannya sedikit kekecilan."

**Price Range for Testing:**
- Min: 250,000 (Kemeja)
- Max: 15,000,000 (Laptop)
- Mid: 3,500,000 (Smartphone)

**Note**: Run `npm run seed:ecommerce` to reset database with fresh test data if needed.

---

## 📱 Frontend Implementation

### Overview
The Product Management API has three main frontend implementations:
1. **Public Product Browsing** (Buyer/Guest) - Browse and search products
2. **Seller Product Management** - Manage own products
3. **Admin Product Management** - Manage all products

---

### 1. Public Product Browsing

**Files:**
- `src/pages/ProductPage.jsx` - Product listing with filters
- `src/pages/ProductDetailPage.jsx` - Product detail view
- `src/services/productAPI.js` - Public API service

**API Service:** `productAPI.js`

```javascript
import { browseProducts, getProductDetail, getCategories } from '../services/productAPI';

// Browse products with filters
const response = await browseProducts({
  page: 1,
  limit: 12,
  category_id: 1,
  search: 'laptop',
  min_price: 1000000,
  max_price: 5000000,
  sort_by: 'price',
  sort_order: 'asc'
});

// Get product detail
const detail = await getProductDetail(productId);

// Get categories
const categories = await getCategories();
```

**ProductPage Features:**
- ✅ Search products by name/description
- ✅ Filter by category (dropdown)
- ✅ Filter by price range (min/max)
- ✅ Sort by: newest, price, rating, popularity
- ✅ Pagination (12 products per page)
- ✅ Loading states
- ✅ Product cards with:
  - Product image (with fallback)
  - Product name and category
  - Rating and review count
  - Price (formatted as Rupiah)
  - Seller name
  - Stock status badge (Habis/Stok Terbatas)
  - View count
- ✅ Responsive grid layout
- ✅ Click to view product detail
- ✅ Works with fallback data (no backend required)

**ProductPage Usage:**
```jsx
// Navigate from anywhere
navigate('/produk');

// With category filter
navigate('/produk?category=1');

// With search
navigate('/produk?search=laptop');
```

**Product Card onClick:**
```jsx
onClick={() => navigate(`/produk/${product.product_id}`)}
```

**Fallback Mode:**
The productAPI service includes dummy data for development without backend:
- 5 sample products (Elektronik & Fashion)
- 5 categories
- Full filtering and sorting work offline
- Console shows "🔄 FALLBACK MODE" message

---

### 2. Seller Product Management

**Files:**
- `src/pages/seller/ProductPage.jsx` - Seller product dashboard
- `src/services/sellerProductAPI.js` - Seller API service

**Routes:**
- `/seller/product` - Product management page

**API Service:** `sellerProductAPI.js`

```javascript
import { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories 
} from '../services/sellerProductAPI';

// Get seller's products
const response = await getProducts({
  page: 1,
  limit: 10,
  status: 'active',
  category_id: 1,
  search: 'laptop'
});

// Create new product
const newProduct = await createProduct({
  name: 'Product Name',
  description: 'Product description',
  price: 1000000,
  stock: 50,
  category_id: 1,
  status: 'active',
  weight: 500,
  weight_unit: 'gram',
  length: 20,
  width: 15,
  height: 10
});

// Update product
const updated = await updateProduct(productId, {
  price: 1200000,
  stock: 45
});

// Delete product
await deleteProduct(productId);
```

**Seller ProductPage Features:**
- ✅ View all seller's products
- ✅ Filter by status (active/inactive)
- ✅ Filter by category
- ✅ Search products
- ✅ Pagination (10 per page)
- ✅ Product statistics dashboard
- ✅ Add new product (modal/form)
- ✅ Edit product (modal/form)
- ✅ Delete product (soft delete)
- ✅ View product detail
- ✅ Product image management
- ✅ Product variant management
- ✅ Stock status indicators
- ✅ Rating and review metrics

**Product Form Fields:**
```javascript
{
  name: string,           // Required, max 200 chars
  description: string,    // Required
  price: number,          // Required, > 0
  stock: number,          // Required, >= 0
  category_id: number,    // Required, valid category
  status: 'active'|'inactive',  // Default: active
  
  // Shipping info (REQUIRED)
  weight: number,         // Required, > 0
  weight_unit: string,    // gram, kg, lb, oz
  length: number,         // Required, > 0 (cm)
  width: number,          // Required, > 0 (cm)
  height: number          // Required, > 0 (cm)
}
```

**Stock Status Helper:**
```javascript
export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Habis', color: 'red' };
  if (stock < 10) return { label: 'Stok Terbatas', color: 'yellow' };
  return { label: 'Tersedia', color: 'green' };
};
```

---

### 3. Admin Product Management

**Files:**
- `src/pages/admin/KelolaProductPage.jsx` - Admin product dashboard
- `src/services/adminProductAPI.js` - Admin API service

**Routes:**
- `/admin/kelola-product` - Admin product management

**API Service:** `adminProductAPI.js`

```javascript
import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  deleteProductImage,
  addProductVariants,
  updateProductVariant,
  deleteProductVariant,
  getProductStatistics,
  exportProductsToExcel
} from '../services/adminProductAPI';

// Get all products (any seller)
const response = await getProducts({
  page: 1,
  limit: 10,
  name: 'laptop',
  category: 1,
  store: 'Elektronik',
  status: 'active',
  sort_by: 'created_at',
  sort_order: 'desc'
});

// Add product images
await addProductImages(productId, {
  images: [
    { image_url: '/path/to/image1.jpg', is_primary: true, order_index: 1 },
    { image_url: '/path/to/image2.jpg', is_primary: false, order_index: 2 }
  ]
});

// Add product variants
await addProductVariants(productId, {
  variants: [
    { variant_name: 'Size', variant_value: 'L', price_adjust: 0, stock_adjust: 25 },
    { variant_name: 'Size', variant_value: 'XL', price_adjust: 50000, stock_adjust: 20 }
  ]
});

// Get statistics
const stats = await getProductStatistics();

// Export to Excel
await exportProductsToExcel({ status: 'active', category: 1 });
```

**Admin KelolaProductPage Features:**
- ✅ View ALL products (from all sellers)
- ✅ Advanced filtering:
  - By name (search)
  - By category
  - By store name
  - By status
- ✅ Sorting options
- ✅ Pagination
- ✅ Product statistics dashboard
- ✅ Full CRUD operations
- ✅ Image management (add/delete)
- ✅ Variant management (add/edit/delete)
- ✅ Excel export functionality
- ✅ View seller information
- ✅ Soft delete (deactivate)

**Product Statistics Response:**
```javascript
{
  overview: {
    total_products: 150,
    active_products: 135,
    inactive_products: 15,
    total_value: 2500000000,
    low_stock_products: 12,
    out_of_stock: 3
  },
  top_categories: [...],
  top_sellers: [...],
  top_rated_products: [...],
  best_selling_products: [...]
}
```

---

### Common Frontend Patterns

**1. Loading States:**
```jsx
const [loading, setLoading] = useState(false);

{loading ? (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
    <span className="ml-3">Memuat produk...</span>
  </div>
) : (
  // Product grid
)}
```

**2. Error Handling:**
```jsx
const [error, setError] = useState(null);

try {
  setLoading(true);
  setError(null);
  const response = await getProducts(params);
  if (response.success) {
    setProducts(response.data);
  } else {
    setError(response.error || 'Gagal mengambil data produk');
  }
} catch (err) {
  setError(err.message || 'Terjadi kesalahan');
} finally {
  setLoading(false);
}
```

**3. Pagination:**
```jsx
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
});

// Navigation
<Button 
  disabled={!pagination.hasPrev}
  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
>
  ← Sebelumnya
</Button>

<Button 
  disabled={!pagination.hasNext}
  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
>
  Selanjutnya →
</Button>
```

**4. Debounced Search:**
```jsx
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    if (pagination.page === 1) {
      fetchProducts();
    } else {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, 500); // 500ms debounce
  return () => clearTimeout(timer);
}, [searchQuery]);
```

**5. Currency Formatting:**
```javascript
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Usage
<span>{formatCurrency(3500000)}</span>
// Output: Rp 3.500.000
```

**6. Date Formatting:**
```javascript
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Usage
<span>{formatDate(product.created_at)}</span>
// Output: 17 Oktober 2025
```

---

### Integration Checklist

**Public Browsing (ProductPage):**
- [x] productAPI.js service created
- [x] browseProducts() integrated
- [x] getCategories() integrated
- [x] Category filter working
- [x] Price filter working
- [x] Search working (debounced)
- [x] Sorting working
- [x] Pagination working
- [x] Loading states added
- [x] Fallback mode working
- [x] Product cards clickable
- [x] Navigation to detail page
- [ ] ProductDetailPage integration (next step)

**Seller Management (Seller ProductPage):**
- [x] sellerProductAPI.js exists
- [x] Product list with filters
- [x] Add product form
- [x] Edit product form
- [x] Delete product confirmation
- [x] Image upload functionality
- [x] Category selection
- [x] Stock management
- [x] Status toggle

**Admin Management (KelolaProductPage):**
- [x] adminProductAPI.js exists
- [x] All products view (multi-seller)
- [x] Advanced filtering
- [x] Statistics dashboard
- [x] Excel export
- [x] Image management
- [x] Variant management
- [x] Product detail modal

---

### Testing Frontend

**Test ProductPage:**
1. Navigate to `/produk`
2. Verify products load (or fallback data shows)
3. Test search functionality
4. Test category filter
5. Test price filter (min/max)
6. Test sorting dropdown
7. Test pagination (if > 12 products)
8. Click product card → should navigate to `/produk/:id`

**Test Seller ProductPage:**
1. Login as seller
2. Navigate to `/seller/product`
3. Verify own products display
4. Test add product (all required fields)
5. Test edit product
6. Test delete product
7. Test filters (status, category, search)

**Test Admin KelolaProductPage:**
1. Login as admin
2. Navigate to `/admin/kelola-product`
3. Verify all products from all sellers display
4. Test filters (name, category, store, status)
5. Test statistics dashboard
6. Test Excel export
7. Test image management
8. Test variant management

---

### Known Issues & Notes

**1. Image URLs:**
- Backend returns relative paths: `/uploads/products/image.jpg`
- Frontend needs to prepend `http://localhost:5000` for development
- In production, use environment variable for API base URL

**2. Shipping Information:**
- REQUIRED when creating products (seller/admin)
- weight, weight_unit, length, width, height
- Validates: weight > 0, dimensions > 0
- Used for shipping cost calculation (future feature)

**3. Fallback Mode:**
- All API services support offline development
- Shows console warning: "🔄 FALLBACK MODE"
- Dummy data mimics real API structure
- Switch to real API by starting backend server

**4. Stock Locking:**
- Products can have 0 stock (out of stock)
- Stock decrements on order creation
- Stock restores on order cancellation
- Admin/Seller can manually update stock

**5. Product Status:**
- `active`: Visible to public, searchable
- `inactive`: Hidden from public, not searchable
- Soft delete changes status to `inactive`
- Can reactivate by changing status back to `active`

---

### Next Steps

**Planned Features:**
- [ ] ProductDetailPage API integration
- [ ] Product reviews and ratings
- [ ] Add to cart functionality
- [ ] Product comparison
- [ ] Wishlist/favorites
- [ ] Product recommendations
- [ ] Advanced search filters
- [ ] Product image gallery/zoom
- [ ] Share product functionality
- [ ] Print product details

**Backend Dependencies:**
- [ ] Image upload endpoint
- [ ] Shipping cost calculation API
- [ ] Review system API
- [ ] Cart API integration
- [ ] Order API integration

---