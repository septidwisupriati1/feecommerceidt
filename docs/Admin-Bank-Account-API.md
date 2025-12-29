# Admin Bank Account Management API

## 📋 Overview

API untuk mengelola rekening bank admin sebagai **escrow account** dalam alur pembayaran E-Commerce platform. Admin menggunakan rekening ini sebagai perantara pembayaran antara buyer dan seller.

### 🔄 Alur Pembayaran

```
Buyer → Transfer ke Admin Account → Admin Verify → Notify Seller
         ↓                                           ↓
    Payment Confirmed                         Ship Product
                                                     ↓
                                              Buyer Receive
                                                     ↓
                                            Buyer Confirm Receipt
                                                     ↓
                                        Admin Transfer to Seller
```

## 🎯 Key Features

- ✅ **CRUD Operations** - Admin dapat create, read, update, delete rekening
- ✅ **Single Active Account** - Hanya 1 rekening aktif pada satu waktu (escrow)
- ✅ **Auto-Switch** - Set rekening aktif otomatis menonaktifkan yang lain
- ✅ **Bank & E-Wallet Support** - Support bank transfer dan e-wallet
- ✅ **Buyer Access** - Buyer dapat melihat rekening aktif untuk transfer
- ✅ **Security** - Admin-only access untuk CRUD, buyer hanya read
- ✅ **Validation** - Duplicate prevention, required fields, type validation

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
   - [Get All Accounts](#1-get-all-admin-bank-accounts)
   - [Get Active Account](#2-get-active-admin-bank-account)
   - [Get Account by ID](#3-get-admin-bank-account-by-id)
   - [Create Account](#4-create-admin-bank-account)
   - [Update Account](#5-update-admin-bank-account)
   - [Set Active Account](#6-set-admin-bank-account-as-active)
   - [Delete Account](#7-delete-admin-bank-account)
3. [Buyer Endpoints](#buyer-endpoints)
   - [Get Payment Info](#get-payment-information)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Testing Guide](#testing-guide)

---

## 🔐 Authentication

All endpoints require authentication via JWT token in Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Roles
- **Admin**: Full access to all admin endpoints (CRUD)
- **Buyer**: Access to payment info endpoint (Read only)

---

## 🛠️ Admin Endpoints

Base URL: `/api/ecommerce/admin/bank-account`

All admin endpoints require admin role authentication.

---

### 1. Get All Admin Bank Accounts

Retrieve all admin bank accounts with optional filtering.

**Endpoint:** `GET /api/ecommerce/admin/bank-account`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `account_type` | String | No | Filter by type: `bank` or `e_wallet` |

**Request:**
```http
GET /api/ecommerce/admin/bank-account
Authorization: Bearer <ADMIN_TOKEN>
```

**Request with Filter:**
```http
GET /api/ecommerce/admin/bank-account?account_type=bank
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin bank accounts retrieved successfully",
  "data": [
    {
      "account_id": 1,
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "PT E-Commerce Indonesia",
      "account_type": "bank",
      "is_active": true,
      "notes": "Rekening utama untuk penerimaan pembayaran",
      "created_at": "2025-11-10T02:10:00.000Z",
      "updated_at": "2025-11-10T02:10:00.000Z"
    },
    {
      "account_id": 2,
      "bank_name": "Mandiri",
      "account_number": "9876543210",
      "account_name": "PT E-Commerce Indonesia",
      "account_type": "bank",
      "is_active": false,
      "notes": "Rekening backup",
      "created_at": "2025-11-10T02:10:00.000Z",
      "updated_at": "2025-11-10T02:10:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 2. Get Active Admin Bank Account

Retrieve the currently active admin bank account (used for payments).

**Endpoint:** `GET /api/ecommerce/admin/bank-account/active`

**Request:**
```http
GET /api/ecommerce/admin/bank-account/active
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Active admin bank account retrieved successfully",
  "data": {
    "account_id": 1,
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank",
    "is_active": true,
    "notes": "Rekening utama untuk penerimaan pembayaran",
    "created_at": "2025-11-10T02:10:00.000Z",
    "updated_at": "2025-11-10T02:10:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "No active admin bank account found. Please set an active account."
}
```

---

### 3. Get Admin Bank Account by ID

Retrieve a specific admin bank account by ID.

**Endpoint:** `GET /api/ecommerce/admin/bank-account/:accountId`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | Integer | Yes | Account ID |

**Request:**
```http
GET /api/ecommerce/admin/bank-account/1
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin bank account retrieved successfully",
  "data": {
    "account_id": 1,
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank",
    "is_active": true,
    "notes": "Rekening utama untuk penerimaan pembayaran",
    "created_at": "2025-11-10T02:10:00.000Z",
    "updated_at": "2025-11-10T02:10:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Admin bank account not found"
}
```

---

### 4. Create Admin Bank Account

Create a new admin bank account.

**Endpoint:** `POST /api/ecommerce/admin/bank-account`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank_name` | String | Yes | Bank or e-wallet name (e.g., "BCA", "GoPay") |
| `account_number` | String | Yes | Account number or phone number |
| `account_name` | String | Yes | Account holder name |
| `account_type` | Enum | No | `bank` or `e_wallet` (default: `bank`) |
| `is_active` | Boolean | No | Set as active account (default: `false`) |
| `notes` | String | No | Internal notes for admin |

**Request:**
```http
POST /api/ecommerce/admin/bank-account
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "bank_name": "BNI",
  "account_number": "1122334455",
  "account_name": "PT E-Commerce Indonesia",
  "account_type": "bank",
  "is_active": false,
  "notes": "Rekening tambahan untuk diversifikasi"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Admin bank account created successfully",
  "data": {
    "account_id": 3,
    "bank_name": "BNI",
    "account_number": "1122334455",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank",
    "is_active": false,
    "notes": "Rekening tambahan untuk diversifikasi",
    "created_at": "2025-11-10T02:15:00.000Z",
    "updated_at": "2025-11-10T02:15:00.000Z"
  }
}
```

**Business Rules:**
- ✅ If this is the **first account**, it will be set as active automatically
- ✅ If `is_active: true`, all other accounts will be deactivated
- ✅ Duplicate check: same `bank_name` + `account_number`

**Error Responses:**

`400 Bad Request` - Missing required fields:
```json
{
  "success": false,
  "error": "Bank name, account number, and account name are required"
}
```

`400 Bad Request` - Invalid account type:
```json
{
  "success": false,
  "error": "Invalid account type. Must be 'bank' or 'e_wallet'"
}
```

`400 Bad Request` - Duplicate account:
```json
{
  "success": false,
  "error": "This admin bank account already exists"
}
```

---

### 5. Update Admin Bank Account

Update an existing admin bank account.

**Endpoint:** `PUT /api/ecommerce/admin/bank-account/:accountId`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | Integer | Yes | Account ID to update |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank_name` | String | No | Bank or e-wallet name |
| `account_number` | String | No | Account number |
| `account_name` | String | No | Account holder name |
| `account_type` | Enum | No | `bank` or `e_wallet` |
| `notes` | String | No | Internal notes |

**Request:**
```http
PUT /api/ecommerce/admin/bank-account/1
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "account_name": "PT E-Commerce Indonesia (Updated)",
  "notes": "Rekening utama - updated"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin bank account updated successfully",
  "data": {
    "account_id": 1,
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "PT E-Commerce Indonesia (Updated)",
    "account_type": "bank",
    "is_active": true,
    "notes": "Rekening utama - updated",
    "created_at": "2025-11-10T02:10:00.000Z",
    "updated_at": "2025-11-10T02:20:00.000Z"
  }
}
```

**Error Responses:**

`404 Not Found`:
```json
{
  "success": false,
  "error": "Admin bank account not found"
}
```

`400 Bad Request` - Duplicate:
```json
{
  "success": false,
  "error": "This admin bank account already exists"
}
```

---

### 6. Set Admin Bank Account as Active

Set a specific admin bank account as active. This will automatically deactivate all other accounts.

**Endpoint:** `PATCH /api/ecommerce/admin/bank-account/:accountId/set-active`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | Integer | Yes | Account ID to set as active |

**Request:**
```http
PATCH /api/ecommerce/admin/bank-account/2/set-active
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin bank account set as active successfully",
  "data": {
    "account_id": 2,
    "bank_name": "Mandiri",
    "account_number": "9876543210",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank",
    "is_active": true,
    "notes": "Rekening backup",
    "created_at": "2025-11-10T02:10:00.000Z",
    "updated_at": "2025-11-10T02:25:00.000Z"
  }
}
```

**Business Rules:**
- ✅ Only **ONE account can be active** at a time
- ✅ All other accounts will be automatically deactivated
- ✅ This is the recommended way to switch active accounts

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Admin bank account not found"
}
```

---

### 7. Delete Admin Bank Account

Delete an admin bank account.

**Endpoint:** `DELETE /api/ecommerce/admin/bank-account/:accountId`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | Integer | Yes | Account ID to delete |

**Request:**
```http
DELETE /api/ecommerce/admin/bank-account/3
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Admin bank account deleted successfully"
}
```

**Business Rules:**
- ✅ Cannot delete if it's the **last account** (must have at least 1)
- ✅ If deleted account was active, the **oldest account** will become active
- ✅ Ensures system always has an active payment account

**Error Responses:**

`404 Not Found`:
```json
{
  "success": false,
  "error": "Admin bank account not found"
}
```

`400 Bad Request` - Last account:
```json
{
  "success": false,
  "error": "Cannot delete the last admin bank account. At least one account must exist."
}
```

---

## 💳 Buyer Endpoints

Base URL: `/api/ecommerce/buyer`

### Get Payment Information

Retrieve active admin bank account information for payment. This is used by buyers to know where to transfer payment.

**Endpoint:** `GET /api/ecommerce/buyer/payment-info`

**Authentication:** Required (Buyer role)

**Request:**
```http
GET /api/ecommerce/buyer/payment-info
Authorization: Bearer <BUYER_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment information retrieved successfully",
  "data": {
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank",
    "instructions": {
      "id": "Silakan transfer pembayaran Anda ke rekening berikut:",
      "en": "Please transfer your payment to the following account:"
    },
    "note": {
      "id": "Pastikan jumlah transfer sesuai dengan total pesanan Anda",
      "en": "Make sure the transfer amount matches your order total"
    }
  }
}
```

**Security Notes:**
- ✅ Only returns **active account** information
- ✅ **Limited fields** exposed (no account_id, notes, timestamps)
- ✅ Requires authentication (buyer must be logged in)
- ✅ Cannot access inactive accounts

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Payment information not available. Please contact support."
}
```

---

## 📊 Data Models

### Admin Bank Account Model

```javascript
{
  account_id: Integer,        // Primary key (auto-increment)
  bank_name: String(100),     // Bank or e-wallet name
  account_number: String(50), // Account number or phone
  account_name: String(100),  // Account holder name
  account_type: Enum,         // 'bank' or 'e_wallet'
  is_active: Boolean,         // Only ONE can be true
  notes: String (Text),       // Internal notes (optional)
  created_at: DateTime,       // Auto-generated
  updated_at: DateTime        // Auto-updated
}
```

### Account Type Enum

```javascript
enum bank_account_type {
  bank       // Traditional bank account
  e_wallet   // E-wallet (GoPay, OVO, Dana, etc.)
}
```

### Supported Banks & E-Wallets

**Banks:**
- BCA
- Mandiri
- BNI
- BRI
- CIMB Niaga
- Permata Bank
- etc.

**E-Wallets:**
- GoPay
- OVO
- DANA
- ShopeePay
- LinkAja
- etc.

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message here",
  "details": "Additional error details (development only)"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (no token) |
| `403` | Forbidden (wrong role) |
| `404` | Not Found |
| `500` | Internal Server Error |

### Common Error Messages

**Authentication Errors:**
```json
{
  "success": false,
  "error": "Access token required"
}
```

**Authorization Errors:**
```json
{
  "success": false,
  "error": "Admin access required"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Bank name, account number, and account name are required"
}
```

**Business Logic Errors:**
```json
{
  "success": false,
  "error": "Cannot delete the last admin bank account. At least one account must exist."
}
```

---

## 🧪 Testing Guide

### Prerequisites

1. **Admin Account:**
   - Email: `admin@ecommerce.com`
   - Password: `Admin123!`

2. **Buyer Account:**
   - Email: `buyer1@ecommerce.com`
   - Password: `Buyer123!`

### Test Scenarios

#### Scenario 1: Create Multiple Accounts

```bash
# 1. Login as admin
POST /api/ecommerce/auth/login
{"email": "admin@ecommerce.com", "password": "Admin123!"}

# 2. Create bank account
POST /api/ecommerce/admin/bank-account
{
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "PT E-Commerce Indonesia",
  "account_type": "bank"
}

# 3. Create e-wallet account
POST /api/ecommerce/admin/bank-account
{
  "bank_name": "GoPay",
  "account_number": "081234567890",
  "account_name": "PT E-Commerce Indonesia",
  "account_type": "e_wallet"
}

# 4. Get all accounts
GET /api/ecommerce/admin/bank-account
```

#### Scenario 2: Switch Active Account

```bash
# 1. Check current active account
GET /api/ecommerce/admin/bank-account/active

# 2. Set different account as active
PATCH /api/ecommerce/admin/bank-account/2/set-active

# 3. Verify only one active
GET /api/ecommerce/admin/bank-account
# Should show only account #2 with is_active: true
```

#### Scenario 3: Buyer Payment Flow

```bash
# 1. Login as buyer
POST /api/ecommerce/auth/login
{"email": "buyer1@ecommerce.com", "password": "Buyer123!"}

# 2. Get payment info
GET /api/ecommerce/buyer/payment-info
# Buyer sees active account info

# 3. Buyer transfers money to that account

# 4. Admin verifies payment (external process)

# 5. Admin processes order
```

#### Scenario 4: Update and Delete

```bash
# 1. Update account details
PUT /api/ecommerce/admin/bank-account/1
{
  "account_name": "PT E-Commerce Indonesia (Updated)",
  "notes": "Updated notes"
}

# 2. Create extra account for testing
POST /api/ecommerce/admin/bank-account
{
  "bank_name": "BNI",
  "account_number": "1122334455",
  "account_name": "Test Account",
  "account_type": "bank"
}

# 3. Delete test account
DELETE /api/ecommerce/admin/bank-account/3
```

### Testing with REST Client

Use the provided REST file: `modules/ecommerce/tests/Admin-Bank-Account-REST.rest`

1. Open in VS Code with REST Client extension
2. Run "Login as Admin" first
3. Run other requests in sequence
4. Variables `@adminToken` and `@buyerToken` auto-populated

### Manual Testing Checklist

- [ ] Admin can create bank account
- [ ] Admin can create e-wallet account
- [ ] System prevents duplicate accounts
- [ ] First account automatically becomes active
- [ ] Admin can switch active account
- [ ] Only one account is active at a time
- [ ] Admin can update account details
- [ ] Admin cannot delete last account
- [ ] Deleted active account auto-switches to next
- [ ] Buyer can get active payment info
- [ ] Buyer only sees limited fields
- [ ] Authentication required for all endpoints
- [ ] Admin role required for admin endpoints
- [ ] Error messages are clear and helpful

---

## 📝 Notes & Best Practices

### Security Considerations

1. **Admin Access Only** - Only admin can CRUD accounts
2. **Limited Buyer Access** - Buyer only sees necessary payment info
3. **No Sensitive Data** - Buyer doesn't see account_id, notes, timestamps
4. **Authentication Required** - All endpoints need valid JWT token
5. **Input Validation** - All inputs validated before processing

### Business Logic

1. **Single Active Account** - Only one account can be active (escrow)
2. **Minimum One Account** - System must always have at least one account
3. **Auto-Switch** - Deleting active account auto-activates next
4. **First Account Rule** - First account created is automatically active

### Data Integrity

1. **Unique Constraint** - bank_name + account_number must be unique
2. **Type Validation** - account_type must be 'bank' or 'e_wallet'
3. **Required Fields** - bank_name, account_number, account_name required
4. **Timestamps** - Auto-managed created_at and updated_at

### Payment Flow

```
1. Admin sets active payment account
2. Buyer checkout → Gets payment info
3. Buyer transfers to admin account
4. Admin verifies payment
5. Admin notifies seller
6. Seller ships product
7. Buyer confirms receipt
8. Admin transfers to seller account
```

---

## 🚀 Quick Start

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/ecommerce/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"Admin123!"}'

# 2. Get admin token from response, then get all accounts
curl -X GET http://localhost:5000/api/ecommerce/admin/bank-account \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# 3. Create new account
curl -X POST http://localhost:5000/api/ecommerce/admin/bank-account \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "PT E-Commerce Indonesia",
    "account_type": "bank"
  }'

# 4. Login as buyer
curl -X POST http://localhost:5000/api/ecommerce/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@ecommerce.com","password":"Buyer123!"}'

# 5. Get payment info
curl -X GET http://localhost:5000/api/ecommerce/buyer/payment-info \
  -H "Authorization: Bearer <BUYER_TOKEN>"
```

---

## 📞 Support

For issues or questions:
- Check error messages for specific details
- Verify authentication token is valid
- Ensure correct role (admin vs buyer)
- Check database for existing data
- Review console logs for debugging

---

**API Version:** 1.0  
**Last Updated:** November 10, 2025  
**Status:** ✅ Production Ready
