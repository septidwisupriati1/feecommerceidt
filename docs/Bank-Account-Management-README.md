# Bank Account Management API - Documentation

API untuk mengelola rekening bank dan e-wallet penjual (seller) di platform e-commerce.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Testing Guide](#testing-guide)

---

## Overview

Fitur ini memungkinkan penjual (seller) untuk:
- Menambahkan rekening bank atau e-wallet
- Melihat daftar rekening yang dimiliki
- Mengedit informasi rekening
- Menghapus rekening
- Mengatur rekening utama (primary)

### Business Rules
1. **Satu bank, satu rekening**: Penjual hanya bisa menambahkan satu rekening per bank
2. **E-wallet multiple**: Penjual bisa menambahkan multiple e-wallet (GoPay, OVO, Dana, dll)
3. **Primary account**: Hanya satu rekening yang bisa menjadi primary
4. **Auto-delete cascade**: Jika seller profile dihapus, semua rekening ikut terhapus

---

## Features

### 1. Authentication Required
Semua endpoint memerlukan token JWT yang valid dari seller.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

### 2. Supported Bank Types
- **Bank Tradisional**: BCA, Mandiri, BNI, BRI, BTN, Permata, Danamon, CIMB, dll
- **E-Wallet**: GoPay, OVO, Dana, ShopeePay, LinkAja, dll

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/ecommerce/bank-accounts
```

---

### 1. Create Bank Account

**Endpoint:** `POST /api/ecommerce/bank-accounts`

**Headers:**
```
Authorization: Bearer <seller_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "account_type": "bank",
  "is_primary": true
}
```

**Field Validation:**
- `bank_name`: Required, string (max 100 chars)
- `account_number`: Required, string (max 50 chars)
- `account_name`: Required, string (max 100 chars)
- `account_type`: Required, enum: "bank" | "e_wallet"
- `is_primary`: Optional, boolean (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Bank account created successfully",
  "data": {
    "account_id": 1,
    "seller_id": 1,
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "John Doe",
    "account_type": "bank",
    "is_primary": true,
    "created_at": "2025-11-06T02:00:00.000Z",
    "updated_at": "2025-11-06T02:00:00.000Z"
  }
}
```

**Error Responses:**

*400 Bad Request - Missing Fields:*
```json
{
  "success": false,
  "message": "Bank name, account number, account name, and account type are required"
}
```

*400 Bad Request - Invalid Account Type:*
```json
{
  "success": false,
  "message": "Invalid account_type. Must be 'bank' or 'e_wallet'"
}
```

*409 Conflict - Duplicate Account:*
```json
{
  "success": false,
  "message": "You already have an account with this bank and account number"
}
```

---

### 2. Get All Bank Accounts (Current Seller)

**Endpoint:** `GET /api/ecommerce/bank-accounts`

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Query Parameters:**
- `account_type` (optional): Filter by type ("bank" or "e_wallet")

