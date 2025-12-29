# API Transfer Dana ke Seller (Admin)

## 📋 Overview

API ini memungkinkan **ADMIN** untuk melihat daftar order yang siap ditransfer dan menandai bahwa dana sudah ditransfer ke seller. Setelah ditandai, status order berubah menjadi `completed`.

---

## 🎯 Business Logic

### Priority Queue System

Order yang **PERTAMA KALI** status `delivered` → **PALING ATAS** di list admin (sorted by `delivered_at` ASC).

**SLA Transfer: Maksimal 3 Hari**

- 🔴 **OVERDUE**: > 3 hari sejak delivered (Priority tinggi)
- 🟡 **NORMAL**: 1-3 hari sejak delivered
- 🟢 **NEW**: < 1 hari sejak delivered

**Catatan Penting:**

- Admin **TETAP BISA** transfer kapan saja (no blocking)
- SLA 3 hari hanya sebagai **warning/indicator**, bukan hard block
- Seller yang sudah lama menunggu dapat prioritas visual lebih tinggi

---

## 📍 Endpoints

### 1. GET `/api/ecommerce/admin/orders/transfer-summary`

**Deskripsi**: Summary statistik order yang siap ditransfer

**Authentication**: Required (JWT Token)  
**Role**: `admin` only

**Response**:

```json
{
  "success": true,
  "message": "Summary transfer berhasil diambil",
  "data": {
    "ready_for_transfer": {
      "total": 5,
      "overdue": 2,
      "normal": 2,
      "new": 1,
      "total_amount": 25000000
    },
    "completed_today": 3
  }
}
```

---

### 2. GET `/api/ecommerce/admin/orders/ready-for-transfer`

**Deskripsi**: List order yang ready untuk ditransfer (status: `delivered`)

**Authentication**: Required (JWT Token)  
**Role**: `admin` only

**Query Parameters**:

| Parameter   | Type   | Default | Description                               |
| ----------- | ------ | ------- | ----------------------------------------- |
| `priority`  | string | all     | Filter: `overdue`, `normal`, `new`, `all` |
| `seller_id` | number | -       | Filter by seller ID                       |
| `page`      | number | 1       | Halaman (minimal: 1)                      |
| `limit`     | number | 10      | Items per page (min: 1, max: 100)         |

**Response**:

```json
{
  "success": true,
  "message": "Daftar order siap ditransfer berhasil diambil",
  "data": {
    "orders": [
      {
        "order_id": 3,
        "order_number": "ORD-20251105-00003",
        "order_status": "delivered",
        "payment_status": "paid",
        "delivered_at": "2025-11-08T10:00:00.000Z",
        "days_since_delivered": 6,
        "hours_since_delivered": 148,
        "transfer_priority": "overdue",
        "seller": {
          "seller_id": 1,
          "store_name": "Toko Elektronik Jaya",
          "store_photo": "...",
          "email": "seller1@ecommerce.com",
          "bank_account": {
            "bank_name": "BCA",
            "account_number": "1234567890",
            "account_name": "Toko Elektronik"
          }
        },
        "amount": {
          "subtotal": 5000000,
          "shipping_cost": 50000,
          "total_amount": 5050000,
          "transfer_amount": 5050000
        },
        "items_summary": {
          "total_items": 2,
          "total_quantity": 3
        },
        "created_at": "2025-11-05T08:00:00.000Z"
      },
      {
        "order_id": 5,
        "order_number": "ORD-20251106-00005",
        "delivered_at": "2025-11-11T08:00:00.000Z",
        "days_since_delivered": 3,
        "transfer_priority": "normal",
        "seller": {...},
        "amount": {...}
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "total_pages": 1
    },
    "summary": {
      "total": 5,
      "overdue": 2,
      "normal": 2,
      "new": 1
    }
  }
}
```

**Sorting**: Orders diurutkan berdasarkan `delivered_at` ASC (oldest first) - Seller yang paling lama menunggu muncul paling atas.

---

### 3. POST `/api/ecommerce/admin/orders/:orderId/mark-transferred`

**Deskripsi**: Tandai order sudah ditransfer (delivered → completed)

