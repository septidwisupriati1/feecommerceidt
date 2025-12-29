# API Transaksi Pembeli - Dokumentasi Lengkap

## 📋 Daftar Isi
- [Ringkasan](#ringkasan)
- [Endpoint Tersedia](#endpoint-tersedia)
- [Field Tracking & Informasi Tambahan](#field-tracking--informasi-tambahan)
- [Contoh Response](#contoh-response)
- [Query Parameters & Filtering](#query-parameters--filtering)
- [Security & Authorization](#security--authorization)
- [Tracking URL External (per Kurir)](#tracking-url-external-per-kurir)
- [Status Order & Edge Cases](#status-order--edge-cases)

---

## Ringkasan

API ini menyediakan fitur lengkap untuk **PEMBELI** (buyer) untuk melihat histori transaksi, detail lengkap pesanan, dan informasi tracking pengiriman termasuk link tracking eksternal ke website kurir.

**Base URL**: `/api/ecommerce/buyer/transactions`

**Authentication**: Required (JWT Token)

**Role**: Hanya user dengan role `buyer`

---

## Endpoint Tersedia

### 1. GET `/api/ecommerce/buyer/transactions`
**Deskripsi**: Melihat daftar histori transaksi dengan filtering, sorting, dan pagination

**Query Parameters**:
| Parameter | Type | Default | Deskripsi | Validasi |
|-----------|------|---------|-----------|----------|
| `status` | string | - | Filter berdasarkan order_status | Harus salah satu: `pending`, `paid`, `processing`, `shipped`, `delivered`, `completed`, `cancelled` |
| `payment_status` | string | - | Filter berdasarkan payment_status | Harus salah satu: `unpaid`, `paid`, `refunded` |
| `search` | string | - | Pencarian berdasarkan order_number atau product_name | - |
| `date_from` | date | - | Filter dari tanggal | Format: YYYY-MM-DD |
| `date_to` | date | - | Filter sampai tanggal | Format: YYYY-MM-DD |
| `page` | number | 1 | Halaman ke-n | Minimal: 1 |
| `limit` | number | 10 | Jumlah data per halaman | Minimal: 1, Maksimal: 100 |
| `sort_by` | string | created_at | Field untuk sorting | Harus salah satu: `created_at`, `total_amount`, `order_status`, `payment_status` |
| `sort_order` | string | desc | Urutan sorting | Harus salah satu: `asc`, `desc` |

**Response**: List transaksi dengan pagination + summary

---

### 2. GET `/api/ecommerce/buyer/transactions/:transactionId`
**Deskripsi**: Melihat detail lengkap transaksi termasuk tracking info, seller info, payment info, shipping address

**Path Parameters**:
- `transactionId` (number): ID transaksi/order

**Response**: Detail lengkap transaksi + tracking + timeline

---

### 3. GET `/api/ecommerce/buyer/transactions/:transactionId/tracking`
**Deskripsi**: Quick check tracking info (untuk widget/UI tracking)

**Path Parameters**:
- `transactionId` (number): ID transaksi/order

**Response**: Tracking information only (lighter response)

---

### 4. GET `/api/ecommerce/buyer/transactions/summary`
**Deskripsi**: Statistik/summary transaksi pembeli (total orders, total spent, breakdown by status)

**Response**: Summary counts dan total pengeluaran

---

## Field Tracking & Informasi Tambahan

### Field Tracking di Database (tabel `orders`)

| Field | Type | Nullable | Deskripsi |
|-------|------|----------|-----------|
| `tracking_number` | VARCHAR(100) | YES | Nomor resi pengiriman (diisi oleh seller) |
| `shipping_courier` | VARCHAR(50) | YES | Nama kurir: JNE, J&T, SiCepat, Pos Indonesia, Anteraja, dll |
| `tracking_url` | TEXT | YES | Link tracking eksternal ke website kurir |
| `estimated_delivery` | DATETIME | YES | Estimasi waktu sampai (opsional, dari seller) |

### Field Tambahan yang Dikembalikan API

- `tracking.tracking_status`: Status tracking dalam bahasa user-friendly
- `tracking.tracking_instructions`: Instruksi untuk buyer
- `tracking.is_tracking_available`: Boolean flag apakah nomor resi sudah tersedia
- `progress`: Object berisi percentage & label untuk progress bar UI
- `available_actions`: Array aksi yang bisa dilakukan buyer (cancel, track, review, dll)

---

## Contoh Response

### GET `/api/ecommerce/buyer/transactions` (List)

```json
{
  "success": true,
  "message": "Data transaksi berhasil diambil",
  "data": {
    "transactions": [
      {
        "order_id": 123,
        "order_number": "ORD-20251112-00123",
        "order_status": "shipped",
        "payment_status": "paid",
        "payment_method": "manual_transfer",
        "seller": {
          "seller_id": 5,
          "store_name": "Toko Elektronik ABC",
          "store_photo": "https://example.com/store.jpg",
          "rating": 4.8
        },
        "subtotal": 500000,
        "shipping_cost": 25000,
        "total_amount": 525000,
        "total_items": 2,
        "total_quantity": 3,
        "items": [
          {
            "order_item_id": 456,
            "product_name": "Mouse Gaming RGB",
            "product_image": "https://example.com/mouse.jpg",
            "variant": "Warna: Hitam",
            "price": 250000,
            "quantity": 2,
            "subtotal": 500000
          }
        ],
        "tracking": {
          "tracking_number": "JNE123456789012",
          "shipping_courier": "JNE",
          "tracking_url": "https://www.jne.co.id/en/tracking/trace?awb=JNE123456789012",
          "estimated_delivery": "2025-11-15T17:00:00.000Z"
        },
        "created_at": "2025-11-10T10:30:00.000Z",
        "paid_at": "2025-11-10T11:00:00.000Z",
        "confirmed_at": "2025-11-10T12:00:00.000Z",
        "shipped_at": "2025-11-11T09:00:00.000Z",
        "delivered_at": null,
        "completed_at": null,
        "cancelled_at": null,
        "progress": {
          "percentage": 75,
          "label": "Dalam Pengiriman"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "total_pages": 3
    },
    "summary": {
      "total_transactions": 25,
      "total_spent": 12500000
    }
  }
}
```

### GET `/api/ecommerce/buyer/transactions/:transactionId` (Detail)

```json
{
  "success": true,
  "message": "Detail transaksi berhasil diambil",
  "data": {
    "order_id": 123,
    "order_number": "ORD-20251112-00123",
    "order_status": "shipped",
    "payment_status": "paid",
    "payment_method": "manual_transfer",
    
    "seller": {
      "seller_id": 5,
      "store_name": "Toko Elektronik ABC",
      "store_photo": "https://example.com/store.jpg",
      "store_address": "Kec. Kebayoran Baru, Jakarta Selatan, DKI Jakarta",
      "rating": 4.8,
      "total_reviews": 156,
      "contact": {
        "email": "seller@example.com",
        "phone": "081234567890"
      }
    },
    
    "pricing": {
      "subtotal": 500000,
      "shipping_cost": 25000,
      "total_amount": 525000,
      "breakdown": [
        {
          "product_name": "Mouse Gaming RGB",
          "price": 250000,
          "quantity": 2,
          "subtotal": 500000
        }
      ]
    },
    
    "payment": {
      "method": "manual_transfer",
      "status": "paid",
      "proof_url": "https://example.com/payment-proof.jpg",
      "paid_at": "2025-11-10T11:00:00.000Z",
      "bank_account": {
        "bank_name": "BCA",
        "account_number": "1234567890",
        "account_name": "PT Toko Elektronik ABC",
        "account_type": "bank"
      }
    },
    
    "shipping_address": {
      "recipient_name": "John Doe",
      "recipient_phone": "081298765432",
      "full_address": "Jl. Sudirman No. 123",
      "village": "Senayan",
      "district": "Kebayoran Baru",
      "regency": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "postal_code": "12190",
      "formatted_address": "Jl. Sudirman No. 123, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190"
    },
    
    "tracking": {
      "tracking_number": "JNE123456789012",
      "shipping_courier": "JNE",
      "tracking_url": "https://www.jne.co.id/en/tracking/trace?awb=JNE123456789012",
      "estimated_delivery": "2025-11-15T17:00:00.000Z",
      "status": "shipped",
      "tracking_instructions": "Lacak paket Anda dengan nomor resi: JNE123456789012",
      "tracking_status": "Paket sedang dalam perjalanan (JNE)"
    },
    
    "items": [
      {
        "order_item_id": 456,
        "product_id": 789,
        "product_name": "Mouse Gaming RGB",
        "product_image": "https://example.com/mouse.jpg",
        "variant": {
          "name": "Warna",
          "value": "Hitam",
          "display": "Warna: Hitam"
        },
        "price": 250000,
        "quantity": 2,
        "subtotal": 500000
      }
    ],
    
    "notes": {
      "buyer_notes": "Tolong kirim bubble wrap ekstra",
      "seller_notes": "Sudah dikemas dengan aman",
      "cancel_reason": null
    },
    
    "timeline": {
      "created_at": "2025-11-10T10:30:00.000Z",
      "paid_at": "2025-11-10T11:00:00.000Z",
      "confirmed_at": "2025-11-10T12:00:00.000Z",
      "shipped_at": "2025-11-11T09:00:00.000Z",
      "delivered_at": null,
      "completed_at": null,
      "cancelled_at": null
    },
    
    "progress": {
      "percentage": 75,
      "label": "Dalam Pengiriman"
    },
    
    "available_actions": [
      {
        "action": "track_shipment",
        "label": "Lacak Pengiriman",
        "enabled": true,
        "url": "https://www.jne.co.id/en/tracking/trace?awb=JNE123456789012"
      },
      {
        "action": "contact_seller",
        "label": "Hubungi Seller",
        "enabled": true
      }
    ]
  }
}
```

### GET `/api/ecommerce/buyer/transactions/:transactionId/tracking` (Tracking Only)

```json
{
  "success": true,
  "message": "Info tracking berhasil diambil",
  "data": {
    "order_id": 123,
    "order_number": "ORD-20251112-00123",
    "order_status": "shipped",
    "tracking": {
      "tracking_number": "JNE123456789012",
      "shipping_courier": "JNE",
      "tracking_url": "https://www.jne.co.id/en/tracking/trace?awb=JNE123456789012",
      "estimated_delivery": "2025-11-15T17:00:00.000Z",
      "status_description": "Paket sedang dalam perjalanan (JNE)",
      "is_tracking_available": true,
      "instructions": "Klik link tracking atau salin nomor resi untuk melacak paket di website JNE"
    },
    "shipping": {
      "shipped_at": "2025-11-11T09:00:00.000Z",
      "delivered_at": null,
      "recipient_name": "John Doe",
      "recipient_phone": "081298765432"
    }
  }
}
```

### GET `/api/ecommerce/buyer/transactions/summary`

```json
{
  "success": true,
  "message": "Summary transaksi berhasil diambil",
  "data": {
    "total_orders": 25,
    "total_spending": 12500000,
    "orders_by_status": {
      "pending": 2,
      "processing": 3,
      "shipped": 5,
      "completed": 12,
      "cancelled": 3
    }
  }
}
```

---

## Query Parameters & Filtering

### Contoh Penggunaan

```bash
# 1. Semua transaksi (default pagination)
GET /api/ecommerce/buyer/transactions

# 2. Filter by status
GET /api/ecommerce/buyer/transactions?status=shipped

# 3. Filter by payment status
GET /api/ecommerce/buyer/transactions?payment_status=paid

# 4. Search by order number
GET /api/ecommerce/buyer/transactions?search=ORD-20251112

# 5. Filter by date range
GET /api/ecommerce/buyer/transactions?date_from=2025-11-01&date_to=2025-11-12

# 6. Pagination
GET /api/ecommerce/buyer/transactions?page=2&limit=20

# 7. Sorting
GET /api/ecommerce/buyer/transactions?sort_by=total_amount&sort_order=desc

# 8. Kombinasi multiple filters
GET /api/ecommerce/buyer/transactions?status=shipped&date_from=2025-11-01&page=1&limit=10&sort_by=created_at&sort_order=desc
```

### Valid Values

**order_status**:
- `pending` - Menunggu pembayaran
- `paid` - Sudah dibayar, menunggu konfirmasi seller
- `processing` - Seller sedang memproses
- `shipped` - Dalam pengiriman
- `delivered` - Sudah sampai
- `completed` - Selesai
- `cancelled` - Dibatalkan

**payment_status**:
- `unpaid` - Belum bayar
- `paid` - Sudah dibayar
- `refunded` - Di-refund

**sort_by**:
- `created_at` - Tanggal order dibuat
- `total_amount` - Total harga

**sort_order**:
- `asc` - Ascending (terkecil ke terbesar)
- `desc` - Descending (terbesar ke terkecil)

---

## Security & Authorization

### Authentication
- **Required**: Ya, menggunakan JWT Token
- **Header**: `Authorization: Bearer <token>`

### Role-Based Access Control
- **Role**: Hanya user dengan role `buyer` yang bisa mengakses
- **Middleware**: `validateRoleMiddleware(["buyer"])`
- **Error Response** (jika bukan buyer):
```json
{
  "success": false,
  "message": "Access denied. This endpoint is only for buyers."
}
```

### Data Isolation
- Buyer hanya bisa melihat transaksi milik sendiri
- Filter otomatis: `where: { buyer_id: userId }`
- Tidak bisa melihat transaksi buyer lain

### Rate Limiting (Rekomendasi)
- Endpoint tracking: 60 requests per menit per user
- Endpoint list/detail: 120 requests per menit per user

---

## Tracking URL External (per Kurir)

### Format Link Tracking Berdasarkan Kurir

API secara otomatis membuat `tracking_url` berdasarkan `shipping_courier` dan `tracking_number`.

| Kurir | Format URL |
|-------|------------|
| **JNE** | `https://www.jne.co.id/en/tracking/trace?awb={resi}` |
| **J&T Express** | `https://www.jet.co.id/track?airwaybill={resi}` |
| **SiCepat** | `https://www.sicepat.com/checkAwb/?do=tracking&awb={resi}` |
| **Pos Indonesia** | `https://www.posindonesia.co.id/id/tracking?barcode={resi}` |
| **Anteraja** | `https://anteraja.id/tracking?awb={resi}` |
| **ID Express** | `https://www.idexpress.com/tracking?awb={resi}` |
| **Ninja Xpress** | `https://www.ninjaxpress.co.id/id-id/tracking?airwaybill={resi}` |
| **Lion Parcel** | `https://www.lionparcel.com/cek-resi/?barcode={resi}` |

### Implementasi di Backend (Helper Function)

```javascript
function generateTrackingUrl(courier, trackingNumber) {
  if (!trackingNumber) return null;
  
  const courierUrls = {
    'JNE': `https://www.jne.co.id/en/tracking/trace?awb=${trackingNumber}`,
    'J&T': `https://www.jet.co.id/track?airwaybill=${trackingNumber}`,
    'J&T Express': `https://www.jet.co.id/track?airwaybill=${trackingNumber}`,
    'SiCepat': `https://www.sicepat.com/checkAwb/?do=tracking&awb=${trackingNumber}`,
    'Pos Indonesia': `https://www.posindonesia.co.id/id/tracking?barcode=${trackingNumber}`,
    'Anteraja': `https://anteraja.id/tracking?awb=${trackingNumber}`,
    'ID Express': `https://www.idexpress.com/tracking?awb=${trackingNumber}`,
    'Ninja Xpress': `https://www.ninjaxpress.co.id/id-id/tracking?airwaybill=${trackingNumber}`,
    'Lion Parcel': `https://www.lionparcel.com/cek-resi/?barcode=${trackingNumber}`,
  };
  
  return courierUrls[courier] || null;
}
```

### Edge Cases Tracking

1. **Nomor Resi Belum Tersedia**:
   ```json
   {
     "tracking": {
       "tracking_number": null,
       "shipping_courier": null,
       "tracking_url": null,
       "is_tracking_available": false,
       "instructions": "Nomor resi belum tersedia. Mohon tunggu konfirmasi dari seller."
     }
   }
   ```

2. **Kurir Tidak Dikenali**:
   ```json
   {
     "tracking": {
       "tracking_number": "ABC123456",
       "shipping_courier": "Kurir Lokal XYZ",
       "tracking_url": null,
       "instructions": "Salin nomor resi ABC123456 untuk melacak manual ke kurir"
     }
   }
   ```

3. **Order Belum Dikirim** (status: pending/paid/processing):
   ```json
   {
     "tracking": {
       "tracking_number": null,
       "status_description": "Pesanan sedang dikemas oleh seller",
       "is_tracking_available": false
     }
   }
   ```

---

## Status Order & Edge Cases

### Progress Tracking (untuk UI)

| order_status | percentage | label | description |
|--------------|------------|-------|-------------|
| `pending` | 10% | Menunggu Pembayaran | Buyer belum upload bukti bayar |
| `paid` | 30% | Menunggu Konfirmasi Seller | Payment proof sudah diupload |
| `processing` | 50% | Sedang Diproses | Seller sedang mengemas |
| `shipped` | 75% | Dalam Pengiriman | Paket dalam perjalanan |
| `delivered` | 90% | Telah Sampai | Paket sudah diterima |
| `completed` | 100% | Selesai | Transaksi selesai |
| `cancelled` | 0% | Dibatalkan | Order dibatalkan |

### Available Actions (berdasarkan status)

**Status: `pending`**
```json
{
  "available_actions": [
    {
      "action": "upload_payment",
      "label": "Upload Bukti Pembayaran",
      "enabled": true
    },
    {
      "action": "cancel",
      "label": "Batalkan Pesanan",
      "enabled": true
    }
  ]
}
```

**Status: `shipped`** (dengan tracking)
```json
{
  "available_actions": [
    {
      "action": "track_shipment",
      "label": "Lacak Pengiriman",
      "enabled": true,
      "url": "https://www.jne.co.id/en/tracking/trace?awb=JNE123"
    },
    {
      "action": "contact_seller",
      "label": "Hubungi Seller",
      "enabled": true
    }
  ]
}
```

**Status: `delivered`**
```json
{
  "available_actions": [
    {
      "action": "confirm_delivery",
      "label": "Konfirmasi Penerimaan",
      "enabled": true
    }
  ]
}
```

**Status: `completed`**
```json
{
  "available_actions": [
    {
      "action": "review_products",
      "label": "Beri Ulasan",
      "enabled": true
    }
  ]
}
```

### Error Responses

**400 Bad Request** (parameter tidak valid)
```json
{
  "success": false,
  "message": "Parameter 'page' harus berupa angka positif (minimal 1)"
}
```

```json
{
  "success": false,
  "message": "Parameter 'limit' harus berupa angka positif (minimal 1)"
}
```

```json
{
  "success": false,
  "message": "Parameter 'limit' maksimal 100"
}
```

```json
{
  "success": false,
  "message": "Parameter 'sort_by' tidak valid. Gunakan salah satu: created_at, total_amount, order_status, payment_status"
}
```

```json
{
  "success": false,
  "message": "Parameter 'sort_order' harus 'asc' atau 'desc'"
}
```

```json
{
  "success": false,
  "message": "Status order tidak valid. Gunakan salah satu: pending, paid, processing, shipped, delivered, completed, cancelled"
}
```

```json
{
  "success": false,
  "message": "Status pembayaran tidak valid. Gunakan salah satu: unpaid, paid, refunded"
}
```

```json
{
  "success": false,
  "message": "Format 'date_from' tidak valid. Gunakan format YYYY-MM-DD"
}
```

**401 Unauthorized** (token tidak valid/expired)
```json
{
  "success": false,
  "message": "Unauthorized. Please login first."
}
```

**403 Forbidden** (bukan role buyer)
```json
{
  "success": false,
  "message": "Access denied. This endpoint is only for buyers."
}
```

**404 Not Found** (transaksi tidak ditemukan atau bukan milik buyer)
```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil data transaksi",
  "error": "Error message here (development only)"
}
```

---

## Testing dengan cURL

### 1. Login sebagai Buyer
```bash
curl -X POST http://localhost:5000/api/ecommerce/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "password123"
  }'
```

### 2. Get Transaction List
```bash
curl -X GET "http://localhost:5000/api/ecommerce/buyer/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Transaction Detail
```bash
curl -X GET http://localhost:5000/api/ecommerce/buyer/transactions/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Tracking Info
```bash
curl -X GET http://localhost:5000/api/ecommerce/buyer/transactions/123/tracking \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Summary
```bash
curl -X GET http://localhost:5000/api/ecommerce/buyer/transactions/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Frontend Implementation

### ✅ OrderDetailPage Component

**Location**: `src/pages/OrderDetailPage.jsx`

**Route**: `/pesanan/:id` (Protected Route - Buyer only)

**Navigation**: 
- From MyOrdersPage: Click on any order card or "Lihat Detail Lengkap" button
- Direct URL: `/pesanan/{order_id}`
- Returns to: `/pesanan` (MyOrdersPage) via back button

**Features Implemented**:

#### 1. **Order Information Display** ✅
- Complete order details with order number and status badge
- Product items with images, variants, prices, and quantities
- Subtotal calculation per item
- Total items and quantity count
- Seller store information with link

#### 2. **Seller Information** ✅
- Store name with clickable link to seller profile
- Store photo/avatar
- Store rating (if available)
- Store address
- Contact seller button

#### 3. **Payment Information** ✅
- Payment method display with icons
- Payment status badge (Lunas/Belum Bayar)
- Payment proof image (if uploaded)
- Bank account details for manual transfer
- Paid timestamp
- Price breakdown:
  - Subtotal products
  - Shipping cost (shows "GRATIS" if 0)
  - Total amount in red

#### 4. **Shipping Address** ✅
- Recipient name and phone
- Full formatted address
- Village, district, regency, province
- Postal code
- Icon with MapPin indicator

#### 5. **Tracking Information** ✅
- Courier logo component integration
- Courier name (JNE, J&T, SiCepat, etc.)
- Tracking number (resi)
- External tracking URL button
- Estimated delivery date
- Tracking status description
- Only shows when tracking_number is available

#### 6. **Order Timeline** ✅
- Visual timeline with icons
- Timestamps for each status:
  - Order created
  - Payment confirmed
  - Seller confirmed order
  - Package shipped
  - Package delivered
  - Order completed
  - Order cancelled (if applicable)
- Progress percentage indicator
- Current status highlight

#### 7. **Tabs Navigation** ✅
- **Tab 1: Detail Pesanan**
  - Order items list
  - Seller information
  - Shipping address
  - Payment details
  
- **Tab 2: Lacak Paket** (only if tracking available)
  - Tracking history timeline
  - Courier information
  - Current tracking status
  - Estimated delivery
  - External tracking link

#### 8. **Status-based Action Buttons** ✅
```
Status: pending
  → 📤 Upload Bukti Bayar (Upload Payment Proof)
  → ❌ Batalkan Pesanan (Cancel Order)

Status: paid/processing
  → ⏳ Menunggu Seller Proses (Waiting, disabled button)

Status: shipped
  → 🚚 Lacak Pengiriman (Track Shipment - opens external URL)
  → ✓ Pesanan Diterima (Confirm Receipt)

Status: delivered
  → ✓ Konfirmasi Penerimaan (Confirm Receipt)
  → ⚠️ Komplain (Complaint button)

Status: completed
  → ⭐ Beri Ulasan (Leave Review)
  → 🔁 Beli Lagi (Buy Again)

Status: cancelled
  → 🛍️ Belanja Lagi (Shop Again)
```

#### 9. **Help & Support Actions** ✅
- 📞 Hubungi Customer Service button
- 💬 Chat dengan Seller button

#### 10. **Responsive Design** ✅
- Desktop: Sidebar layout with order summary
- Mobile: Stacked layout
- Tablet: Adaptive grid
- All action buttons responsive

#### 11. **Loading & Error States** ✅
- Loading skeleton while fetching data
- Error message display if fetch fails
- Fallback mode with dummy data (development)
- 404 Not Found handling

#### 12. **Data Integration** ✅
Uses `buyerTransactionAPI` service:
```javascript
// Fetch order detail
const orderData = await buyerTransactionAPI.getTransactionDetail(transactionId);

// Fetch tracking info
const trackingData = await buyerTransactionAPI.getTrackingInfo(transactionId);
```

Both functions support **fallback mode** with dummy data when backend is unavailable.

---

### Integration Code Examples

#### 1. Navigate from MyOrdersPage
```javascript
// Each order card is clickable
<Card 
  onClick={() => navigate(`/pesanan/${order.order_id}`)}
  className="cursor-pointer hover:shadow-lg transition-shadow"
>
  {/* Order content */}
</Card>

// Detail button (with stopPropagation to prevent double trigger)
<Button 
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/pesanan/${order.order_id}`);
  }}
>
  📋 Lihat Detail Lengkap
</Button>
```

#### 2. Display Order Status Badge
```javascript
const getStatusBadge = (status) => {
  const badges = {
    pending: {
      label: 'Menunggu Pembayaran',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Clock
    },
    paid: {
      label: 'Sudah Dibayar',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: CheckCircle
    },
    processing: {
      label: 'Diproses',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: Package
    },
    shipped: {
      label: 'Dikirim',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Truck
    },
    delivered: {
      label: 'Sampai',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: Home
    },
    completed: {
      label: 'Selesai',
      color: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: CheckCircle2
    },
    cancelled: {
      label: 'Dibatalkan',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle
    }
  };
  return badges[status] || badges.pending;
};
```

#### 3. Display Tracking Information
```javascript
{order.tracking?.tracking_number ? (
  <div className="flex items-center gap-2">
    <CourierLogo 
      code={order.tracking.shipping_courier?.toLowerCase()} 
      size="sm"
    />
    <div>
      <p className="font-medium">{order.tracking.shipping_courier}</p>
      <p className="text-sm text-gray-600">
        Resi: {order.tracking.tracking_number}
      </p>
    </div>
    {order.tracking.tracking_url && (
      <a
        href={order.tracking.tracking_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
      >
        🔍 Lacak Paket →
      </a>
    )}
  </div>
) : (
  <p className="text-gray-500">Nomor resi belum tersedia</p>
)}
```

#### 4. Timeline Component
```javascript
const timelineEvents = [
  {
    title: 'Pesanan Dibuat',
    timestamp: order.created_at,
    icon: ShoppingCart,
    completed: true
  },
  {
    title: 'Pembayaran Dikonfirmasi',
    timestamp: order.paid_at,
    icon: CreditCard,
    completed: !!order.paid_at
  },
  {
    title: 'Pesanan Dikonfirmasi Seller',
    timestamp: order.confirmed_at,
    icon: CheckCircle,
    completed: !!order.confirmed_at
  },
  {
    title: 'Paket Dikirim',
    timestamp: order.shipped_at,
    icon: Truck,
    completed: !!order.shipped_at
  },
  {
    title: 'Paket Diterima',
    timestamp: order.delivered_at,
    icon: Home,
    completed: !!order.delivered_at
  },
  {
    title: 'Pesanan Selesai',
    timestamp: order.completed_at,
    icon: CheckCircle2,
    completed: !!order.completed_at
  }
];
```

---

### API Endpoints Used by OrderDetailPage

**Primary Endpoint**:
```
GET /api/ecommerce/buyer/transactions/:transactionId
```
Returns complete order details including items, seller, payment, shipping, and tracking.

**Secondary Endpoint** (Optional):
```
GET /api/ecommerce/buyer/transactions/:transactionId/tracking
```
Returns lighter tracking-only response for tracking widget updates.

**Response Structure Expected**:
```javascript
{
  success: true,
  data: {
    order_id: number,
    order_number: string,
    order_status: string,
    payment_status: string,
    payment_method: string,
    subtotal: number,
    shipping_cost: number,
    total_amount: number,
    items: [
      {
        order_item_id: number,
        product_name: string,
        product_image: string,
        variant: string,
        price: number,
        quantity: number,
        subtotal: number
      }
    ],
    seller: {
      seller_id: number,
      store_name: string,
      store_photo: string,
      store_address: string,
      rating: number
    },
    shipping_address: {
      recipient_name: string,
      recipient_phone: string,
      full_address: string,
      formatted_address: string
    },
    tracking: {
      tracking_number: string,
      shipping_courier: string,
      tracking_url: string,
      estimated_delivery: string,
      status: string
    },
    timeline: {
      created_at: string,
      paid_at: string,
      confirmed_at: string,
      shipped_at: string,
      delivered_at: string,
      completed_at: string,
      cancelled_at: string
    }
  }
}
```

---

### Fallback Mode (Development)

OrderDetailPage works **without backend** using fallback data from `buyerTransactionAPI.js`:

**Fallback Order Details**:
```javascript
{
  order_id: parseInt(id),
  order_number: `ORD-20251112-${String(id).padStart(5, '0')}`,
  order_status: 'shipped',
  payment_status: 'paid',
  total_amount: 2550000,
  items: [
    {
      product_name: "Smartphone XYZ Pro Max",
      price: 2500000,
      quantity: 1,
      // ... more fields
    }
  ],
  seller: {
    store_name: "Toko Elektronik Jaya",
    // ... more fields
  },
  tracking: {
    tracking_number: "JNE1234567890",
    shipping_courier: "JNE",
    tracking_url: "https://www.jne.co.id/en/tracking/trace?awb=JNE1234567890"
  }
  // ... complete order data
}
```

This allows frontend development and testing without waiting for backend implementation.

---

### User Flow

1. **Buyer browses orders** → MyOrdersPage (`/pesanan`)
2. **Clicks order card or "Lihat Detail"** → Navigates to `/pesanan/{order_id}`
3. **OrderDetailPage loads** → Fetches detail via API
4. **View comprehensive info** → Tabs: Detail Pesanan | Lacak Paket
5. **Take actions** based on status:
   - Upload payment proof
   - Track shipment via external link
   - Confirm receipt
   - Leave review
   - Contact seller
6. **Back to list** → Click back button to `/pesanan`

---

### Testing OrderDetailPage

#### Manual Testing (with Fallback)
1. Start dev server: `npm run dev`
2. Login as buyer
3. Go to `/pesanan` (MyOrdersPage)
4. Click any order card or "Lihat Detail Lengkap" button
5. Verify all sections render correctly:
   - Order header with status badge
   - Product items list
   - Seller info
   - Shipping address
   - Payment details
   - Tracking info (if available)
   - Timeline
   - Action buttons
6. Test tab navigation (Detail Pesanan ↔ Lacak Paket)
7. Test action buttons (should show alerts for unimplemented features)
8. Test back navigation

#### Testing with Backend
1. Backend running on `http://localhost:5000`
2. Database has orders for logged-in buyer
3. Navigate to `/pesanan/{real_order_id}`
4. Verify real data loads correctly
5. Test tracking URL (should open courier website)
6. Verify status-specific buttons appear correctly

---

### Common Issues & Solutions

**Issue**: "Transaksi tidak ditemukan"
- **Cause**: Order ID doesn't exist or doesn't belong to logged-in buyer
- **Solution**: Check order_id in URL, verify buyer owns this order

**Issue**: Tracking tab not showing
- **Cause**: tracking_number is null/empty
- **Solution**: Normal behavior - tab only shows when tracking available

**Issue**: Action buttons not working
- **Cause**: Features not yet implemented (upload payment, confirm receipt, etc.)
- **Solution**: Backend endpoints need implementation - currently shows alerts

**Issue**: Courier logo not showing
- **Cause**: Courier code not in CourierLogo component mapping
- **Solution**: Add courier to `src/components/CourierLogo.jsx` mapping

---

### Future Enhancements

**Phase 1** (Current - Completed ✅):
- [x] Display order details
- [x] Show tracking information
- [x] Timeline visualization
- [x] Status-based UI
- [x] Navigation from MyOrdersPage

**Phase 2** (Planned):
- [ ] Upload payment proof implementation
- [ ] Cancel order functionality
- [ ] Confirm receipt endpoint
- [ ] Review system integration
- [ ] Real-time tracking updates
- [ ] Push notifications for status changes

**Phase 3** (Future):
- [ ] Print order invoice
- [ ] Share order link
- [ ] Download receipt PDF
- [ ] Order modification (address change)
- [ ] Complaint system
- [ ] Refund request flow

---

## Frontend Integration Tips

### 1. Display Tracking Button
```javascript
// Hanya tampilkan tombol tracking jika tersedia
if (tracking.is_tracking_available && tracking.tracking_url) {
  <a href={tracking.tracking_url} target="_blank">
    Lacak Paket ({tracking.shipping_courier}: {tracking.tracking_number})
  </a>
}
```

### 2. Progress Bar
```javascript
// Gunakan progress.percentage untuk progress bar
<div className="progress-bar" style={{ width: `${progress.percentage}%` }}>
  {progress.label}
</div>
```

### 3. Status Badge Colors
```javascript
const statusColors = {
  pending: 'yellow',
  paid: 'blue',
  processing: 'orange',
  shipped: 'purple',
  delivered: 'green',
  completed: 'teal',
  cancelled: 'red'
};
```

### 4. Auto-refresh Tracking
```javascript
// Polling setiap 5 menit jika status = shipped
if (order.order_status === 'shipped') {
  setInterval(() => {
    fetchTrackingInfo(orderId);
  }, 300000); // 5 minutes
}
```

---

## Database Schema Reference

### Table: `orders`

| Column | Type | Nullable | Key | Default | Description |
|--------|------|----------|-----|---------|-------------|
| order_id | INT | NO | PRI | AUTO_INCREMENT | Primary key |
| order_number | VARCHAR(50) | NO | UNI | - | Unique order number |
| buyer_id | INT | NO | MUL | - | Foreign key ke users |
| seller_id | INT | NO | MUL | - | Foreign key ke seller_profiles |
| tracking_number | VARCHAR(100) | YES | - | NULL | Nomor resi |
| shipping_courier | VARCHAR(50) | YES | - | NULL | Nama kurir |
| tracking_url | TEXT | YES | - | NULL | Link tracking |
| estimated_delivery | DATETIME | YES | - | NULL | Estimasi sampai |
| order_status | ENUM | NO | MUL | 'pending' | Status order |
| payment_status | ENUM | NO | MUL | 'unpaid' | Status payment |
| created_at | DATETIME | NO | MUL | CURRENT_TIMESTAMP | Waktu dibuat |
| shipped_at | DATETIME | YES | - | NULL | Waktu dikirim |
| delivered_at | DATETIME | YES | - | NULL | Waktu sampai |

**Indexes**:
- PRIMARY KEY (`order_id`)
- UNIQUE KEY (`order_number`)
- INDEX (`buyer_id`)
- INDEX (`seller_id`)
- INDEX (`order_status`)
- INDEX (`payment_status`)
- INDEX (`created_at`)

---

## Changelog

### Version 1.0.0 (2025-11-12)
- ✅ Initial release
- ✅ GET list transaksi dengan filtering & pagination
- ✅ GET detail transaksi lengkap
- ✅ GET tracking info khusus
- ✅ GET summary statistik
- ✅ Support tracking URL eksternal untuk 8+ kurir
- ✅ Progress tracking untuk UI
- ✅ Available actions per status
- ✅ Role-based access control (buyer only)

---

## Support

Untuk pertanyaan atau bug report, hubungi:
- Email: support@example.com
- Slack: #api-support

---

**Dokumentasi dibuat**: 12 November 2025  
**Author**: Development Team  
**Version**: 1.0.0
