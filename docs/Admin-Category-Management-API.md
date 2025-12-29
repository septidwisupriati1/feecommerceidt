# Admin Category Management API

## Overview
Admin Category Management API menyediakan endpoint untuk mengelola kategori produk dalam sistem ecommerce. API ini hanya dapat diakses oleh pengguna dengan role admin.

## Base URL
```
/api/ecommerce/admin/categories
```

## Authentication
Semua endpoint memerlukan authentication dengan JWT token dan role admin.

## Endpoints

### 1. Get All Categories
**GET** `/api/ecommerce/admin/categories`

Mengambil semua kategori produk dengan fitur filtering, pagination, dan sorting.

#### Query Parameters
- `page` (number, optional): Nomor halaman (default: 1)
- `limit` (number, optional): Jumlah item per halaman (default: 10)
- `status` (string, optional): Filter berdasarkan status (active, inactive)
- `search` (string, optional): Pencarian berdasarkan nama atau deskripsi kategori
- `sort_by` (string, optional): Field untuk sorting (created_at, name, status) - default: created_at
- `sort_order` (string, optional): Urutan sorting (asc, desc) - default: desc

#### Response
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "category_id": 1,
        "name": "Elektronik",
        "description": "Produk elektronik dan gadget",
        "icon": "https://example.com/icon/electronic.png",
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "_count": {
          "products": 15
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    },
    "stats": {
      "totalCategories": 5,
      "activeCategories": 5,
      "inactiveCategories": 0
    }
  }
}
```

### 2. Get Single Category
**GET** `/api/ecommerce/admin/categories/:categoryId`

Mengambil detail kategori tertentu.

#### Path Parameters
- `categoryId` (number): ID kategori

#### Response
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category_id": 1,
    "name": "Elektronik",
    "description": "Produk elektronik dan gadget",
    "icon": "https://example.com/icon/electronic.png",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "_count": {
      "products": 15
    }
  }
}
```

### 3. Create Category
**POST** `/api/ecommerce/admin/categories`

Membuat kategori produk baru.

#### Request Body
```json
{
  "name": "Kesehatan & Kecantikan",
  "description": "Produk kesehatan dan kecantikan",
  "icon": "https://example.com/icon/health.png",
  "status": "active"
}
```

#### Validation Rules
- `name`: Required, string, min 2 chars, max 100 chars, unique
- `description`: Optional, string, max 500 chars
- `icon`: Optional, string, valid URL format
- `status`: Optional, enum (active, inactive), default: active

#### Response
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category_id": 6,
    "name": "Kesehatan & Kecantikan",
    "description": "Produk kesehatan dan kecantikan",
    "icon": "https://example.com/icon/health.png",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Category
**PUT** `/api/ecommerce/admin/categories/:categoryId`

Memperbarui kategori produk.

#### Path Parameters
- `categoryId` (number): ID kategori

#### Request Body
```json
{
  "name": "Kesehatan & Kecantikan Updated",
  "description": "Produk kesehatan, kecantikan, dan perawatan diri",
  "status": "active"
}
```

#### Validation Rules
- `name`: Optional, string, min 2 chars, max 100 chars, unique
- `description`: Optional, string, max 500 chars
- `icon`: Optional, string, valid URL format
- `status`: Optional, enum (active, inactive)

#### Response
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category_id": 6,
    "name": "Kesehatan & Kecantikan Updated",
    "description": "Produk kesehatan, kecantikan, dan perawatan diri",
    "icon": "https://example.com/icon/health.png",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Delete Category
**DELETE** `/api/ecommerce/admin/categories/:categoryId`

Menghapus kategori produk. Jika kategori memiliki produk aktif, akan dilakukan soft delete (status diubah ke inactive).

#### Path Parameters
- `categoryId` (number): ID kategori

#### Response (Hard Delete)
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

#### Response (Soft Delete)
```json
{
  "success": true,
  "message": "Category has active products, status changed to inactive instead of deletion"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Category name is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Category not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Category name already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing

### Prerequisites
1. Server berjalan di port 5000
2. Admin JWT token tersedia
3. Database ter-seed dengan data awal

### Test Data
Sistem menggunakan 5 kategori seed:
1. Elektronik
2. Fashion
3. Makanan & Minuman
4. Kesehatan
5. Rumah Tangga

### Example Test Commands

#### Get All Categories
```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/categories" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create New Category
```bash
curl -X POST "http://localhost:5000/api/ecommerce/admin/categories" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Olahraga & Outdoor",
    "description": "Produk olahraga dan aktivitas outdoor",
    "status": "active"
  }'
```

#### Update Category
```bash
curl -X PUT "http://localhost:5000/api/ecommerce/admin/categories/1" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elektronik & Gadget",
    "description": "Produk elektronik, gadget, dan aksesoris"
  }'
```

#### Delete Category
```bash
curl -X DELETE "http://localhost:5000/api/ecommerce/admin/categories/6" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json"
```