**Authentication**: Required (JWT Token)  
**Role**: `admin` only

**Path Parameters**:

| Parameter | Type           | Description                |
| --------- | -------------- | -------------------------- |
| `orderId` | number, string | Order ID atau Order Number |

**Request Body**:

```json
// NO BODY REQUIRED - Transfer notes auto-generated dari bank account seller
```

**Auto-Generated Transfer Notes:**

```
Transfer via [BANK_NAME] ke rekening [ACCOUNT_NUMBER] a.n [ACCOUNT_NAME]
```

Contoh: "Transfer via BCA ke rekening 1234567890 a.n Toko Elektronik Jaya"

**Validasi**:

- ✅ Order status = `delivered`
- ✅ Payment status = `paid`
- ❌ **TIDAK ADA** blocking 3 hari (admin tetap bisa transfer)

**Response Success (200)**:

```json
{
  "success": true,
  "message": "Order berhasil ditandai sudah ditransfer dan diselesaikan",
  "data": {
    "order_id": 5,
    "order_number": "ORD-20251106-00005",
    "order_status": "completed",
    "previous_status": "delivered",
    "completed_at": "2025-11-14T10:30:00.000Z",
    "transfer_info": {
      "delivered_at": "2025-11-11T08:00:00.000Z",
      "days_since_delivered": 3,
      "hours_since_delivered": 74,
      "transferred_on_time": true,
      "sla_met": true,
      "max_days_sla": 3,
      "notes": "Transfer via BCA ke rekening 1234567890 a.n Toko Elektronik Jaya",
      "bank_details": {
        "bank_name": "BCA",
        "account_number": "1234567890",
        "account_name": "Toko Elektronik Jaya"
      }
    },
    "seller_info": {
      "seller_id": 2,
      "store_name": "Toko Elektronik",
      "store_photo": "...",
      "transfer_amount": 5500000
    },
    "admin_info": {
      "admin_id": 1,
      "admin_name": "Admin User",
      "admin_email": "admin@ecommerce.com"
    },
    "items_summary": {
      "total_items": 2,
      "total_quantity": 3
    }
  }
}
```

**Response Error - Status Bukan Delivered (400)**:

```json
{
  "success": false,
  "message": "Order tidak dapat ditandai sudah ditransfer. Status saat ini: processing. Order harus berstatus 'delivered' terlebih dahulu.",
  "current_status": "processing"
}
```

**Response Error - Payment Not Paid (400)**:

```json
{
  "success": false,
  "message": "Order tidak dapat ditransfer. Payment status: unpaid. Pembayaran harus sudah lunas (paid).",
  "payment_status": "unpaid"
}
```

**Response Error - Not Found (404)**:

```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```

---

## 🔄 Business Flow

```
Flow Status Order:
pending → paid → processing → shipped → delivered → completed
                                              ↑           ↑
                                          (buyer)     (admin)
```

**Timeline Lengkap:**

1. Buyer buat order → `pending`
2. Buyer upload bukti bayar → `paid`
3. Admin verifikasi pembayaran
4. Seller konfirmasi & proses → `processing`
5. Seller kirim barang (input tracking) → `shipped`
6. **Buyer konfirmasi terima barang** → `delivered`
7. **Admin transfer dana ke seller** → `completed` ← **API INI**

---

## 🎨 Priority Indicators

```javascript
// Frontend reference
const getPriorityBadge = (days) => {
  if (days > 3) {
    return {
      label: "OVERDUE",
      color: "red",
      icon: "🔴",
      urgency: "high",
    };
  }
  if (days >= 1) {
    return {
      label: "NORMAL",
      color: "yellow",
      icon: "🟡",
      urgency: "medium",
    };
  }
  return {
    label: "NEW",
    color: "green",
    icon: "🟢",
    urgency: "low",
  };
};
```

---

## 🧪 Testing Guide

### Prerequisites

1. Server running di `http://localhost:5000`
2. Login sebagai admin untuk mendapatkan token
3. Ada order dengan status `delivered` di database

### Test Cases

#### ✅ Test 1: Get Transfer Summary

