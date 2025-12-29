# Admin Product Management API Documentation

**Module:** E-Commerce  
**Base URL:** `/api/ecommerce/admin/products`  
**Authentication:** Required (Admin Only)  
**Version:** 1.0.0  
**Last Updated:** October 21, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Product Management](#product-management)
     - [Get All Products](#1-get-all-products)
     - [Get Product by ID](#2-get-product-by-id)
     - [Create Product](#3-create-product)
     - [Update Product](#4-update-product)
     - [Delete Product](#5-delete-product-soft-delete)
   - [Product Images](#product-images)
     - [Add Product Images](#6-add-product-images)
     - [Delete Product Image](#7-delete-product-image)
   - [Product Variants](#product-variants)
     - [Add Product Variants](#8-add-product-variants)
     - [Update Product Variant](#9-update-product-variant)
     - [Delete Product Variant](#10-delete-product-variant)
   - [Reports & Analytics](#reports--analytics)
     - [Get Product Statistics](#11-get-product-statistics)
     - [Export Products to Excel](#12-export-products-to-excel)
4. [Data Models](#data-models)
5. [Error Codes](#error-codes)
6. [Testing](#testing)

---

## Overview

The Admin Product Management API provides comprehensive endpoints for administrators to manage products, including variants, images, and analytics. Admins have full control over all products in the system regardless of seller.

### Key Features
- ✅ Full CRUD operations on products
- ✅ Product image management (multiple images per product)
- ✅ Product variant management (sizes, colors, etc.)
- ✅ Advanced filtering and search
- ✅ Pagination and sorting
- ✅ Product statistics and analytics
- ✅ Excel export functionality
- ✅ Soft delete for data preservation

---

## Authentication

All endpoints require admin authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <admin_jwt_token>
```

### Getting Admin Token

```http
POST /api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin123!"
}
```

---

## Endpoints

## Product Management

### 1. Get All Products

Retrieve a paginated list of all products with filtering and sorting options.

**Endpoint:** `GET /api/ecommerce/admin/products`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of items per page (max: 100) |
| `name` | string | No | - | Filter by product name (partial match) |
| `category` | integer | No | - | Filter by category ID |
| `store` | string | No | - | Filter by store name (partial match) |
| `status` | string | No | - | Filter by status: `active`, `inactive` |
| `sort_by` | string | No | created_at | Sort field: `product_id`, `name`, `price`, `stock`, `rating_average`, `created_at`, `updated_at` |
| `sort_order` | string | No | desc | Sort order: `asc`, `desc` |

**Example Requests:**

```http
# Basic - Get all products
GET /api/ecommerce/admin/products
Authorization: Bearer <token>

# With pagination
GET /api/ecommerce/admin/products?page=1&limit=20
Authorization: Bearer <token>

# Filter by name
GET /api/ecommerce/admin/products?name=laptop
Authorization: Bearer <token>

# Filter by category and status
GET /api/ecommerce/admin/products?category=1&status=active
Authorization: Bearer <token>

# Sort by price ascending
GET /api/ecommerce/admin/products?sort_by=price&sort_order=asc
Authorization: Bearer <token>

# Complex query
GET /api/ecommerce/admin/products?category=2&status=active&sort_by=rating_average&sort_order=desc&page=1&limit=15
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "product_id": 1,
        "name": "Laptop ASUS ROG Strix G15",
        "description": "Gaming laptop dengan spesifikasi tinggi",
        "price": 15000000,
        "stock": 25,
        "status": "active",
        "rating_average": 4.8,
        "total_reviews": 45,
        "total_sales": 120,
        "created_at": "2025-10-17T03:30:18.000Z",
        "updated_at": "2025-10-20T10:00:00.000Z",
        "category": {
          "category_id": 1,
          "name": "Elektronik",
          "icon": "🖥️"
        },
        "seller": {
          "seller_id": 1,
          "store_name": "Toko Elektronik Jaya",
          "rating_average": 4.5
        },
        "images": [
          {
            "image_id": 1,
            "image_url": "https://example.com/laptop1.jpg",
            "is_primary": true,
            "order_index": 1
          }
        ],
        "variants": [
          {
            "variant_id": 1,
            "variant_name": "RAM",
            "variant_value": "16GB",
            "price_adjust": 0,
            "stock_adjust": 15
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. Get Product by ID

Retrieve detailed information about a specific product.

**Endpoint:** `GET /api/ecommerce/admin/products/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Example Request:**

```http
GET /api/ecommerce/admin/products/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product_id": 1,
    "name": "Laptop ASUS ROG Strix G15",
    "description": "Gaming laptop dengan spesifikasi tinggi, Intel Core i7, RTX 3070",
    "price": 15000000,
    "stock": 25,
    "status": "active",
    "rating_average": 4.8,
    "total_reviews": 45,
    "total_sales": 120,
    "total_views": 5420,
    "created_at": "2025-10-17T03:30:18.000Z",
    "updated_at": "2025-10-20T10:00:00.000Z",
    "category": {
      "category_id": 1,
      "name": "Elektronik",
      "description": "Produk elektronik",
      "icon": "🖥️"
    },
    "seller": {
      "seller_id": 1,
      "user_id": 2,
      "store_name": "Toko Elektronik Jaya",
      "store_photo": "/uploads/stores/store1.jpg",
      "rating_average": 4.5,
      "total_products": 15
    },
    "images": [
      {
        "image_id": 1,
        "image_url": "https://example.com/laptop1.jpg",
        "is_primary": true,
        "order_index": 1
      },
      {
        "image_id": 2,
        "image_url": "https://example.com/laptop2.jpg",
        "is_primary": false,
        "order_index": 2
      }
    ],
    "variants": [
      {
        "variant_id": 1,
        "variant_name": "RAM",
        "variant_value": "16GB",
        "price_adjust": 0,
        "stock_adjust": 15
      },
      {
        "variant_id": 2,
        "variant_name": "RAM",
        "variant_value": "32GB",
        "price_adjust": 2000000,
        "stock_adjust": 10
      }
    ]
  }
}
```

**Error Responses:**

```json
// Invalid ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid product ID"
}

// Product not found (404 Not Found)
{
  "success": false,
  "error": "Product not found"
}
```

---

### 3. Create Product

Create a new product in the system.

**Endpoint:** `POST /api/ecommerce/admin/products`

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | Max 200 chars | Product name |
| `description` | string | Yes | - | Product description |
| `price` | number | Yes | > 0 | Product price in IDR |
| `stock` | integer | Yes | >= 0 | Available stock quantity |
| `category_id` | integer | Yes | Valid category | Category ID |
| `seller_id` | integer | Yes | Valid seller | Seller ID |
| `status` | string | No | `active`, `inactive` | Product status (default: `active`) |

**Example Request:**

```http
POST /api/ecommerce/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Smartphone Samsung Galaxy S24",
  "description": "Smartphone flagship dengan kamera 200MP dan prosesor Snapdragon 8 Gen 3",
  "price": 12999000,
  "stock": 50,
  "category_id": 1,
  "seller_id": 1,
  "status": "active"
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product_id": 25,
    "name": "Smartphone Samsung Galaxy S24",
    "description": "Smartphone flagship dengan kamera 200MP",
    "price": 12999000,
    "stock": 50,
    "category_id": 1,
    "seller_id": 1,
    "status": "active",
    "rating_average": 0,
    "total_reviews": 0,
    "total_sales": 0,
    "total_views": 0,
    "created_at": "2025-10-21T10:00:00.000Z",
    "updated_at": "2025-10-21T10:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// Missing required fields (400 Bad Request)
{
  "success": false,
  "error": "Product name is required"
}

// Invalid price (400 Bad Request)
{
  "success": false,
  "error": "Valid price is required"
}

// Invalid category (404 Not Found)
{
  "success": false,
  "error": "Category not found"
}

// Invalid seller (404 Not Found)
{
  "success": false,
  "error": "Seller not found"
}
```

---

### 4. Update Product

Update an existing product's information.

**Endpoint:** `PUT /api/ecommerce/admin/products/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID to update |

**Request Body (all fields optional):**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | string | Max 200 chars | Updated product name |
| `description` | string | - | Updated description |
| `price` | number | > 0 | Updated price |
| `stock` | integer | >= 0 | Updated stock quantity |
| `category_id` | integer | Valid category | Updated category |
| `status` | string | `active`, `inactive` | Updated status |

**Example Requests:**

```http
# Update multiple fields
PUT /api/ecommerce/admin/products/25
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Smartphone Samsung Galaxy S24 Ultra",
  "price": 14999000,
  "stock": 45
}

# Update stock only
PUT /api/ecommerce/admin/products/25
Authorization: Bearer <token>
Content-Type: application/json

{
  "stock": 100
}

# Deactivate product
PUT /api/ecommerce/admin/products/25
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product_id": 25,
    "name": "Smartphone Samsung Galaxy S24 Ultra",
    "description": "Smartphone flagship dengan kamera 200MP",
    "price": 14999000,
    "stock": 45,
    "category_id": 1,
    "seller_id": 1,
    "status": "active",
    "rating_average": 0,
    "total_reviews": 0,
    "total_sales": 0,
    "total_views": 0,
    "created_at": "2025-10-21T10:00:00.000Z",
    "updated_at": "2025-10-21T10:30:00.000Z"
  }
}
```

---

### 5. Delete Product (Soft Delete)

Deactivate a product (sets status to 'inactive'). This is a soft delete operation.

**Endpoint:** `DELETE /api/ecommerce/admin/products/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID to delete |

**Example Request:**

```http
DELETE /api/ecommerce/admin/products/25
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product deactivated successfully",
  "data": {
    "product_id": 25,
    "name": "Smartphone Samsung Galaxy S24 Ultra",
    "status": "inactive",
    "updated_at": "2025-10-21T11:00:00.000Z"
  }
}
```

**⚠️ Important Notes:**
- This is a soft delete - the product record remains in database
- Product status is set to 'inactive'
- Product won't appear in public listings
- All related data (images, variants, reviews) are preserved
- Can be reactivated by updating status to 'active'

---

## Product Images

### 6. Add Product Images

Add one or multiple images to a product.

**Endpoint:** `POST /api/ecommerce/admin/products/:productId/images`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | integer | Yes | Product ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | array | Yes | Array of image objects |
| `images[].image_url` | string | Yes | Image URL |
| `images[].is_primary` | boolean | No | Primary image flag (default: false) |
| `images[].order_index` | integer | No | Display order (default: auto-assigned) |

**Example Request:**

```http
POST /api/ecommerce/admin/products/25/images
Authorization: Bearer <token>
Content-Type: application/json

{
  "images": [
    {
      "image_url": "https://example.com/s24-front.jpg",
      "is_primary": true,
      "order_index": 1
    },
    {
      "image_url": "https://example.com/s24-back.jpg",
      "is_primary": false,
      "order_index": 2
    },
    {
      "image_url": "https://example.com/s24-side.jpg",
      "is_primary": false,
      "order_index": 3
    }
  ]
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Product images added successfully",
  "data": [
    {
      "image_id": 50,
      "product_id": 25,
      "image_url": "https://example.com/s24-front.jpg",
      "is_primary": true,
      "order_index": 1,
      "created_at": "2025-10-21T10:00:00.000Z"
    },
    {
      "image_id": 51,
      "product_id": 25,
      "image_url": "https://example.com/s24-back.jpg",
      "is_primary": false,
      "order_index": 2,
      "created_at": "2025-10-21T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Delete Product Image

Delete a specific product image.

**Endpoint:** `DELETE /api/ecommerce/admin/products/:productId/images/:imageId`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | integer | Yes | Product ID |
| `imageId` | integer | Yes | Image ID to delete |

**Example Request:**

```http
DELETE /api/ecommerce/admin/products/25/images/51
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product image deleted successfully"
}
```

---

## Product Variants

### 8. Add Product Variants

Add variants (e.g., size, color, RAM) to a product.

**Endpoint:** `POST /api/ecommerce/admin/products/:productId/variants`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | integer | Yes | Product ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `variants` | array | Yes | Array of variant objects |
| `variants[].variant_name` | string | Yes | Variant type (e.g., "RAM", "Color", "Size") |
| `variants[].variant_value` | string | Yes | Variant value (e.g., "16GB", "Black", "XL") |
| `variants[].price_adjust` | number | No | Price adjustment (default: 0) |
| `variants[].stock_adjust` | integer | No | Stock for this variant (default: 0) |

**Example Request:**

```http
POST /api/ecommerce/admin/products/25/variants
Authorization: Bearer <token>
Content-Type: application/json

{
  "variants": [
    {
      "variant_name": "Storage",
      "variant_value": "256GB",
      "price_adjust": 0,
      "stock_adjust": 25
    },
    {
      "variant_name": "Storage",
      "variant_value": "512GB",
      "price_adjust": 2000000,
      "stock_adjust": 20
    },
    {
      "variant_name": "Color",
      "variant_value": "Phantom Black",
      "price_adjust": 0,
      "stock_adjust": 30
    },
    {
      "variant_name": "Color",
      "variant_value": "Titanium Gray",
      "price_adjust": 500000,
      "stock_adjust": 15
    }
  ]
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Product variants added successfully",
  "data": [
    {
      "variant_id": 100,
      "product_id": 25,
      "variant_name": "Storage",
      "variant_value": "256GB",
      "price_adjust": 0,
      "stock_adjust": 25,
      "created_at": "2025-10-21T10:00:00.000Z"
    },
    {
      "variant_id": 101,
      "product_id": 25,
      "variant_name": "Storage",
      "variant_value": "512GB",
      "price_adjust": 2000000,
      "stock_adjust": 20,
      "created_at": "2025-10-21T10:00:00.000Z"
    }
  ]
}
```

---

### 9. Update Product Variant

Update an existing product variant.

**Endpoint:** `PUT /api/ecommerce/admin/products/:productId/variants/:variantId`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | integer | Yes | Product ID |
| `variantId` | integer | Yes | Variant ID to update |

**Request Body (all fields optional):**

| Field | Type | Description |
|-------|------|-------------|
| `variant_name` | string | Updated variant name |
| `variant_value` | string | Updated variant value |
| `price_adjust` | number | Updated price adjustment |
| `stock_adjust` | integer | Updated stock quantity |

**Example Request:**

```http
PUT /api/ecommerce/admin/products/25/variants/100
Authorization: Bearer <token>
Content-Type: application/json

{
  "variant_value": "256GB (Updated)",
  "stock_adjust": 30
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product variant updated successfully",
  "data": {
    "variant_id": 100,
    "product_id": 25,
    "variant_name": "Storage",
    "variant_value": "256GB (Updated)",
    "price_adjust": 0,
    "stock_adjust": 30,
    "updated_at": "2025-10-21T10:30:00.000Z"
  }
}
```

---

### 10. Delete Product Variant

Delete a specific product variant.

**Endpoint:** `DELETE /api/ecommerce/admin/products/:productId/variants/:variantId`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | integer | Yes | Product ID |
| `variantId` | integer | Yes | Variant ID to delete |

**Example Request:**

```http
DELETE /api/ecommerce/admin/products/25/variants/101
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product variant deleted successfully"
}
```

---

## Reports & Analytics

### 11. Get Product Statistics

Retrieve comprehensive statistics about products.

**Endpoint:** `GET /api/ecommerce/admin/products/statistics`

**Example Request:**

```http
GET /api/ecommerce/admin/products/statistics
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Product statistics retrieved successfully",
  "data": {
    "overview": {
      "total_products": 150,
      "active_products": 135,
      "inactive_products": 15,
      "total_value": 2500000000,
      "low_stock_products": 12,
      "out_of_stock": 3
    },
    "top_categories": [
      {
        "category_id": 1,
        "category_name": "Elektronik",
        "product_count": 45,
        "percentage": 30.0
      },
      {
        "category_id": 2,
        "category_name": "Fashion",
        "product_count": 38,
        "percentage": 25.3
      }
    ],
    "top_sellers": [
      {
        "seller_id": 1,
        "store_name": "Toko Elektronik Jaya",
        "product_count": 25,
        "total_sales": 1250000000,
        "avg_rating": 4.5
      }
    ],
    "top_rated_products": [
      {
        "product_id": 1,
        "name": "Laptop ASUS ROG Strix G15",
        "rating_average": 4.9,
        "total_reviews": 120
      }
    ],
    "best_selling_products": [
      {
        "product_id": 5,
        "name": "Smartphone iPhone 15 Pro",
        "total_sales": 450,
        "revenue": 675000000
      }
    ]
  }
}
```

---

### 12. Export Products to Excel

Export product data to an Excel file with optional filtering.

**Endpoint:** `GET /api/ecommerce/admin/products/export/excel`

**Query Parameters:** (Same as Get All Products)

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter by product name |
| `category` | integer | Filter by category ID |
| `store` | string | Filter by store name |
| `status` | string | Filter by status: `active`, `inactive` |

**Example Requests:**

```http
# Export all products
GET /api/ecommerce/admin/products/export/excel
Authorization: Bearer <token>

# Export active products only
GET /api/ecommerce/admin/products/export/excel?status=active
Authorization: Bearer <token>

# Export by category
GET /api/ecommerce/admin/products/export/excel?category=1
Authorization: Bearer <token>

# Export with multiple filters
GET /api/ecommerce/admin/products/export/excel?category=1&status=active&store=Elektronik
Authorization: Bearer <token>
```

**Success Response (200 OK):**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=products_export_<timestamp>.xlsx`

**Excel File Contains:**
- Product ID
- Product Name
- Category
- Store Name
- Price
- Stock
- Status
- Rating Average
- Total Reviews
- Total Sales
- Created At
- Updated At

---

## Data Models

### Product Object

```typescript
{
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  rating_average: number;
  total_reviews: number;
  total_sales: number;
  total_views: number;
  created_at: Date;
  updated_at: Date;
  category: Category;
  seller: Seller;
  images: ProductImage[];
  variants: ProductVariant[];
}
```

### Product Image Object

```typescript
{
  image_id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  order_index: number;
  created_at: Date;
}
```

### Product Variant Object

```typescript
{
  variant_id: number;
  product_id: number;
  variant_name: string;
  variant_value: string;
  price_adjust: number;
  stock_adjust: number;
  created_at: Date;
  updated_at: Date;
}
```

### Category Object

```typescript
{
  category_id: number;
  name: string;
  description: string | null;
  icon: string | null;
  status: "active" | "inactive";
}
```

### Seller Object

```typescript
{
  seller_id: number;
  user_id: number;
  store_name: string;
  store_photo: string | null;
  rating_average: number;
  total_products: number;
}
```

---

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (non-admin) |
| 404 | Not Found | Product, category, or seller not found |
| 500 | Internal Server Error | Server-side error |

---

## Testing

### Automated Test Script

Run the automated test suite:

```bash
node modules/ecommerce/tests/testjs/test-admin-products.js
```

### Manual Testing with REST Client

Use the provided REST file:

```
modules/ecommerce/tests/admin-products.rest
```

### Test Coverage

The test suite covers:
- ✅ Authentication and authorization
- ✅ CRUD operations for products
- ✅ Image management (add, delete)
- ✅ Variant management (add, update, delete)
- ✅ Filtering and search
- ✅ Pagination and sorting
- ✅ Product statistics
- ✅ Excel export
- ✅ Validation and error handling
- ✅ Edge cases

---

## 📱 Frontend Implementation

### ✅ Admin Product Management Page

**Location**: `src/pages/admin/KelolaProductPage.jsx`

**Route**: `/admin/kelola-product` (Protected Route - Admin only)

**API Service**: `src/services/adminProductAPI.js`

**Features Implemented**:

#### 1. **Product Listing & Statistics** ✅
- Real-time statistics cards:
  - Total products count
  - Active products count
  - Inactive products count
  - Total product value (Rupiah)
  - Low stock alert count
  - Out of stock count
- Paginated product table (10 items per page)
- Loading states with skeleton UI
- Fallback mode indicator

#### 2. **Search & Filters** ✅
- Search by product name (debounced 500ms)
- Filter by category dropdown
- Filter by store name
- Filter by status (active/inactive)
- Combined filters work together
- Auto-refetch on filter change

#### 3. **Product CRUD Operations** ✅

**Create Product**:
```jsx
// Modal form with fields:
- Product Name (required)
- Description (textarea)
- Price (number, Rupiah)
- Stock (number)
- Category ID (dropdown)
- Seller ID (dropdown)
- Status (active/inactive toggle)

// API call:
await createProduct(formData);
```

**Update Product**:
```jsx
// Pre-filled modal with existing data
// Same fields as create
await updateProduct(productId, formData);
```

**Delete Product**:
```jsx
// Confirmation modal
// Soft delete (product_status = 'deleted')
await deleteProduct(productId);
```

**View Product Details**:
```jsx
// Modal showing:
- Full product information
- Category details
- Seller/store information
- All product images
- Product variants
- Statistics (rating, reviews, sales)
```

#### 4. **Export Functionality** ✅
```jsx
// Export to Excel with current filters
const handleExport = async () => {
  const blob = await exportProductsToExcel({
    category: categoryFilter,
    store: storeFilter,
    status: statusFilter
  });
  
  // Auto download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `products_${Date.now()}.xlsx`;
  a.click();
};
```

#### 5. **UI Components** ✅
- Statistics cards with icons and color coding
- Data table with sortable columns
- Action buttons (View, Edit, Delete)
- Status badges (Active/Inactive)
- Stock level indicators (Low Stock/Out of Stock)
- Modal forms with validation
- Toast notifications for success/error
- Pagination controls

#### 6. **Integration Code Example**

```javascript
// src/services/adminProductAPI.js
import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000';
const ADMIN_PRODUCTS_URL = `${API_BASE_URL}/api/ecommerce/admin/products`;

export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  ).toString();
  
  const url = queryString ? `${ADMIN_PRODUCTS_URL}?${queryString}` : ADMIN_PRODUCTS_URL;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(), // Includes JWT token
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch products');
  }

  return {
    success: true,
    data: result.data.products,
    pagination: result.data.pagination
  };
};

// Usage in component:
const fetchProducts = async () => {
  setLoading(true);
  const params = {
    page: currentPage,
    limit: 10,
    name: searchQuery,
    category: categoryFilter,
    status: statusFilter,
    sort_by: 'created_at',
    sort_order: 'desc'
  };
  
  const result = await getProducts(params);
  setProducts(result.data);
  setPagination(result.pagination);
  setLoading(false);
};
```

#### 7. **Error Handling** ✅
- Try-catch blocks for all API calls
- User-friendly error messages
- Fallback mode when backend unavailable
- Console logging for debugging
- Toast notifications for errors

#### 8. **Fallback Mode** ✅
```javascript
// Dummy data for development without backend
const FALLBACK_PRODUCTS = [
  {
    product_id: 1,
    name: 'Laptop ASUS ROG Strix G15',
    price: 15000000,
    stock: 25,
    status: 'active',
    // ... full product data
  }
];

// Auto-switch to fallback on network error
if (error.message.includes('fetch')) {
  console.warn('⚠️ Using fallback mode');
  return useFallbackProducts(params);
}
```

---

## Best Practices

### Product Management
- Always validate product data before submission
- Use descriptive product names and detailed descriptions
- Set appropriate prices and maintain accurate stock levels
- Use high-quality images (primary image is crucial)
- Organize products with correct categories

### Image Management
- Always set one primary image per product
- Use consistent image dimensions
- Optimize images for web performance
- Provide multiple angles/views of products
- Use order_index to control display sequence

### Variant Management
- Use clear variant naming (e.g., "RAM", "Color", "Size")
- Set appropriate price adjustments for premium variants
- Maintain accurate stock for each variant
- Group related variants together

### Performance
- Use pagination for large product lists
- Implement caching for statistics
- Index frequently queried fields
- Optimize database queries

---

## Support

For issues or questions:
- Check the automated test results
- Review error responses carefully
- Consult the main project documentation
- Contact the development team

---

**Document Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Maintained by:** E-Commerce Module Team
