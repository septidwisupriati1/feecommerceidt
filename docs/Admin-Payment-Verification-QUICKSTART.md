# Admin Payment Verification - Quick Start Guide

## 🚀 Quick Setup

### 1. Database Migration
The migration has been applied. New fields added to `orders` table:
- `payment_verified_by` - Admin user_id who verified
- `payment_verified_at` - Verification timestamp
- `payment_rejected_at` - Rejection timestamp  
- `payment_rejection_reason` - Reason for rejection

New payment_status values:
- `pending_verification` - Waiting for admin review
- `rejected` - Payment rejected, can re-upload

### 2. API Endpoints
All registered at: `/api/ecommerce/admin/payments`

### 3. Testing

**Automated Test:**
```bash
node modules/ecommerce/tests/testjs/test-admin-payment-verification.js
```

**Manual Test:**
Use REST file: `modules/ecommerce/tests/adminPaymentVerification.rest`

---

## 📋 Complete Flow

### Step 1: Buyer Creates Order & Uploads Payment Proof
```http
POST /api/ecommerce/buyer/orders/checkout
Authorization: Bearer <buyer_token>

{
  "seller_id": 1,
  "shipping_address_id": 1,
  "bank_account_id": 1
}
```

```http
POST /api/ecommerce/buyer/orders/:orderId/payment-proof
Authorization: Bearer <buyer_token>
Content-Type: multipart/form-data

payment_proof: [file]
```

**Result:** 
- `payment_status`: `pending_verification`
- `order_status`: `pending`

### Step 2: Admin Views Pending Payments
```http
GET /api/ecommerce/admin/payments/pending?status=pending_verification
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 1,
        "order_number": "ORD-20241112-00001",
        "payment_status": "pending_verification",
        "payment_proof": "/uploads/payment-proofs/proof.jpg",
        "total_amount": 150000,
        "buyer": {...},
        "seller": {...}
      }
    ],
    "pagination": {...}
  }
}
```

### Step 3A: Admin Approves Payment ✅
```http
PUT /api/ecommerce/admin/payments/:orderId/approve
Authorization: Bearer <admin_token>

{
  "admin_notes": "Pembayaran verified"
}
```

**Result:**
- `payment_status`: `paid`
- `order_status`: `processing`
- `paid_at`: timestamp
- `payment_verified_at`: timestamp

### Step 3B: Admin Rejects Payment ❌
```http
PUT /api/ecommerce/admin/payments/:orderId/reject
Authorization: Bearer <admin_token>

{
  "rejection_reason": "Bukti transfer tidak jelas"
}
```

**Result:**
- `payment_status`: `rejected`
- `order_status`: `pending`
- `payment_rejected_at`: timestamp
- `payment_rejection_reason`: saved

### Step 4: Buyer Re-uploads (If Rejected)
```http
POST /api/ecommerce/buyer/orders/:orderId/payment-proof
Authorization: Bearer <buyer_token>

payment_proof: [new_file]
```

**Result:**
- `payment_status`: `pending_verification` (back to review)
- Previous rejection data cleared
- Admin can review again

---

## 🔍 Filter Options

### By Status
```http
# Pending verification only (default)
GET /admin/payments/pending?status=pending_verification

# Rejected payments only
GET /admin/payments/pending?status=rejected

# All payments with proof uploaded
GET /admin/payments/pending?status=all
```

### By Seller
```http
GET /admin/payments/pending?seller_id=1
```

### Search
```http
GET /admin/payments/pending?search=ORD-20241112
```

### Pagination
```http
GET /admin/payments/pending?page=2&limit=20
```

---

## 🛡️ Security

- ✅ All admin endpoints require `authenticateToken` + `requireRole("admin")`
- ✅ Buyers can only upload proof for their own orders
- ✅ Admin actions tracked with user_id and timestamp
- ✅ File validation on upload (type, size)

---

## 📊 Status Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ BUYER: Create Order                             │
│ Status: unpaid / pending                        │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ BUYER: Upload Payment Proof                     │
│ Status: pending_verification / pending          │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      ↓                     ↓
┌──────────────┐    ┌──────────────┐
│ ADMIN APPROVE│    │ ADMIN REJECT │
└──────┬───────┘    └──────┬───────┘
       ↓                   ↓
┌──────────────┐    ┌──────────────┐
│ Status: paid │    │ Status:      │
│ Order:       │    │ rejected     │
│ processing   │    │              │
└──────────────┘    └──────┬───────┘
                            │
                            ↓
                    ┌──────────────┐
                    │ BUYER:       │
                    │ Re-upload    │
                    │ Proof        │
                    └──────┬───────┘
                           │
                           ↓
                    (Back to review)
```

---

## 🧪 Test Scenarios Covered

### Automated Test Suite
1. ✅ Admin, buyer, seller authentication
2. ✅ Order creation with payment proof upload
3. ✅ Admin views pending payments
4. ✅ Admin rejects payment
5. ✅ Buyer re-uploads after rejection
6. ✅ Admin approves payment
7. ✅ Filter by status (pending/rejected/all)
8. ✅ Pagination
9. ✅ Edge cases (no proof, no reason, non-admin access)

**Total: 19 tests**

Run: `node modules/ecommerce/tests/testjs/test-admin-payment-verification.js`

---

## 📝 Key Changes Summary

### Database Schema
- Added 4 new fields to `orders` table
- Added 2 new values to `payment_status` enum

### Controller
- Created `adminPaymentController.js` with 4 endpoints

### Routes
- Created `adminPaymentRoutes.js`
- Registered at `/api/ecommerce/admin/payments`

### Modified
- Updated `orderController.js` → `uploadPaymentProof()` function
  - Now sets status to `pending_verification` instead of `paid`
  - Allows re-upload if status is `rejected`

---

## 📖 Full Documentation

See complete API documentation:
`modules/ecommerce/docs/Admin-Payment-Verification-README.md`

---

## 🆘 Troubleshooting

**Issue:** "Not admin" error
- **Solution:** Ensure user has `is_admin = true` in database

**Issue:** "Order belum memiliki bukti pembayaran"
- **Solution:** Buyer must upload payment proof first

**Issue:** "Status saat ini: paid"
- **Solution:** Cannot approve/reject already processed payments

---

**Created:** November 12, 2024  
**Version:** 1.0.0