```http
GET /api/ecommerce/admin/orders/transfer-summary
Authorization: Bearer <admin_token>
```

**Expected**: Summary dengan counts dan total amount

---

#### ✅ Test 2: Get Orders Ready for Transfer

```http
GET /api/ecommerce/admin/orders/ready-for-transfer
Authorization: Bearer <admin_token>
```

**Expected**: List orders dengan priority labels, sorted oldest first

---

#### ✅ Test 3: Filter by Priority (Overdue)

```http
GET /api/ecommerce/admin/orders/ready-for-transfer?priority=overdue
Authorization: Bearer <admin_token>
```

**Expected**: Hanya order yang > 3 hari

---

#### ✅ Test 4: Mark Order as Transferred (Success)

```http
POST /api/ecommerce/admin/orders/ORD-20251106-00005/mark-transferred
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "transfer_notes": "Transfer via BCA"
}
```

**Expected**:

- Status code: 200
- `order_status` berubah ke `completed`
- `completed_at` terisi
- `transferred_on_time` = true/false based on days

---

#### ❌ Test 5: Mark Order - Status Bukan Delivered

```http
POST /api/ecommerce/admin/orders/ORD-20251111-00004/mark-transferred
Authorization: Bearer <admin_token>
```

**Expected**:

- Status code: 400
- Error message menjelaskan status requirement

---

#### ❌ Test 6: Mark Order - Unauthorized

```http
POST /api/ecommerce/admin/orders/5/mark-transferred
```

**Expected**: 401 Unauthorized

---

#### ❌ Test 7: Mark Order - Not Admin Role

Login as buyer/seller, then:

```http
POST /api/ecommerce/admin/orders/5/mark-transferred
Authorization: Bearer <buyer_token>
```

**Expected**: 403 Forbidden

---

## 📊 Database Changes

### Update Query

```sql
UPDATE orders
SET
  order_status = 'completed',
  completed_at = NOW(),
  updated_at = NOW()
WHERE order_id = ?;
```

### Field yang Terpengaruh

| Field          | Before      | After             |
| -------------- | ----------- | ----------------- |
| `order_status` | `delivered` | `completed`       |
| `completed_at` | `NULL`      | Current timestamp |
| `updated_at`   | Old value   | Current timestamp |

---

## 🔐 Security

1. **Authentication**: JWT Token required
2. **Authorization**: Role `admin` only
3. **Audit Trail**: Admin ID dan timestamp tercatat
4. **Validation**:
   - Status must be `delivered`
   - Payment must be `paid`
   - Order must exist

---

## 💡 Future Enhancements

1. **Batch Transfer**: Transfer multiple orders sekaligus
2. **Transfer Proof Upload**: Admin upload bukti transfer
3. **Auto-notification**: Kirim notif ke seller setelah transfer
4. **Commission Calculation**: Potong komisi platform otomatis
5. **Bank Integration**: Auto transfer via bank API
6. **Transfer History**: Log semua transfer dengan detail
7. **Approval Workflow**: Require approval untuk overdue transfers

---

## 🚀 Related Endpoints

**After transfer completed, seller can:**

1. View completed orders: `GET /api/ecommerce/seller/orders?status=completed`
2. Generate invoice: `GET /api/ecommerce/seller/orders/:id/invoice`
3. Download payout report: `GET /api/ecommerce/seller/payouts`

---

## ✅ Implementation Checklist

- [x] Controller functions created
- [x] Routes registered
- [x] Authentication middleware applied
- [x] Role middleware applied (admin only)
- [x] Status validation implemented
- [x] Priority calculation implemented
- [x] Sorting by delivered_at ASC
- [x] Database update implemented
- [x] Response format standardized
- [x] Error handling completed
- [x] REST Testing file created
- [x] Documentation created

---

## 📞 Support

**Testing File**: `REST Testing/Admin-Order-Transfer.rest`  
**Controller**: `modules/ecommerce/controllers/adminOrderController.js`  
**Routes**: `modules/ecommerce/routes/adminOrderRoutes.js`

Untuk pertanyaan atau issue, hubungi Backend Developer Team.
