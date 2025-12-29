# Admin Store Report Management API

## Deskripsi
Fitur ini memungkinkan Admin untuk mengelola laporan toko (seller reports) yang dibuat oleh pengguna atau guest. Admin dapat melihat, memfilter, mengupdate status, mengambil tindakan terhadap toko, dan mengekspor laporan.

## Base URL
```
http://localhost:3000/api/ecommerce/admin/store-reports
```

## Authentication
Semua endpoint memerlukan:
- **Authentication**: Bearer Token (JWT)
- **Role**: Admin

Header yang diperlukan:
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

---

## Endpoints

### 1. Get All Store Reports
**Endpoint**: `GET /api/ecommerce/admin/store-reports`

**Deskripsi**: Mendapatkan semua laporan toko dengan filter dan pagination.

**Query Parameters**:
- `page` (number, optional): Nomor halaman (default: 1)
- `limit` (number, optional): Jumlah item per halaman (default: 10)
- `seller_id` (number, optional): Filter berdasarkan ID seller
- `reporter_id` (number, optional): Filter berdasarkan ID user reporter
- `reporter_email` (string, optional): Filter berdasarkan email reporter
- `status` (string, optional): Filter berdasarkan status (pending, investigating, resolved, rejected)
- `date_from` (string, optional): Filter dari tanggal (YYYY-MM-DD)
- `date_to` (string, optional): Filter sampai tanggal (YYYY-MM-DD)
- `search` (string, optional): Pencarian di reporter name/email/reason/evidence
- `sort_by` (string, optional): Field untuk sorting (created_at, updated_at, status, resolved_at)
- `sort_order` (string, optional): Urutan sorting (asc, desc)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store reports retrieved successfully",
  "data": {
    "reports": [
      {
        "report_id": 1,
        "seller": {
          "seller_id": 1,
          "store_name": "Toko ABC",
          "store_photo": "https://...",
          "rating_average": 4.5,
          "total_reviews": 100,
          "status": "active",
          "user": {
            "user_id": 5,
            "username": "seller123",
            "email": "seller@example.com",
            "full_name": "John Seller"
          }
        },
        "reporter": {
          "user_id": 10,
          "username": "customer1",
          "full_name": "Jane Customer",
          "email": "customer@example.com",
          "profile_picture": "https://..."
        },
        "reason": "Menjual produk palsu",
        "evidence": "Bukti foto produk yang tidak sesuai deskripsi",
        "status": "pending",
        "admin_notes": null,
        "resolved_at": null,
        "created_at": "2024-10-27T10:00:00Z",
        "updated_at": "2024-10-27T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_items": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. Get Store Report Statistics
**Endpoint**: `GET /api/ecommerce/admin/store-reports/statistics`

**Deskripsi**: Mendapatkan statistik laporan toko untuk dashboard admin.

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store report statistics retrieved successfully",
  "data": {
    "total_reports": 150,
    "by_status": {
      "pending": 30,
      "investigating": 20,
      "resolved": 85,
      "rejected": 15
    },
    "reports_last_30_days": 45,
    "average_resolution_time_days": 3.5,
    "most_reported_stores": [
      {
        "seller_id": 5,
        "store_name": "Toko Bermasalah",
        "store_photo": "https://...",
        "rating_average": 2.1,
        "status": "suspended",
        "total_reports": 12
      }
    ]
  }
}
```

---

### 3. Get Store Report by ID
**Endpoint**: `GET /api/ecommerce/admin/store-reports/:id`

**Deskripsi**: Mendapatkan detail lengkap laporan toko berdasarkan ID.

**URL Parameters**:
- `id` (number, required): ID laporan

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store report retrieved successfully",
  "data": {
    "report_id": 1,
    "seller": {
      "seller_id": 1,
      "store_name": "Toko ABC",
      "store_photo": "https://...",
      "province": "Jawa Barat",
      "regency": "Bandung",
      "district": "Coblong",
      "village": "Dago",
      "postal_code": "40135",
      "full_address": "Jl. Dago No. 123",
      "about_store": "Toko elektronik terpercaya",
      "rating_average": 4.5,
      "total_reviews": 100,
      "total_products": 50,
      "total_views": 5000,
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "user": {
        "user_id": 5,
        "username": "seller123",
        "email": "seller@example.com",
        "full_name": "John Seller",
        "phone": "08123456789",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "sample_products": [
        {
          "product_id": 1,
          "name": "Laptop Gaming",
          "status": "active",
          "rating_average": 4.8
        }
      ],
      "other_reports_count": 2
    },
    "reporter": {
      "user_id": 10,
      "username": "customer1",
      "full_name": "Jane Customer",
      "email": "customer@example.com",
      "phone": "08129876543",
      "profile_picture": "https://...",
      "created_at": "2024-02-01T00:00:00Z"
    },
    "reason": "Menjual produk palsu",
    "evidence": "Bukti foto produk yang tidak sesuai deskripsi",
    "status": "investigating",
    "admin_notes": "Sedang dalam investigasi",
    "resolved_at": null,
    "created_at": "2024-10-27T10:00:00Z",
    "updated_at": "2024-10-27T11:00:00Z"
  }
}
```

---

### 4. Get Reports by Seller
**Endpoint**: `GET /api/ecommerce/admin/store-reports/seller/:sellerId`

**Deskripsi**: Mendapatkan semua laporan untuk seller tertentu.

**URL Parameters**:
- `sellerId` (number, required): ID seller

**Query Parameters**:
- `page` (number, optional): Nomor halaman (default: 1)
- `limit` (number, optional): Jumlah item per halaman (default: 10)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Seller reports retrieved successfully",
  "data": {
    "seller": {
      "seller_id": 1,
      "store_name": "Toko ABC",
      "store_photo": "https://...",
      "status": "active",
      "rating_average": 4.5
    },
    "reports": [
      {
        "report_id": 1,
        "reporter": {
          "user_id": 10,
          "username": "customer1",
          "full_name": "Jane Customer",
          "email": "customer@example.com"
        },
        "reason": "Produk tidak sesuai",
        "evidence": "Foto bukti",
        "status": "resolved",
        "admin_notes": "Sudah ditangani",
        "resolved_at": "2024-10-27T15:00:00Z",
        "created_at": "2024-10-25T10:00:00Z",
        "updated_at": "2024-10-27T15:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_items": 3,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

---

### 5. Update Store Report Status
**Endpoint**: `PATCH /api/ecommerce/admin/store-reports/:id/status`

**Deskripsi**: Mengupdate status laporan toko.

**URL Parameters**:
- `id` (number, required): ID laporan

**Request Body**:
```json
{
  "status": "investigating",
  "admin_notes": "Sedang melakukan investigasi terhadap toko ini"
}
```

**Body Parameters**:
- `status` (string, required): Status baru (pending, investigating, resolved, rejected)
- `admin_notes` (string, optional): Catatan admin

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store report status updated successfully",
  "data": {
    "report_id": 1,
    "seller": {
      "seller_id": 1,
      "store_name": "Toko ABC",
      "store_photo": "https://..."
    },
    "reporter": {
      "user_id": 10,
      "username": "customer1",
      "full_name": "Jane Customer",
      "email": "customer@example.com"
    },
    "reason": "Menjual produk palsu",
    "evidence": "Bukti foto",
    "status": "investigating",
    "admin_notes": "Sedang melakukan investigasi terhadap toko ini",
    "resolved_at": null,
    "created_at": "2024-10-27T10:00:00Z",
    "updated_at": "2024-10-27T12:00:00Z"
  }
}
```

---

### 6. Take Action on Seller
**Endpoint**: `POST /api/ecommerce/admin/store-reports/:id/action`

**Deskripsi**: Mengambil tindakan terhadap seller berdasarkan laporan.

**URL Parameters**:
- `id` (number, required): ID laporan

**Request Body**:
```json
{
  "action": "suspend_store",
  "reason": "Toko disuspend karena menjual produk palsu dan melanggar kebijakan"
}
```

**Body Parameters**:
- `action` (string, required): Tindakan yang diambil
  - `warn_seller`: Memberikan peringatan kepada seller
  - `suspend_store`: Menonaktifkan toko sementara (status = suspended)
  - `ban_seller`: Menonaktifkan toko permanen (status = inactive)
- `reason` (string, optional): Alasan tindakan

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Action taken successfully",
  "data": {
    "report_id": 1,
    "action_taken": "Store suspended",
    "seller_id": 1,
    "store_name": "Toko ABC",
    "new_status": "suspended"
  }
}
```

---

### 7. Export Store Reports to Excel
**Endpoint**: `GET /api/ecommerce/admin/store-reports/export/excel`

**Deskripsi**: Mengekspor laporan toko ke file Excel.

**Query Parameters**:
- `status` (string, optional): Filter berdasarkan status
- `date_from` (string, optional): Filter dari tanggal (YYYY-MM-DD)
- `date_to` (string, optional): Filter sampai tanggal (YYYY-MM-DD)
- `seller_id` (number, optional): Filter berdasarkan seller ID

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store reports exported to Excel successfully",
  "data": {
    "filename": "store_reports_2024-10-27T12-00-00.xlsx",
    "download_url": "/exports/store_reports_2024-10-27T12-00-00.xlsx",
    "total_records": 150
  }
}
```

---

### 8. Delete Store Report
**Endpoint**: `DELETE /api/ecommerce/admin/store-reports/:id`

**Deskripsi**: Menghapus laporan toko.

**URL Parameters**:
- `id` (number, required): ID laporan

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Store report deleted successfully",
  "data": {
    "deleted_report_id": 1
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid report ID"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Store report not found"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Admin access required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to retrieve store reports"
}
```

---

## Status Values

Laporan toko dapat memiliki status berikut:
- **pending**: Laporan baru, belum ditangani
- **investigating**: Sedang dalam proses investigasi
- **resolved**: Laporan sudah ditangani dan diselesaikan
- **rejected**: Laporan ditolak (tidak valid)

---

## Action Types

Admin dapat mengambil tindakan berikut terhadap seller:
- **warn_seller**: Memberikan peringatan (status toko tidak berubah)
- **suspend_store**: Menonaktifkan toko sementara (status = suspended)
- **ban_seller**: Menonaktifkan toko permanen (status = inactive)

---

## Database Schema

Fitur ini menggunakan tabel `seller_reports` dengan struktur:

```prisma
model seller_reports {
  report_id      Int             @id @default(autoincrement())
  seller_id      Int
  reporter_id    Int?            // Optional - null for guest reports
  reporter_name  String?         // For guest reports
  reporter_email String?         // For guest reports
  reason         String
  evidence       String?         // Optional evidence/description
  status         report_status   @default(pending)
  admin_notes    String?
  resolved_at    DateTime?
  created_at     DateTime        @default(now())
  updated_at     DateTime        @default(now())
  
  // Relations
  seller         seller_profiles @relation(...)
  reporter       users?          @relation(...)
}
```

---

## Use Cases

### 1. Dashboard Admin - Statistik Laporan
Admin dapat melihat overview laporan toko:
```
GET /api/ecommerce/admin/store-reports/statistics
```

### 2. Melihat Semua Laporan Pending
```
GET /api/ecommerce/admin/store-reports?status=pending&sort_by=created_at&sort_order=asc
```

### 3. Investigasi Laporan
```
PATCH /api/ecommerce/admin/store-reports/1/status
{
  "status": "investigating",
  "admin_notes": "Memulai investigasi, menghubungi seller untuk klarifikasi"
}
```

### 4. Suspend Toko yang Bermasalah
```
POST /api/ecommerce/admin/store-reports/1/action
{
  "action": "suspend_store",
  "reason": "Toko disuspend 7 hari karena melanggar kebijakan penjualan"
}
```

### 5. Ekspor Laporan Bulanan
```
GET /api/ecommerce/admin/store-reports/export/excel?date_from=2024-10-01&date_to=2024-10-31
```

### 6. Melihat Riwayat Laporan Toko Tertentu
```
GET /api/ecommerce/admin/store-reports/seller/5
```

---

## Notes

1. Semua endpoint memerlukan autentikasi admin
2. File Excel yang diekspor disimpan di folder `public/exports/`
3. Mengambil tindakan otomatis mengupdate status laporan menjadi "resolved"
4. Field `resolved_at` otomatis diisi saat status diubah ke "resolved"
5. Reporter bisa berupa user terdaftar atau guest (anonymous)
6. Admin notes sangat disarankan untuk audit trail
7. Statistik mencakup rata-rata waktu penyelesaian dalam hari
8. Most reported stores menampilkan 5 toko dengan laporan terbanyak

---

## Testing

Gunakan file `Admin-Store-Report.rest` untuk testing API dengan berbagai skenario.

File testing mencakup:
- Semua endpoint dengan berbagai parameter
- Test case error handling
- Contoh kombinasi filter
- Test export dan action

---

## Integration

Route sudah terintegrasi di `index.js`:
```javascript
import ecommerceAdminStoreReportRoutes from "./modules/ecommerce/routes/adminStoreReportRoutes.js";

app.use("/api/ecommerce/admin/store-reports", ecommerceAdminStoreReportRoutes);
```

---

## Maintenance

Untuk maintenance dan monitoring:
1. Monitor jumlah laporan pending yang menumpuk
2. Review average resolution time secara berkala
3. Audit tindakan admin melalui admin_notes
4. Backup file Excel export secara periodic
5. Review most reported stores untuk pattern analysis
