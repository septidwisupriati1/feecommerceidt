# Admin Payment Verification API Documentation

## Overview
Admin payment verification system untuk memverifikasi pembayaran manual yang diupload oleh buyer. Admin dapat menyetujui atau menolak pembayaran dengan memberikan alasan penolakan.

## Flow Diagram
```
Buyer Upload Bukti → Status: pending_verification
                              ↓
                    Admin Review Payment
                    ↙                    ↘
            Approve                    Reject
               ↓                          ↓
    Status: paid                Status: rejected
    Order: processing          Order: pending (allow re-upload)
               ↓                          ↓
         Processing            Buyer dapat upload ulang
```

## Base URL
```
/api/ecommerce/admin/payments
```

## Authentication
**All endpoints require:**
- Valid JWT token in Authorization header
- Admin role (`is_admin = true`)

---

## Endpoints

### 1. Get Pending Payments (List)
Mendapatkan daftar order yang menunggu verifikasi pembayaran.

**Endpoint:** `GET /api/ecommerce/admin/payments/pending`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | pending_verification | Filter by payment status: `pending_verification`, `rejected`, `all` |
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | - | Search by order_number or recipient_name |
| seller_id | number | - | Filter by specific seller |

**Request Example:**
```http
GET /api/ecommerce/admin/payments/pending?status=pending_verification&page=1&limit=20
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar pembayaran berhasil diambil",
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_number": "ORD-20241112-00001",
        "payment_status": "pending_verification",
        "payment_proof": "/uploads/payment-proofs/proof-123.jpg",
        "payment_rejected_at": null,
        "payment_rejection_reason": null,
        "order_status": "pending",
        "total_amount": 150000,
        "created_at": "2024-11-12T10:30:00.000Z",
        "buyer": {
          "user_id": 5,
          "name": "John Doe",
          "email": "buyer@example.com"
        },
        "seller": {
          "seller_id": 2,
          "store_name": "Toko Elektronik",
          "owner_name": "Jane Seller",
          "owner_email": "seller@example.com"
        },
        "items_count": 2,
        "items": [
          {
            "product_name": "Laptop Gaming",
            "quantity": 1,
            "price": 120000,
            "subtotal": 120000
          },
          {
            "product_name": "Mouse Wireless",
            "quantity": 1,
            "price": 30000,
            "subtotal": 30000
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 10
    }
  }
}
```

---

### 2. Get Payment Detail
Mendapatkan detail lengkap pembayaran untuk review.

**Endpoint:** `GET /api/ecommerce/admin/payments/:orderId`

**URL Parameters:**
- `orderId` (required): Order ID

**Request Example:**
```http
GET /api/ecommerce/admin/payments/1
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Detail pembayaran berhasil diambil",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20241112-00001",
    "order_status": "pending",
    "payment_status": "pending_verification",
    "payment_method": "manual_transfer",
    "payment_proof": "/uploads/payment-proofs/proof-123.jpg",
    "paid_at": null,
    "payment_verified_at": null,
    "payment_rejected_at": null,
    "payment_rejection_reason": null,
    "verified_by": null,
    "subtotal": 150000,
    "shipping_cost": 15000,
    "total_amount": 165000,
    "buyer": {
      "user_id": 5,
      "name": "John Doe",
      "email": "buyer@example.com",
      "phone": "081234567890"
    },
    "seller": {
      "seller_id": 2,
      "store_name": "Toko Elektronik",
      "owner_name": "Jane Seller",
      "owner_email": "seller@example.com",
      "owner_phone": "089876543210"
    },
    "bank_account": {
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "Jane Seller",
      "account_type": "bank"
    },
    "shipping_address": {
      "recipient_name": "John Doe",
      "recipient_phone": "081234567890",
      "full_address": "Jl. Sudirman No. 123, Kelurahan A, Kecamatan B, Kota C, Provinsi D 12345"
    },
    "items": [
      {
        "product_name": "Laptop Gaming",
        "variant": "Color: Black",
        "price": 120000,
        "quantity": 1,
        "subtotal": 120000
      }
    ],
    "buyer_notes": "Mohon dikemas dengan bubble wrap",
    "seller_notes": null,
    "created_at": "2024-11-12T10:30:00.000Z",
    "updated_at": "2024-11-12T11:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```

---

### 3. Approve Payment
Menyetujui pembayaran manual. Status order akan berubah menjadi "processing".

**Endpoint:** `PUT /api/ecommerce/admin/payments/:orderId/approve`

**URL Parameters:**
- `orderId` (required): Order ID

**Request Body (Optional):**
```json
{
  "admin_notes": "Pembayaran verified. Transfer sesuai nominal."
}
```

**Request Example:**
```http
PUT /api/ecommerce/admin/payments/1/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "admin_notes": "Pembayaran verified"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil disetujui. Order status: Diproses",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20241112-00001",
    "payment_status": "paid",
    "order_status": "processing",
    "paid_at": "2024-11-12T12:00:00.000Z",
    "verified_at": "2024-11-12T12:00:00.000Z"
  }
}
```

**Error Responses:**

**404 - Order Not Found:**
```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```

**400 - No Payment Proof:**
```json
{
  "success": false,
  "message": "Order belum memiliki bukti pembayaran"
}
```

**400 - Invalid Status:**
```json
{
  "success": false,
  "message": "Pembayaran tidak dapat disetujui. Status saat ini: paid"
}
```

---

### 4. Reject Payment
Menolak pembayaran manual dengan alasan. Buyer dapat upload ulang bukti pembayaran baru.

**Endpoint:** `PUT /api/ecommerce/admin/payments/:orderId/reject`

**URL Parameters:**
- `orderId` (required): Order ID