**Example:**
```
GET /api/ecommerce/bank-accounts
GET /api/ecommerce/bank-accounts?account_type=bank
GET /api/ecommerce/bank-accounts?account_type=e_wallet
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bank accounts retrieved successfully",
  "data": [
    {
      "account_id": 1,
      "seller_id": 1,
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "John Doe",
      "account_type": "bank",
      "is_primary": true,
      "created_at": "2025-11-06T02:00:00.000Z",
      "updated_at": "2025-11-06T02:00:00.000Z"
    },
    {
      "account_id": 2,
      "seller_id": 1,
      "bank_name": "GoPay",
      "account_number": "081234567890",
      "account_name": "John Doe",
      "account_type": "e_wallet",
      "is_primary": false,
      "created_at": "2025-11-06T02:05:00.000Z",
      "updated_at": "2025-11-06T02:05:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 3. Get Single Bank Account by ID

**Endpoint:** `GET /api/ecommerce/bank-accounts/:id`

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Example:**
```
GET /api/ecommerce/bank-accounts/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bank account retrieved successfully",
  "data": {
    "account_id": 1,
    "seller_id": 1,
    "bank_name": "BCA",
    "account_number": "1234567890",
    "account_name": "John Doe",
    "account_type": "bank",
    "is_primary": true,
    "created_at": "2025-11-06T02:00:00.000Z",
    "updated_at": "2025-11-06T02:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bank account not found or you don't have permission"
}
```

---

### 4. Update Bank Account

**Endpoint:** `PUT /api/ecommerce/bank-accounts/:id`

**Headers:**
```
Authorization: Bearer <seller_token>
Content-Type: application/json
```

**Request Body (All fields optional):**
```json
{
  "bank_name": "BCA Digital",
  "account_number": "9876543210",
  "account_name": "John Doe Updated",
  "account_type": "bank",
  "is_primary": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bank account updated successfully",
  "data": {
    "account_id": 1,
    "seller_id": 1,
    "bank_name": "BCA Digital",
    "account_number": "9876543210",
    "account_name": "John Doe Updated",
    "account_type": "bank",
    "is_primary": false,
    "created_at": "2025-11-06T02:00:00.000Z",
    "updated_at": "2025-11-06T02:10:00.000Z"
  }
}
```

**Error Responses:**

*404 Not Found:*
```json
{
  "success": false,
  "message": "Bank account not found or you don't have permission"
}
```

*409 Conflict - Duplicate:*
```json
{
  "success": false,
  "message": "Another account with this bank and account number already exists"
}
```

---

### 5. Set Primary Bank Account

**Endpoint:** `PATCH /api/ecommerce/bank-accounts/:id/set-primary`

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Example:**
```
PATCH /api/ecommerce/bank-accounts/2/set-primary
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Primary bank account updated successfully",
  "data": {
    "account_id": 2,
    "seller_id": 1,
    "bank_name": "Mandiri",
    "account_number": "1122334455",
    "account_name": "John Doe",
    "account_type": "bank",
    "is_primary": true,
    "created_at": "2025-11-06T02:00:00.000Z",
    "updated_at": "2025-11-06T02:15:00.000Z"
  }
}
```

**Note:** Ketika satu rekening di-set primary, rekening lain otomatis menjadi non-primary.

---

### 6. Delete Bank Account

**Endpoint:** `DELETE /api/ecommerce/bank-accounts/:id`

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Example:**
```
DELETE /api/ecommerce/bank-accounts/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bank account not found or you don't have permission"
}
```

---

## Testing Guide

### Prerequisites
1. Seller account sudah terdaftar
2. Login sebagai seller untuk mendapatkan JWT token
3. Token disimpan untuk digunakan di header Authorization

### Test Scenarios

#### Scenario 1: Create Bank Account (Bank)
```bash
POST http://localhost:3000/api/ecommerce/bank-accounts
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "account_type": "bank",
  "is_primary": true
}
```

**Expected:** Account created with status 201

#### Scenario 2: Create E-Wallet Account
```bash
POST http://localhost:3000/api/ecommerce/bank-accounts
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "bank_name": "GoPay",
  "account_number": "081234567890",
  "account_name": "John Doe",
  "account_type": "e_wallet",
  "is_primary": false
}
```

**Expected:** E-wallet account created successfully

#### Scenario 3: Duplicate Bank Account (Should Fail)
```bash
POST http://localhost:3000/api/ecommerce/bank-accounts
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "bank_name": "BCA",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "account_type": "bank"
}
```

**Expected:** Error 409 - Account already exists

#### Scenario 4: Get All Accounts
```bash
GET http://localhost:3000/api/ecommerce/bank-accounts
Authorization: Bearer <seller_token>
```

**Expected:** List of all bank accounts

#### Scenario 5: Filter by Type
```bash
GET http://localhost:3000/api/ecommerce/bank-accounts?account_type=bank
Authorization: Bearer <seller_token>
```

**Expected:** Only bank accounts returned

#### Scenario 6: Update Account
```bash
PUT http://localhost:3000/api/ecommerce/bank-accounts/1
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "account_number": "9876543210",
  "account_name": "John Doe Updated"
}
```

**Expected:** Account updated successfully

#### Scenario 7: Set Primary Account
```bash
PATCH http://localhost:3000/api/ecommerce/bank-accounts/2/set-primary
Authorization: Bearer <seller_token>
```

**Expected:** Account 2 becomes primary, others become non-primary

#### Scenario 8: Delete Account
```bash
DELETE http://localhost:3000/api/ecommerce/bank-accounts/1
Authorization: Bearer <seller_token>
```

**Expected:** Account deleted successfully

#### Scenario 9: Access Other Seller's Account (Should Fail)
```bash
GET http://localhost:3000/api/ecommerce/bank-accounts/999
Authorization: Bearer <seller_token>
```

**Expected:** 404 Not Found (if account belongs to another seller)

---

## Database Schema

```prisma
model bank_accounts {
  account_id     Int             @id @default(autoincrement())
  seller_id      Int
  bank_name      String          @db.VarChar(100)
  account_number String          @db.VarChar(50)
  account_name   String          @db.VarChar(100)
  account_type   bank_account_type @default(bank)
  is_primary     Boolean         @default(false)
  created_at     DateTime        @default(now())
  updated_at     DateTime        @default(now())
  
  seller         seller_profiles @relation(fields: [seller_id], references: [seller_id], onDelete: Cascade)

  @@unique([seller_id, bank_name, account_number])
  @@index([seller_id])
  @@index([is_primary])
  @@index([bank_name])
}

enum bank_account_type {
  bank
  e_wallet
}
```

---

## Security Notes

1. **Authentication**: Semua endpoint memerlukan valid JWT token
2. **Authorization**: Seller hanya bisa mengakses rekening miliknya sendiri
3. **Validation**: Input validation untuk mencegah SQL injection dan XSS
4. **Unique Constraint**: Mencegah duplikasi rekening (seller_id + bank_name + account_number)

---

## Error Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (not a seller) |
| 404 | Not Found |
| 409 | Conflict (duplicate account) |
| 500 | Internal Server Error |

---

## Next Steps

1. ✅ Database schema created
2. ✅ Controller implemented
3. ✅ Routes configured
4. ✅ API tested
5. 🔄 Integration with payment system (future)
6. 🔄 Bank account verification (future)

---

**Created:** November 6, 2025  
**Version:** 1.0  
**Module:** E-Commerce - Bank Account Management
