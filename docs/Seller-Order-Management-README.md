# Seller Order Management API Documentation

## Overview
API untuk seller mengelola pesanan masuk dan melihat riwayat pesanan di platform e-commerce.

## Endpoints

### 1. Get Incoming Orders (List & History)
Mendapatkan daftar pesanan masuk untuk seller dengan filter dan pagination.

**Endpoint:** `GET /api/ecommerce/seller/orders`

**Authentication:** Required (Seller only)

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | none | Filter berdasarkan status order: `pending`, `paid`, `processing`, `shipped`, `delivered`, `completed`, `cancelled` |
| page | integer | No | 1 | Nomor halaman |
| limit | integer | No | 10 | Jumlah item per halaman |
| search | string | No | - | Search by order_number atau recipient_name |

**Order Status Values:**
- `pending` - Menunggu pembayaran
- `paid` - Sudah dibayar, menunggu konfirmasi seller
- `processing` - Seller sedang memproses
- `shipped` - Dalam pengiriman
- `delivered` - Sudah sampai
- `completed` - Selesai
- `cancelled` - Dibatalkan

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Daftar pesanan berhasil diambil",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_number": "ORD-20251113-00001",
        "buyer_id": 4,
        "recipient_name": "John Buyer",
        "recipient_phone": "081234567890",
        "shipping_address": {
          "province": "DKI Jakarta",
          "regency": "Jakarta Selatan",
          "district": "Kebayoran Baru",
          "village": "Senayan",
          "postal_code": "12190",
          "full_address": "Jl. Sudirman No. 123"
        },
        "subtotal": 100000,
        "shipping_cost": 15000,
        "total_amount": 115000,
        "payment_method": "manual_transfer",
        "payment_status": "paid",
        "payment_proof": "http://localhost:5000/uploads/payment-proof/proof-123.jpg",
        "paid_at": "2025-11-13T10:30:00.000Z",
        "order_status": "processing",
        "buyer_notes": "Tolong dikemas dengan baik",
        "seller_notes": null,
        "cancel_reason": null,
        "created_at": "2025-11-13T08:00:00.000Z",
        "updated_at": "2025-11-13T10:35:00.000Z",
        "confirmed_at": "2025-11-13T10:35:00.000Z",
        "shipped_at": null,
        "delivered_at": null,
        "completed_at": null,
        "cancelled_at": null,
        "items": [
          {
            "order_item_id": 1,
            "product_name": "Laptop Gaming",
            "product_image": "http://localhost:5000/uploads/products/laptop-123.jpg",
            "variant": "RAM: 16GB",
            "price": 100000,
            "quantity": 1,
            "subtotal": 100000
          }
        ],
        "total_items": 1
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_items": 25,
      "total_pages": 3,
      "has_next_page": true,
      "has_prev_page": false
    },
    "filters": {
      "status": "all",
      "search": null
    }
  }
}
```

**Error Responses:**

**Status Code:** `403 Forbidden`
```json
{
  "success": false,
  "error": "Anda bukan seller"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Status tidak valid. Status yang diperbolehkan: pending, paid, processing, shipped, delivered, completed, cancelled"
}
```

**Status Code:** `401 Unauthorized`
```json
{
  "success": false,
  "error": "Token tidak valid atau sudah kadaluarsa"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil daftar pesanan",
  "error": "Error message details"
}
```

---

### 2. Get Order Detail
Mendapatkan detail lengkap pesanan untuk seller.

**Endpoint:** `GET /api/ecommerce/seller/orders/:orderId`

**Authentication:** Required (Seller only)

**Headers:**
```
Authorization: Bearer <seller_token>
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | integer | Yes | ID pesanan yang ingin dilihat |

**Success Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Detail pesanan berhasil diambil",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20251113-00001",
    "buyer_id": 4,
    "shipping_address_id": 5,
    "recipient_name": "John Buyer",
    "recipient_phone": "081234567890",
    "shipping_address": {
      "province": "DKI Jakarta",
      "regency": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "village": "Senayan",
      "postal_code": "12190",
      "full_address": "Jl. Sudirman No. 123"
    },
    "subtotal": 100000,
    "shipping_cost": 15000,
    "total_amount": 115000,
    "payment_method": "manual_transfer",
    "bank_account_id": 1,
    "payment_status": "paid",
    "payment_proof": "http://localhost:5000/uploads/payment-proof/proof-123.jpg",
    "paid_at": "2025-11-13T10:30:00.000Z",
    "payment_verified_by": 1,
    "payment_verified_at": "2025-11-13T10:35:00.000Z",
    "payment_rejected_at": null,
    "payment_rejection_reason": null,
    "order_status": "processing",
    "buyer_notes": "Tolong dikemas dengan baik",
    "seller_notes": null,
    "cancel_reason": null,
    "created_at": "2025-11-13T08:00:00.000Z",
    "updated_at": "2025-11-13T10:35:00.000Z",
    "confirmed_at": "2025-11-13T10:35:00.000Z",
    "shipped_at": null,
    "delivered_at": null,
    "completed_at": null,
    "cancelled_at": null,
    "items": [
      {
        "order_item_id": 1,
        "product_id": 10,
        "variant_id": 2,
        "product_name": "Laptop Gaming",
        "product_image": "http://localhost:5000/uploads/products/laptop-123.jpg",
        "variant": "RAM: 16GB",
        "price": 100000,
        "quantity": 1,
        "subtotal": 100000
      }
    ],
    "total_items": 1,
    "total_quantity": 1
  }
}
```

**Error Responses:**

**Status Code:** `403 Forbidden`
```json
{
  "success": false,
  "error": "Anda bukan seller"
}
```

**Status Code:** `404 Not Found`
```json
{
  "success": false,
  "error": "Pesanan tidak ditemukan"
}
```

**Status Code:** `401 Unauthorized`
```json
{
  "success": false,
  "error": "Token tidak valid atau sudah kadaluarsa"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil detail pesanan",
  "error": "Error message details"
}
```

---

## Usage Examples

### Example 1: Get All Orders (No Filter)
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders" \
  -H "Authorization: Bearer <seller_token>"
```

