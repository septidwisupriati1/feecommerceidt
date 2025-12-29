# Admin Pending Payout API

API untuk admin melihat antrian order dengan status **"Menunggu Payout"** - yaitu order yang sudah sampai ke buyer (status: `delivered`) dan menunggu transfer pembayaran ke seller.

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoint](#endpoint)
- [Business Logic](#business-logic)
- [Request](#request)
- [Response](#response)
- [Testing](#testing)
- [Examples](#examples)

---

## 🎯 Overview

Endpoint ini digunakan oleh admin untuk:
- Melihat daftar order yang sudah `delivered` (sampai ke buyer) dan menunggu payout ke seller
- Mendapatkan detail lengkap bank account seller untuk transfer
- Menghitung jumlah transfer setelah dipotong komisi platform
- Sorting dan filtering untuk prioritas transfer
- Monitoring total amount yang perlu ditransfer

---

## 🔌 Endpoint

```
GET /api/ecommerce/admin/orders/pending-payout
```

**Authentication:** Required (JWT Token)  
**Authorization:** Admin only

---

## 💡 Business Logic

### Status "Menunggu Payout"

Order dianggap "menunggu payout" jika memenuhi kriteria:
- `order_status`: **delivered** (sudah sampai ke buyer)
- `payment_status`: **paid** (buyer sudah bayar)

### Perhitungan Transfer

```
Platform Commission = 5% dari subtotal produk
Transfer Amount = Total Order - Platform Commission

Dimana:
- Total Order = Subtotal + Shipping Cost
- Subtotal = Total harga produk
- Shipping Cost = Ongkir (TIDAK dipotong komisi)
```

**Contoh:**
```
Subtotal Produk: Rp 1,000,000
Ongkir: Rp 50,000
Total Order: Rp 1,050,000

Platform Commission: Rp 1,000,000 × 5% = Rp 50,000
Transfer to Seller: Rp 1,050,000 - Rp 50,000 = Rp 1,000,000
```

### Bank Account Priority

Ketika mengambil bank account seller:
1. **Primary bank account** (`is_primary: true`) - prioritas utama
2. **Any bank account** - jika tidak ada primary
3. **null** - jika seller belum setting bank account

### Default Sorting

Default sorting adalah **oldest first** (`delivered_at ASC`):
- Order yang sudah lama delivered = prioritas lebih tinggi untuk ditransfer
- Memastikan seller mendapat pembayaran secepat mungkin

---

## 📨 Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `seller_id` | integer | ❌ | - | Filter by specific seller ID |
| `sort` | string | ❌ | `oldest` | Sorting: `oldest`, `newest`, `highest`, `lowest` |
| `page` | integer | ❌ | `1` | Page number (min: 1) |
| `limit` | integer | ❌ | `10` | Items per page (1-100) |

### Sort Options

- `oldest` - Sort by `delivered_at ASC` (default - oldest first)
- `newest` - Sort by `delivered_at DESC` (newest first)
- `highest` - Sort by `total_amount DESC` (highest amount first)
- `lowest` - Sort by `total_amount ASC` (lowest amount first)

### Headers

```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

---

## 📤 Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Daftar order menunggu payout berhasil diambil",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_number": "ORD-2024-001",
        "order_status": "delivered",
        "payment_status": "paid",
        "delivered_at": "2024-11-10T10:30:00.000Z",
        "days_since_delivered": 7,
        "hours_since_delivered": 168,
        "seller": {
          "seller_id": 1,
          "user_id": 5,
          "store_name": "Toko Elektronik Jaya",
          "store_photo": "/uploads/stores/store1.jpg",
          "owner_name": "John Doe",
          "email": "seller@example.com",
          "phone": "081234567890",
          "bank_account": {
            "account_id": 1,
            "bank_name": "BCA",
            "account_number": "1234567890",
            "account_name": "PT Elektronik Jaya",
            "account_type": "bank",
            "is_primary": true
          }
        },
        "buyer": {
          "buyer_id": 10,
          "buyer_name": "Jane Smith",
          "buyer_phone": "082345678901"
        },
        "shipping_address": {
          "province": "DKI Jakarta",
          "regency": "Jakarta Selatan",
          "district": "Kebayoran Baru",
          "village": "Senayan",
          "postal_code": "12190",
          "full_address": "Jl. Senayan No. 123"
        },
        "amount_details": {
          "subtotal": 5000000,
          "shipping_cost": 50000,
          "total_amount": 5050000,
          "platform_commission_percentage": 5,
          "platform_commission_amount": 250000,
          "transfer_amount": 4800000,
          "currency": "IDR"
        },
        "items_summary": {
          "total_items": 2,
          "total_quantity": 3,
          "items": [
            {
              "product_name": "Laptop ASUS ROG",
              "quantity": 1,
              "price": 4000000,
              "variant": "RAM 16GB, SSD 512GB"
            },
            {
              "product_name": "Mouse Gaming",
              "quantity": 2,
              "price": 500000,
              "variant": "RGB Wireless"
            }
          ]
        },
        "timestamps": {
          "created_at": "2024-11-01T08:00:00.000Z",
          "paid_at": "2024-11-01T10:00:00.000Z",
          "delivered_at": "2024-11-10T10:30:00.000Z"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "total_pages": 2
    },
    "summary": {
      "total_orders": 10,
      "total_transfer_amount": 45000000,
      "total_commission_amount": 2250000,
      "total_order_amount": 47250000
    }
  }
}
```

### Response Field Explanation

#### `orders[]` - Array of Orders

| Field | Type | Description |
|-------|------|-------------|
| `order_id` | integer | Order ID |
| `order_number` | string | Order number (unique) |
| `order_status` | string | Order status (always "delivered") |
| `payment_status` | string | Payment status (always "paid") |
| `delivered_at` | datetime | When order was delivered |
| `days_since_delivered` | integer | Days since delivered |
| `hours_since_delivered` | integer | Hours since delivered |

#### `seller` - Seller Information

| Field | Type | Description |
|-------|------|-------------|
| `seller_id` | integer | Seller ID |
| `user_id` | integer | User ID of seller |
| `store_name` | string | Store name |
| `store_photo` | string\|null | Store photo URL |
| `owner_name` | string\|null | Full name of store owner |
| `email` | string | Seller email |
| `phone` | string\|null | Seller phone |
| `bank_account` | object\|null | Bank account details |

#### `bank_account` - Bank Details

| Field | Type | Description |
|-------|------|-------------|
| `account_id` | integer | Bank account ID |
| `bank_name` | string | Bank name (e.g., "BCA", "Mandiri") |
| `account_number` | string | Account number |
| `account_name` | string | Account holder name |
| `account_type` | string | "bank" or "e_wallet" |
| `is_primary` | boolean | Is primary account |

#### `amount_details` - Financial Details

| Field | Type | Description |
|-------|------|-------------|
| `subtotal` | float | Product subtotal |
| `shipping_cost` | float | Shipping cost |
| `total_amount` | float | Total order amount |
| `platform_commission_percentage` | float | Commission % (default: 5) |
| `platform_commission_amount` | float | Commission amount (subtotal × 5%) |
| `transfer_amount` | float | **Amount to transfer to seller** |
| `currency` | string | Currency code (IDR) |

#### `summary` - Overall Summary

| Field | Type | Description |
|-------|------|-------------|
| `total_orders` | integer | Total orders in current page |
| `total_transfer_amount` | float | Total amount to transfer (all orders) |
| `total_commission_amount` | float | Total commission (all orders) |
| `total_order_amount` | float | Total order amount (all orders) |

### Error Responses

#### 400 Bad Request - Invalid Parameters

```json
{
  "success": false,
  "message": "Parameter 'page' harus berupa angka positif (minimal 1)"
}
```

```json
{
  "success": false,
  "message": "Parameter 'limit' harus antara 1-100"
}
```

```json
{
  "success": false,
  "message": "Parameter 'seller_id' harus berupa angka"
}
```

#### 401 Unauthorized - No Token

```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

#### 403 Forbidden - Not Admin

```json
{
  "success": false,
  "message": "Akses ditolak. Hanya admin yang dapat mengakses."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil daftar order menunggu payout",
  "error": "Error message details"
}
```

---

## 🧪 Testing

### 1. Setup Test Data

Run the seed script to create test data:

```bash
node prisma/seed-pending-payout.js
```

This will create:
- 1 admin user
- 3 buyer users
- 3 seller users with stores and bank accounts
- 7 orders with "delivered" status (various amounts and delivery dates)

### 2. Login as Admin

```http
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin123!"
}
```

Copy the `token` from response.

### 3. Use REST Testing File

Open: `REST Testing/Admin-Pending-Payout.rest`

Update the `@adminToken` variable with your token, then test all scenarios.

---

## 📝 Examples

### Example 1: Get All Orders (Default)

**Request:**
```http
GET http://localhost:5000/api/ecommerce/admin/orders/pending-payout
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Result:** All delivered orders, sorted by oldest first

---

### Example 2: Filter by Seller

**Request:**
```http
GET http://localhost:5000/api/ecommerce/admin/orders/pending-payout?seller_id=1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Result:** Only orders from seller ID 1

---

### Example 3: Sort by Highest Amount

**Request:**
```http
GET http://localhost:5000/api/ecommerce/admin/orders/pending-payout?sort=highest
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Result:** Orders sorted by transfer amount (highest first)

---

### Example 4: Pagination

**Request:**
```http
GET http://localhost:5000/api/ecommerce/admin/orders/pending-payout?page=1&limit=5
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Result:** First 5 orders

---

### Example 5: Combined Filters

**Request:**
```http
GET http://localhost:5000/api/ecommerce/admin/orders/pending-payout?seller_id=2&sort=oldest&page=1&limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Result:** Orders from seller 2, sorted by oldest, page 1

---

## 🔄 Workflow

1. **Admin checks pending payout queue**
   ```
   GET /pending-payout
   ```

2. **Admin reviews**:
   - Order details
   - Seller bank account
   - Transfer amount
   - Days since delivered

3. **Admin processes transfer** (external banking system)
   - Transfer to seller's bank account
   - Amount: `transfer_amount` from response

4. **Admin marks order as transferred** (future endpoint)
   ```
   POST /orders/:orderId/mark-transferred
   ```
   - Changes status: `delivered` → `completed`

---

## 🎨 Features

✅ List all orders pending payout  
✅ Seller bank account details  
✅ Transfer amount calculation (with commission)  
✅ Multiple sorting options  
✅ Filter by seller  
✅ Pagination support  
✅ Days/hours since delivered  
✅ Summary statistics  
✅ Detailed order items  
✅ Shipping address included  

---

## 📌 Notes

- **Platform Commission**: Currently set to 5% of product subtotal
- **Shipping Cost**: NOT included in commission calculation
- **Bank Account**: Returns primary account if available, else first account found
- **No Bank Account**: If seller hasn't set up bank account, `bank_account` will be `null`
- **Default Sort**: Oldest first to prioritize sellers waiting longer

---

## 🔐 Security

- ✅ JWT Authentication required
- ✅ Admin role authorization
- ✅ Input validation for query parameters
- ✅ SQL injection protection (Prisma ORM)
- ✅ Sensitive data filtered (passwords excluded)

---

## 📚 Related Endpoints

- `GET /api/ecommerce/admin/orders/ready-for-transfer` - Similar, with priority levels
- `POST /api/ecommerce/admin/orders/:orderId/mark-transferred` - Mark as completed
- `GET /api/ecommerce/admin/orders/transfer-summary` - Transfer statistics

---

## 👨‍💻 Developer Notes

**File Locations:**
- Controller: `modules/ecommerce/controllers/adminOrderController.js`
- Route: `modules/ecommerce/routes/adminOrderRoutes.js`
- REST Testing: `REST Testing/Admin-Pending-Payout.rest`
- Seed: `prisma/seed-pending-payout.js`

**Database Tables:**
- `orders` - Main order data
- `order_items` - Order line items
- `seller_profiles` - Seller information
- `bank_accounts` - Seller bank accounts
- `users` - User data

---

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated:** November 17, 2024  
**Version:** 1.0.0  
**Author:** Development Team
