# Admin Product Reports API Documentation

## Overview

Admin Product Reports API menyediakan fungsi untuk mengelola laporan produk yang dikirim oleh user. Admin dapat melihat, mengupdate status, dan mengelola laporan produk dengan berbagai status: `pending`, `investigating`, `resolved`, `rejected`.

## Authentication

Semua endpoint memerlukan authentication dengan JWT token dan role admin.

## Base URL

```
/api/ecommerce/admin/reports
```

## Endpoints

### 1. Get All Product Reports

**GET** `/api/ecommerce/admin/reports`

Mengambil semua laporan produk dengan filtering dan pagination.

#### Query Parameters

- `page` (number, optional): Nomor halaman (default: 1)
- `limit` (number, optional): Jumlah item per halaman (default: 10)
- `status` (string, optional): Filter berdasarkan status (`pending`, `investigating`, `resolved`, `rejected`)
- `report_type` (string, optional): Filter berdasarkan tipe laporan
- `product_id` (number, optional): Filter berdasarkan ID produk
- `seller_id` (number, optional): Filter berdasarkan ID seller
- `date_from` (string, optional): Filter dari tanggal (YYYY-MM-DD)
- `date_to` (string, optional): Filter sampai tanggal (YYYY-MM-DD)
- `search` (string, optional): Pencarian di nama reporter/email/deskripsi/nama produk
- `sort_by` (string, optional): Field sorting (`created_at`, `updated_at`, `status`, `report_type`)
- `sort_order` (string, optional): Urutan sorting (`asc`, `desc`)

#### Response

```json
{
  "success": true,
  "message": "Product reports retrieved successfully",
  "data": [
    {
      "report_id": 1,
      "product_id": 1,
      "product_name": "Smartphone Android X1",
      "seller_name": "Seller One",
      "store_name": "Toko Elektronik Jaya",
      "product_status": "active",
      "reporter_name": "John Doe",
      "reporter_email": "john@example.com",
      "report_type": "fake_product",
      "description": "Produk ini terlihat seperti palsu",
      "evidence_image": "/uploads/reports/evidence1.jpg",
      "status": "pending",
      "admin_notes": null,
      "resolved_at": null,
      "created_at": "2025-10-20T10:00:00.000Z",
      "updated_at": "2025-10-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "total_reports": 25,
    "by_status": {
      "pending": 15,
      "investigating": 5,
      "resolved": 3,
      "rejected": 2
    },
    "by_type": {
      "fake_product": 10,
      "misleading_description": 8,
      "inappropriate_content": 4,
      "copyright_violation": 3
    },
    "recent_activity": {
      "last_7_days": 8,
      "last_30_days": 20,
      "avg_resolution_time_days": 2.5
    }
  }
}
```

### 2. Get Single Product Report

**GET** `/api/ecommerce/admin/reports/:reportId`

Mengambil detail lengkap satu laporan produk.

#### Parameters

- `reportId` (number): ID laporan

#### Response

```json
{
  "success": true,
  "message": "Product report retrieved successfully",
  "data": {
    "report_id": 1,
    "product_id": 1,
    "product_name": "Smartphone Android X1",
    "product_description": "Smartphone dengan layar AMOLED 6.5 inch...",
    "product_price": 3500000,
    "product_status": "active",
    "product_image": "/uploads/products/phone1-1.jpg",
    "seller_name": "Seller One",
    "seller_email": "seller1@ecommerce.com",
    "store_name": "Toko Elektronik Jaya",
    "reporter_name": "John Doe",
    "reporter_email": "john@example.com",
    "report_type": "fake_product",
    "description": "Produk ini terlihat seperti palsu",
    "evidence_image": "/uploads/reports/evidence1.jpg",
    "status": "pending",
    "admin_notes": null,
    "resolved_at": null,
    "created_at": "2025-10-20T10:00:00.000Z",
    "updated_at": "2025-10-20T10:00:00.000Z",
    "recent_reviews": [
      {
        "rating": 5,
        "review_text": "Produk bagus",
        "created_at": "2025-10-15T08:00:00.000Z",
        "user": {
          "username": "user1",
          "full_name": "Regular User One"
        }
      }
    ]
  }
}
```

### 3. Update Product Report Status

**PUT** `/api/ecommerce/admin/reports/:reportId`

Update status laporan produk individual.

#### Parameters

- `reportId` (number): ID laporan

#### Request Body

```json
{
  "status": "investigating",
  "admin_notes": "Sedang dalam proses investigasi produk",
  "action_taken": "Contact seller for verification"
}
```

#### Response

```json
{
  "success": true,
  "message": "Product report updated successfully",
  "data": {
    "report_id": 1,
    "status": "investigating",
    "admin_notes": "Sedang dalam proses investigasi produk",
    "resolved_at": null,
    "updated_at": "2025-10-20T11:00:00.000Z"
  }
}
```

### 4. Delete Product Report

**DELETE** `/api/ecommerce/admin/reports/:reportId`

Hapus laporan produk.

#### Parameters

- `reportId` (number): ID laporan

#### Response

```json
{
  "success": true,
  "message": "Product report deleted successfully"
}
```

### 5. Get Reports Statistics

**GET** `/api/ecommerce/admin/reports/stats`

Mendapatkan statistik laporan produk.

#### Response

```json
{
  "success": true,
  "message": "Reports statistics retrieved successfully",
  "data": {
    "total_reports": 25,
    "by_status": {
      "pending": 15,
      "investigating": 5,
      "resolved": 3,
      "rejected": 2
    },
    "by_type": {
      "fake_product": 10,
      "misleading_description": 8,
      "inappropriate_content": 4,
      "copyright_violation": 3
    },
    "recent_activity": {
      "last_7_days": 8,
      "last_30_days": 20,
      "avg_resolution_time_days": 2.5
    }
  }
}
```

### 6. Export Reports to Excel

**GET** `/api/ecommerce/admin/reports/export/csv`

Export laporan ke file Excel (.xlsx).

#### Response

File Excel akan didownload dengan nama `product-reports.xlsx` yang berisi semua laporan.

### 7. Export Reports to PDF

**GET** `/api/ecommerce/admin/reports/export/pdf`

Export laporan ke file PDF.

#### Response

File PDF akan didownload dengan nama `product-reports-YYYY-MM-DD.pdf` yang berisi summary dan detail laporan.

## Status Codes

| Status            | Meaning                            |
| ----------------- | ---------------------------------- |
| `pending`       | Laporan baru masuk, belum diproses |
| `investigating` | Sedang dalam proses investigasi    |
| `resolved`      | Laporan sudah diselesaikan         |
| `rejected`      | Laporan ditolak karena tidak valid |

## Report Types

- `inappropriate_content`: Konten tidak pantas
- `fake_product`: Produk palsu
- `misleading_description`: Deskripsi menyesatkan
- `copyright_violation`: Pelanggaran hak cipta
- `counterfeit`: Barang KW
- `spam`: Spam
- `other`: Lainnya

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Valid report ID is required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Access token required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Product report not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to retrieve product reports"
}
```

## Authentication Heder

Semua request harus menyertakan header:

```
Authorization: Bearer <jwt_token>
```