**Request Body:**
```json
{
  "rejection_reason": "Bukti transfer tidak jelas / Nominal tidak sesuai / Bank tujuan salah"
}
```

**Request Example:**
```http
PUT /api/ecommerce/admin/payments/1/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rejection_reason": "Bukti transfer tidak jelas. Mohon upload ulang dengan foto yang lebih jelas."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pembayaran ditolak. Pembeli dapat mengupload bukti pembayaran baru",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20241112-00001",
    "payment_status": "rejected",
    "order_status": "pending",
    "rejected_at": "2024-11-12T12:00:00.000Z",
    "rejection_reason": "Bukti transfer tidak jelas. Mohon upload ulang dengan foto yang lebih jelas."
  }
}
```

**Error Responses:**

**400 - Missing Rejection Reason:**
```json
{
  "success": false,
  "message": "Alasan penolakan wajib diisi"
}
```

**404 - Order Not Found:**
```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```

**400 - No Payment Proof:**
```json
{
  "success": false,
  "message": "Order belum memiliki bukti pembayaran"
}
```

**400 - Invalid Status:**
```json
{
  "success": false,
  "message": "Pembayaran tidak dapat ditolak. Status saat ini: paid"
}
```

---

## Payment Status Flow

### Status Transitions

```
unpaid → (buyer upload) → pending_verification
                                ↓
                    ┌───────────┴────────────┐
                    ↓                        ↓
            (admin approve)          (admin reject)
                    ↓                        ↓
                  paid                   rejected
                    ↓                        ↓
             Order: processing      (buyer can re-upload)
                                            ↓
                                  pending_verification
```

### Status Descriptions

| Status | Description | Order Status | Actions Available |
|--------|-------------|--------------|-------------------|
| `unpaid` | Belum ada bukti pembayaran | `pending` | Buyer: Upload proof |
| `pending_verification` | Menunggu verifikasi admin | `pending` | Admin: Approve/Reject |
| `paid` | Pembayaran disetujui | `processing` | Seller: Process order |
| `rejected` | Pembayaran ditolak | `pending` | Buyer: Re-upload proof |
| `refunded` | Pembayaran dikembalikan | `cancelled` | - |

---

## Updated Buyer Upload Flow

### Upload Payment Proof (Modified)
**Endpoint:** `POST /api/ecommerce/buyer/orders/:orderId/payment-proof`

**Changes:**
- Payment status changes to `pending_verification` (not `paid`)
- Order status remains `pending` (not `paid`)
- Can re-upload if status is `rejected`
- Clears previous rejection data on re-upload

**Request Example:**
```http
POST /api/ecommerce/buyer/orders/1/payment-proof
Authorization: Bearer <buyer_token>
Content-Type: multipart/form-data

payment_proof: [file]
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20241112-00001",
    "payment_status": "pending_verification",
    "order_status": "pending",
    "payment_proof": "/uploads/payment-proofs/proof-123.jpg"
  }
}
```

---

## Database Schema Updates

### New Fields in `orders` Table

```prisma
model orders {
  // ... existing fields
  
  // Payment Verification (Admin)
  payment_verified_by      Int?         // Admin user_id yang verifikasi
  payment_verified_at      DateTime?    @db.DateTime(0)
  payment_rejected_at      DateTime?    @db.DateTime(0)
  payment_rejection_reason String?      @db.Text  // Alasan ditolak oleh admin
  
  // ... rest of fields
}
```

### Updated Enums

```prisma
enum payment_status {
  unpaid
  pending_verification  // NEW
  paid
  rejected             // NEW
  refunded
}
```

---

## Filter Options

### Status Filter Examples

**Get all pending verifications:**
```http
GET /api/ecommerce/admin/payments/pending?status=pending_verification
```

**Get all rejected payments:**
```http
GET /api/ecommerce/admin/payments/pending?status=rejected
```

**Get all (including verified):**
```http
GET /api/ecommerce/admin/payments/pending?status=all
```

**Filter by seller:**
```http
GET /api/ecommerce/admin/payments/pending?status=pending_verification&seller_id=2
```

**Search by order number or name:**
```http
GET /api/ecommerce/admin/payments/pending?search=ORD-20241112
```

---

## Admin Dashboard Integration

### Recommended UI Flow

1. **Payment Queue Page**
   - Display list of `pending_verification` orders
   - Show payment proof image/file
   - Filter by status, seller, date
   - Search functionality

2. **Detail Review Page**
   - Full order details
   - Payment proof viewer (image/PDF)
   - Bank account details for verification
   - Approve/Reject buttons
   - Text area for rejection reason

3. **Rejected Payments Page**
   - List of rejected orders
   - Show rejection reason
   - Track if buyer re-uploaded

---

## Testing Guide

See automated testing file:
```
modules/ecommerce/tests/testjs/test-admin-payment-verification.js
```

Run tests:
```bash
node modules/ecommerce/tests/testjs/test-admin-payment-verification.js
```

---

## Security Notes

1. **Admin Authorization**: All endpoints check for admin role
2. **File Validation**: Payment proofs validated on upload
3. **Audit Trail**: All admin actions tracked with timestamps and user IDs
4. **Re-upload Protection**: Only allowed if status is `rejected` or `unpaid`

---

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details"
}
```

Common HTTP Status Codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (no token or invalid token)
- `403`: Forbidden (not admin)
- `404`: Not Found (order doesn't exist)
- `500`: Internal Server Error

---

## Related Documentation

- [Order Management README](./Order-Management-README.md) - Buyer order flow
- [Bank Account Management](./Bank-Account-README.md) - Bank account setup
- [Upload Middleware](./Upload-Middleware-README.md) - File upload configuration

---

## Support

For issues or questions, contact the development team.

**Last Updated:** November 12, 2024
**Version:** 1.0.0
