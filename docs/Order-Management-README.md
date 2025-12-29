# E-Commerce Order Management System - Complete Documentation

## Overview
Sistem order management untuk E-Commerce dengan fitur:
- ✅ Checkout per toko (satu seller per order)
- ✅ Stock locking otomatis (First Come First Served)
- ✅ Manual transfer payment
- ✅ Upload bukti pembayaran
- ✅ Cancel order dengan restore stock
- ✅ Transaction-based untuk data integrity

## Database Schema

### `orders` Table
```sql
- order_id (PK, Auto Increment)
- order_number (Unique, Format: ORD-YYYYMMDD-XXXXX)
- buyer_id (FK to users)
- seller_id (FK to seller_profiles)

Shipping Info (Snapshot):
- shipping_address_id
- recipient_name
- recipient_phone
- shipping_province
- shipping_regency
- shipping_district
- shipping_village
- shipping_postal
- shipping_address

Pricing:
- subtotal (Decimal 12,2)
- shipping_cost (Decimal 12,2)
- total_amount (Decimal 12,2)

Payment:
- payment_method (enum: manual_transfer, cod)
- bank_account_id (FK to bank_accounts)
- payment_status (enum: unpaid, paid, refunded)
- payment_proof (Text - file path)
- paid_at (DateTime)

Status:
- order_status (enum: pending, paid, processing, shipped, delivered, completed, cancelled)

Notes:
- buyer_notes (Text)
- seller_notes (Text)
- cancel_reason (Text)

Timestamps:
- created_at
- updated_at
- confirmed_at
- shipped_at
- delivered_at
- completed_at
- cancelled_at
```

### `order_items` Table
```sql
- order_item_id (PK, Auto Increment)
- order_id (FK to orders)
- product_id (FK to products)
- variant_id (FK to product_variants, nullable)

Snapshot Data:
- product_name (VarChar 200)
- product_image (Text)
- variant_name (VarChar 100)
- variant_value (VarChar 100)

Pricing:
- price (Decimal 12,2) - harga per item saat order
- quantity (Int)
- subtotal (Decimal 12,2) - price * quantity

Timestamps:
- created_at
```

## API Endpoints

### 1. Create Order (Checkout)
**Endpoint:** `POST /api/ecommerce/buyer/orders/checkout`  
**Auth:** Required (Bearer Token)  
**Role:** Buyer