### Example 2: Get Orders with Status Filter
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders?status=processing" \
  -H "Authorization: Bearer <seller_token>"
```

### Example 3: Get Orders with Pagination
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders?page=2&limit=20" \
  -H "Authorization: Bearer <seller_token>"
```

### Example 4: Get Orders with Multiple Filters
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders?status=completed&page=1&limit=10" \
  -H "Authorization: Bearer <seller_token>"
```

### Example 5: Search Orders
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders?search=ORD-20251113" \
  -H "Authorization: Bearer <seller_token>"
```

### Example 6: Get Order Detail
```bash
curl -X GET "http://localhost:5000/api/ecommerce/seller/orders/1" \
  -H "Authorization: Bearer <seller_token>"
```

---

## Order Status Flow

```
pending (Menunggu pembayaran)
    ↓
paid (Sudah dibayar, menunggu konfirmasi seller)
    ↓
processing (Seller sedang memproses)
    ↓
shipped (Dalam pengiriman)
    ↓
delivered (Sudah sampai)
    ↓
completed (Selesai)

OR

cancelled (Dibatalkan - bisa dari status manapun)
```

---

## Features

### 1. **Filter by Order Status**
- Filter pesanan berdasarkan status: `pending`, `paid`, `processing`, `shipped`, `delivered`, `completed`, `cancelled`
- Default: tampilkan semua status

### 2. **Pagination**
- Default: page 1, 10 items per page
- Customizable melalui query parameters
- Response includes pagination info

### 3. **Search**
- Search by order number
- Search by recipient name

### 4. **Order Information**
- Complete order details
- Shipping information
- Payment information
- Order items with variants
- Timestamps for each status

### 5. **Activity Logging**
- Log setiap kali seller view orders
- Log setiap kali seller view order detail

---

## Notes

1. **Authentication Required**
   - Endpoint ini memerlukan authentication dengan role `seller`
   - Token harus valid dan user harus memiliki seller profile

2. **Seller-Specific Data**
   - Seller hanya bisa melihat pesanan untuk toko mereka sendiri
   - Tidak bisa melihat pesanan seller lain

3. **Order History**
   - Includes semua order dari status pending sampai completed/cancelled
   - Sorted by created_at descending (terbaru di atas)

4. **Performance**
   - Pagination untuk handling large datasets
   - Efficient query dengan proper indexing

5. **Data Privacy**
   - Buyer_id included tapi tidak menampilkan buyer's full profile
   - Payment proof URL included untuk verifikasi

---

## Testing

### Prerequisites
1. Seller account dengan token valid
2. Order data exists di database
3. Server running on `http://localhost:5000`

### Test Scenarios

#### Scenario 1: View All Orders
**Request:**
```http
GET /api/ecommerce/seller/orders
Authorization: Bearer <seller_token>
```

**Expected Result:**
- Status 200
- List of all orders for seller
- Default pagination (page 1, 10 items)

#### Scenario 2: Filter by Status
**Request:**
```http
GET /api/ecommerce/seller/orders?status=processing
Authorization: Bearer <seller_token>
```

**Expected Result:**
- Status 200
- Only orders with status "processing"

#### Scenario 3: Invalid Status Filter
**Request:**
```http
GET /api/ecommerce/seller/orders?status=invalid_status
Authorization: Bearer <seller_token>
```

**Expected Result:**
- Status 400
- Error message about invalid status

#### Scenario 4: View Order Detail
**Request:**
```http
GET /api/ecommerce/seller/orders/1
Authorization: Bearer <seller_token>
```

**Expected Result:**
- Status 200
- Complete order details

#### Scenario 5: View Non-Existent Order
**Request:**
```http
GET /api/ecommerce/seller/orders/99999
Authorization: Bearer <seller_token>
```

**Expected Result:**
- Status 404
- Error message "Pesanan tidak ditemukan"

#### Scenario 6: Non-Seller Access
**Request:**
```http
GET /api/ecommerce/seller/orders
Authorization: Bearer <buyer_token>
```

**Expected Result:**
- Status 403
- Error message "Anda bukan seller"

---

## Implementation Details

### Database Tables Used
- `orders` - Main order table
- `order_items` - Order line items
- `seller_profiles` - Seller information
- `activity_logs` - Activity logging

### Indexes Used
- `idx_order_seller` - For filtering by seller_id
- `idx_order_status` - For filtering by order_status
- `idx_order_created` - For sorting by created_at

### Security
- JWT authentication required
- Role-based access control (seller only)
- Seller can only access their own orders
- Activity logging for audit trail

---

## Error Handling

All errors return consistent JSON structure:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not a seller)
- `404` - Not Found (order not found)
- `500` - Internal Server Error

---

## Future Enhancements

1. **Export Orders**
   - Export to CSV/Excel
   - Date range filter for export

2. **Bulk Actions**
   - Mark multiple orders as shipped
   - Bulk status update

3. **Advanced Filters**
   - Filter by date range
   - Filter by payment method
   - Filter by total amount range

4. **Order Statistics**
   - Total orders by status
   - Revenue statistics
   - Average order value

5. **Real-time Updates**
   - WebSocket notifications for new orders
   - Real-time order status updates