**Request Body:**
```json
{
  "seller_id": 1,
  "shipping_address_id": 1,
  "bank_account_id": 1,
  "buyer_notes": "Mohon kirim dengan bubble wrap (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order berhasil dibuat. Silakan lakukan pembayaran.",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20231115-00001",
    "order_status": "pending",
    "payment_status": "unpaid",
    "subtotal": 150000,
    "shipping_cost": 0,
    "total_amount": 150000,
    "bank_account": {
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "Toko ABC",
      "account_type": "bank"
    },
    "shipping_address": {
      "recipient_name": "John Doe",
      "recipient_phone": "081234567890",
      "address": "Jl. Example No. 123, Kelurahan ABC, Kecamatan XYZ, Kota Jakarta, DKI Jakarta 12345"
    },
    "items": [
      {
        "product_name": "Product A",
        "variant": "Size: L",
        "price": 50000,
        "quantity": 3,
        "subtotal": 150000
      }
    ],
    "created_at": "2023-11-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Stok tidak cukup
- `404` - Alamat/bank account tidak ditemukan
- `404` - Tidak ada item dari seller di keranjang

**Process Flow:**
1. Validate shipping address belongs to user
2. Validate bank account belongs to seller
3. Get cart items for specific seller
4. Validate stock availability (with locking)
5. Generate unique order number
6. Calculate total (subtotal + shipping)
7. Create order record
8. Create order items records
9. **Decrement product stock (Stock Locking)**
10. Remove items from cart
11. Return order details with payment info

---

### 2. Get Buyer's Orders
**Endpoint:** `GET /api/ecommerce/buyer/orders`  
**Auth:** Required (Bearer Token)  
**Role:** Buyer

**Query Parameters:**
- `status` (optional) - Filter by order status (pending, paid, processing, shipped, delivered, completed, cancelled)
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Example:** `GET /api/ecommerce/buyer/orders?status=pending&page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data order berhasil diambil",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_number": "ORD-20231115-00001",
        "seller_id": 1,
        "order_status": "pending",
        "payment_status": "unpaid",
        "total_amount": 150000,
        "total_items": 3,
        "created_at": "2023-11-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "total_pages": 2
    }
  }
}
```

---

### 3. Get Order Detail
**Endpoint:** `GET /api/ecommerce/buyer/orders/:orderId`  
**Auth:** Required (Bearer Token)  
**Role:** Buyer

**Success Response (200):**
```json
{
  "success": true,
  "message": "Detail order berhasil diambil",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20231115-00001",
    "order_status": "pending",
    "payment_status": "unpaid",
    "payment_method": "manual_transfer",
    "payment_proof": null,
    "subtotal": 150000,
    "shipping_cost": 0,
    "total_amount": 150000,
    "buyer_notes": "Mohon kirim dengan bubble wrap",
    "seller_notes": null,
    "bank_account": {
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "Toko ABC",
      "account_type": "bank"
    },
    "shipping_address": {
      "recipient_name": "John Doe",
      "recipient_phone": "081234567890",
      "address": "Jl. Example No. 123, ..."
    },
    "items": [
      {
        "order_item_id": 1,
        "product_id": 1,
        "product_name": "Product A",
        "product_image": "/uploads/products/image.jpg",
        "variant": "Size: L",
        "price": 50000,
        "quantity": 3,
        "subtotal": 150000
      }
    ],
    "created_at": "2023-11-15T10:30:00.000Z",
    "paid_at": null,
    "confirmed_at": null,
    "shipped_at": null,
    "delivered_at": null,
    "completed_at": null,
    "cancelled_at": null
  }
}
```

**Error Responses:**
- `404` - Order tidak ditemukan atau bukan milik user

---

### 4. Upload Payment Proof
**Endpoint:** `POST /api/ecommerce/buyer/orders/:orderId/payment-proof`  
**Auth:** Required (Bearer Token)  
**Role:** Buyer  
**Content-Type:** `multipart/form-data`

**Form Data:**
- `payment_proof` (file) - Image file (JPG, PNG, GIF, max 5MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diupload. Menunggu konfirmasi seller.",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20231115-00001",
    "payment_status": "paid",
    "order_status": "paid",
    "payment_proof": "/uploads/payment-proofs/payment-1234567890-123456789.jpg",
    "paid_at": "2023-11-15T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - File tidak diupload
- `400` - Order sudah dibayar
- `404` - Order tidak ditemukan

**Notes:**
- Setelah upload, `payment_status` berubah menjadi `paid`
- `order_status` berubah menjadi `paid` (menunggu konfirmasi seller)
- File disimpan di folder `/uploads/payment-proofs/`

---

### 5. Cancel Order
**Endpoint:** `PUT /api/ecommerce/buyer/orders/:orderId/cancel`  
**Auth:** Required (Bearer Token)  
**Role:** Buyer

**Request Body:**
```json
{
  "cancel_reason": "Saya berubah pikiran (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order berhasil dibatalkan",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20231115-00001",
    "order_status": "cancelled",
    "cancel_reason": "Saya berubah pikiran",
    "cancelled_at": "2023-11-15T11:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Order tidak bisa dibatalkan (status bukan pending)
- `404` - Order tidak ditemukan

**Process Flow:**
1. Validate order exists and belongs to user
2. Check order status is `pending` (only pending orders can be cancelled)
3. **Restore product stock** (increment)
4. Update order status to `cancelled`
5. Set `cancelled_at` timestamp

---

## Order Status Flow

```
pending (Menunggu pembayaran)
  ↓ (Upload payment proof)
paid (Sudah dibayar, menunggu konfirmasi seller)
  ↓ (Seller confirms - future feature)
processing (Seller sedang memproses)
  ↓ (Seller ships - future feature)
shipped (Dalam pengiriman)
  ↓ (Delivery confirmed - future feature)
delivered (Sudah sampai)
  ↓ (Auto complete or manual - future feature)
completed (Selesai)

// Cancel path (only from pending)
pending → cancelled (Stock restored)
```

## Payment Status

- `unpaid` - Belum dibayar
- `paid` - Sudah upload bukti pembayaran
- `refunded` - Dana dikembalikan (future feature)

## Stock Locking Mechanism

### First Come First Served Implementation

**When Order Created:**
```javascript
// In createOrder transaction
for (const item of cart.cart_items) {
  // 1. Lock: Check current stock
  const currentProduct = await tx.products.findUnique({
    where: { product_id: item.product_id }
  });
  
  // 2. Validate stock sufficient
  if (availableStock < item.quantity) {
    throw new Error("Stok tidak cukup");
  }
  
  // 3. Decrement stock (LOCK)
  await tx.products.update({
    where: { product_id: item.product_id },
    data: {
      stock: {
        decrement: item.quantity
      }
    }
  });
}
```

**When Order Cancelled:**
```javascript
// In cancelOrder transaction
for (const item of order.order_items) {
  // Restore stock (UNLOCK)
  await tx.products.update({
    where: { product_id: item.product_id },
    data: {
      stock: {
        increment: item.quantity
      }
    }
  });
}
```

**Benefits:**
1. **Race Condition Prevention:** Transaction ensures atomicity
2. **Real-time Stock:** Stock updated immediately on order
3. **Fair Distribution:** First to checkout gets the stock
4. **Automatic Restore:** Stock returned on cancellation

## Cart Integration

### Cart Structure (Grouped by Seller)
When user views cart (`GET /api/ecommerce/buyer/cart`), items are grouped by seller:

```json
{
  "success": true,
  "data": {
    "cart_id": 1,
    "total_items": 5,
    "sellers": [
      {
        "seller_id": 1,
        "seller_info": {
          "store_name": "Toko ABC",
          "store_photo": "/uploads/stores/photo.jpg",
          "location": "Jakarta, DKI Jakarta"
        },
        "items": [
          {
            "cart_item_id": 1,
            "product_id": 1,
            "product_name": "Product A",
            "quantity": 2,
            "item_total": 100000
          }
        ],
        "subtotal": 100000,
        "total_items": 2
      },
      {
        "seller_id": 2,
        "seller_info": {
          "store_name": "Toko XYZ"
        },
        "items": [...],
        "subtotal": 75000,
        "total_items": 3
      }
    ],
    "grand_total": 175000
  }
}
```

### Checkout Process
User must checkout **one seller at a time**:

1. User views cart → sees items grouped by seller
2. User clicks "Checkout" for Seller A → `/api/ecommerce/buyer/orders/checkout`
3. System creates order for Seller A items only
4. Cart items from Seller A are removed
5. Cart still contains items from other sellers
6. User can checkout other sellers separately

**No Multi-Seller Checkout:** Each checkout creates one order per seller.

## File Upload Configuration

### Payment Proof Upload
- **Directory:** `/uploads/payment-proofs/`
- **Filename Format:** `payment-{timestamp}-{random}.{ext}`
- **Allowed Types:** JPG, JPEG, PNG, GIF
- **Max Size:** 5MB
- **Middleware:** `uploadPaymentProof` from `modules/ecommerce/middleware/uploadMiddleware.js`

## Testing Guide

### Prerequisites
1. Create user account and get JWT token
2. User must have role `buyer`
3. Create shipping address
4. Add products to cart from a seller
5. Get seller's bank account ID

### Test Scenarios

#### Scenario 1: Successful Order Creation
```bash
# 1. Add items to cart
POST /api/ecommerce/buyer/cart
{
  "product_id": 1,
  "quantity": 2
}

# 2. View cart
GET /api/ecommerce/buyer/cart

# 3. Create order
POST /api/ecommerce/buyer/orders/checkout
{
  "seller_id": 1,
  "shipping_address_id": 1,
  "bank_account_id": 1
}

# 4. Verify stock decreased
GET /api/ecommerce/buyer/products/1

# 5. Verify cart items removed
GET /api/ecommerce/buyer/cart
```

#### Scenario 2: Stock Locking Test
```bash
# Setup: Product with stock = 5

# User A: Add 5 items to cart
# User B: Add 3 items to cart

# User A: Checkout (should succeed)
POST /api/ecommerce/buyer/orders/checkout

# User B: Try checkout (should fail - insufficient stock)
POST /api/ecommerce/buyer/orders/checkout
# Error: "Stok tidak cukup. Tersedia: 0, diminta: 3"
```

#### Scenario 3: Order Cancellation with Stock Restore
```bash
# 1. Create order (stock decreases)
POST /api/ecommerce/buyer/orders/checkout

# 2. Check product stock (should be decreased)
GET /api/ecommerce/buyer/products/1

# 3. Cancel order
PUT /api/ecommerce/buyer/orders/1/cancel
{
  "cancel_reason": "Changed mind"
}

# 4. Check stock restored
GET /api/ecommerce/buyer/products/1
```

#### Scenario 4: Payment Proof Upload
```bash
# 1. Create order
POST /api/ecommerce/buyer/orders/checkout

# 2. Upload payment proof (use multipart/form-data)
POST /api/ecommerce/buyer/orders/1/payment-proof
[payment_proof file]

# 3. Verify payment status changed
GET /api/ecommerce/buyer/orders/1
# payment_status: "paid"
# order_status: "paid"
```

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "seller_id, shipping_address_id, dan bank_account_id wajib diisi"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat membuat order",
  "error": "Error details"
}
```

## Future Enhancements

### Phase 2 Features:
- [ ] Seller order management (confirm, ship, etc.)
- [ ] Automatic shipping cost calculation
- [ ] Multiple payment methods (Virtual Account, E-wallet)
- [ ] Order tracking
- [ ] Rating & review after delivery
- [ ] Refund management
- [ ] Order history export

### Phase 3 Features:
- [ ] Multi-seller checkout in one transaction
- [ ] Split payment
- [ ] Installment payment
- [ ] Points/rewards system
- [ ] Promo codes/vouchers

## Security Considerations

1. **Transaction Integrity:** All order operations use Prisma transactions
2. **Stock Consistency:** Stock locking prevents overselling
3. **User Authorization:** Users can only access their own orders
4. **File Validation:** Payment proof upload validates file type and size
5. **Order Immutability:** Order details stored as snapshot (can't be changed if product changes)

## Database Indexes

The schema includes optimized indexes for:
- `order_number` (unique lookup)
- `buyer_id` (buyer's order list)
- `seller_id` (seller's order list - future)
- `order_status` (status filtering)
- `payment_status` (payment filtering)
- `created_at` (date sorting)

## API Response Times

Expected response times (with proper indexing):
- Create Order: < 500ms
- Get Orders List: < 200ms
- Get Order Detail: < 100ms
- Upload Payment Proof: < 300ms
- Cancel Order: < 400ms

## Summary

The E-Commerce Order Management System provides a robust, transaction-safe ordering system with:
- ✅ Per-seller checkout
- ✅ Automatic stock locking (First Come First Served)
- ✅ Manual transfer payment with proof upload
- ✅ Order cancellation with stock restoration
- ✅ Complete order tracking
- ✅ Buyer-friendly API

All operations are wrapped in database transactions to ensure data integrity and prevent race conditions.
