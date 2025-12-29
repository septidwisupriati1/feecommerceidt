# E-Commerce Store Management API

Complete store management system for sellers with automatic store creation upon email verification.

---

## Base URL

```
http://localhost:5000/api/ecommerce
```

---

## Table of Contents

1. [Overview](#overview)
2. [Get Store Information](#1-get-store-information)
3. [Update Store Information](#2-update-store-information)
4. [Upload Store Photo](#3-upload-store-photo)
5. [Delete Store Photo](#4-delete-store-photo)
6. [Testing](#testing)
7. [Error Codes](#error-codes)

---

## Overview

### Store Creation Process

**Automatic Store Creation:**
- ✅ Store is automatically created when seller verifies their email
- ✅ Initial store has placeholder data (can be updated later)
- ✅ 1 Seller = 1 Store (one-to-one relationship)

**Access Requirements:**
- ✅ User must be registered as a **Seller**
- ✅ Email must be **verified**
- ✅ JWT authentication required

---

## Authentication Required

All store endpoints require:
1. JWT token in Authorization header
2. User must have "seller" role
3. Email must be verified

```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Get Store Information

Retrieve complete store information for the current seller.

**Endpoint:** `GET /store`

**Access:** Protected (requires JWT token + seller role + verified email)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Store information retrieved successfully",
  "data": {
    "seller_id": 1,
    "user_id": 5,
    "store_name": "Toko Elektronik Jaya",
    "store_photo": "/uploads/store-photo/store-5-1697452800000.jpg",
    "location": {
      "province": "Jawa Barat",
      "regency": "Kota Bandung",
      "district": "Coblong",
      "village": "Dago",
      "postal_code": "40135"
    },
    "full_address": "Jl. Dago No. 123, Bandung",
    "about_store": "Toko elektronik terpercaya dengan berbagai produk berkualitas",
    "statistics": {
      "rating_average": 4.8,
      "total_reviews": 150,
      "total_products": 45,
      "total_views": 3200
    },
    "created_at": "2025-10-01T02:30:00.000Z",
    "updated_at": "2025-10-15T08:45:00.000Z"
  }
}
```

**Initial Store (After Email Verification):**
```json
{
  "success": true,
  "message": "Store information retrieved successfully",
  "data": {
    "seller_id": 1,
    "user_id": 5,
    "store_name": "Store of seller1",
    "store_photo": null,
    "location": {
      "province": "-",
      "regency": "-",
      "district": "-",
      "village": "-",
      "postal_code": "00000"
    },
    "full_address": "-",
    "about_store": null,
    "statistics": {
      "rating_average": 0,
      "total_reviews": 0,
      "total_products": 0,
      "total_views": 0
    },
    "created_at": "2025-10-16T10:00:00.000Z",
    "updated_at": "2025-10-16T10:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized - No token:
```json
{
  "success": false,
  "error": "No token provided"
}
```

403 Forbidden - Not a seller:
```json
{
  "success": false,
  "error": "Only sellers can access store information"
}
```

403 Forbidden - Email not verified:
```json
{
  "success": false,
  "error": "Email verification required. Please verify your email first."
}
```

404 Not Found - Store not found:
```json
{
  "success": false,
  "error": "Store not found. Please contact support."
}
```

---

## 2. Update Store Information

Update store details (name, location, address, description).

**Endpoint:** `PUT /store`

**Access:** Protected (requires JWT token + seller role + verified email)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "store_name": "Toko Elektronik Jaya",
  "province": "Jawa Barat",
  "regency": "Kota Bandung",
  "district": "Coblong",
  "village": "Dago",
  "postal_code": "40135",
  "full_address": "Jl. Dago No. 123, Bandung, Jawa Barat",
  "about_store": "Toko elektronik terpercaya dengan berbagai produk berkualitas tinggi dan harga terjangkau"
}
```

**Fields:**
- `store_name` (optional) - Store name
- `province` (optional) - Province
- `regency` (optional) - Regency/City (Kabupaten/Kota)
- `district` (optional) - District (Kecamatan)
- `village` (optional) - Village/Urban Village (Kelurahan/Desa)
- `postal_code` (optional) - Postal code
- `full_address` (optional) - Complete address
- `about_store` (optional) - Store description

**Location Validation:**
If updating any location field (province, regency, district, village, postal_code), all location fields must be complete.

**Partial Update Examples:**

Update store name only:
```json
{
  "store_name": "Toko Baru Saya"
}
```

Update about store only:
```json
{
  "about_store": "Deskripsi toko yang baru"
}
```

Update location only (all fields required):
```json
{
  "province": "DKI Jakarta",
  "regency": "Jakarta Pusat",
  "district": "Menteng",
  "village": "Menteng",
  "postal_code": "10310"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Store information updated successfully",
  "data": {
    "seller_id": 1,
    "user_id": 5,
    "store_name": "Toko Elektronik Jaya",
    "store_photo": "/uploads/store-photo/store-5-1697452800000.jpg",
    "location": {
      "province": "Jawa Barat",
      "regency": "Kota Bandung",
      "district": "Coblong",
      "village": "Dago",
      "postal_code": "40135"
    },
    "full_address": "Jl. Dago No. 123, Bandung, Jawa Barat",
    "about_store": "Toko elektronik terpercaya dengan berbagai produk berkualitas tinggi dan harga terjangkau",
    "statistics": {
      "rating_average": 4.8,
      "total_reviews": 150,
      "total_products": 45,
      "total_views": 3200
    },
    "updated_at": "2025-10-16T03:15:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - Incomplete location:
```json
{
  "success": false,
  "error": "Complete location information required (province, regency, district, village, postal_code)"
}
```

403 Forbidden - Not a seller:
```json
{
  "success": false,
  "error": "Only sellers can update store information"
}
```

403 Forbidden - Email not verified:
```json
{
  "success": false,
  "error": "Email verification required. Please verify your email first."
}
```

404 Not Found - Store not found:
```json
{
  "success": false,
  "error": "Store not found. Please contact support."
}
```

**Activity Log:** Creates `STORE_UPDATED` activity log entry.

---

## 3. Upload Store Photo

Upload or replace store photo/logo.

**Endpoint:** `POST /store/photo`

**Access:** Protected (requires JWT token + seller role + verified email)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `store_photo` (required) - Image file

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)

**File Size Limit:** 5 MB

**Success Response (200):**
```json
{
  "success": true,
  "message": "Store photo uploaded successfully",
  "data": {
    "seller_id": 1,
    "store_name": "Toko Elektronik Jaya",
    "store_photo": "/uploads/store-photo/store-5-1697452800000.jpg",
    "updated_at": "2025-10-16T03:20:00.000Z"
  }
}
```

**Notes:**
- Old store photo is automatically deleted when uploading new one
- File is saved with unique name: `store-{userId}-{timestamp}.{ext}`
- Stored in: `uploads/store-photo/`

**Error Responses:**

400 Bad Request - No file:
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

400 Bad Request - Invalid file type:
```json
{
  "success": false,
  "error": "Error: File upload only supports the following filetypes - jpeg|jpg|png"
}
```

400 Bad Request - File too large:
```json
{
  "success": false,
  "error": "File too large. Maximum size is 5 MB"
}
```

403 Forbidden - Email not verified:
```json
{
  "success": false,
  "error": "Email verification required. Please verify your email first."
}
```

**Activity Log:** Creates `STORE_PHOTO_UPDATED` activity log entry.

---

## 4. Delete Store Photo

Remove current store photo.

**Endpoint:** `DELETE /store/photo`

**Access:** Protected (requires JWT token + seller role + verified email)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Store photo deleted successfully"
}
```

**Error Responses:**

400 Bad Request - No photo to delete:
```json
{
  "success": false,
  "error": "No store photo to delete"
}
```

403 Forbidden - Email not verified:
```json
{
  "success": false,
  "error": "Email verification required. Please verify your email first."
}
```

404 Not Found - Store not found:
```json
{
  "success": false,
  "error": "Store not found"
}
```

**Activity Log:** Creates `STORE_PHOTO_DELETED` activity log entry.

---

## Testing

### Quick Test Sequence

#### 1. Register as Seller
```http
POST http://localhost:5000/api/ecommerce/auth/register
Content-Type: application/json

{
  "username": "testseller",
  "email": "testseller@example.com",
  "password": "Seller123!",
  "full_name": "Test Seller",
  "role": "seller"
}
```

#### 2. Verify Email (Store Auto-Created)
```http
GET http://localhost:5000/api/ecommerce/auth/verify-email?token=<token-from-email>
```

**Response includes:**
```json
{
  "success": true,
  "message": "Email verified successfully! Your store has been created and is ready to be configured."
}
```

#### 3. Login
```http
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "testseller@example.com",
  "password": "Seller123!"
}
```

Save the token: `@token = YOUR_TOKEN_HERE`

---

#### 4. Get Store Information
```http
GET http://localhost:5000/api/ecommerce/store
Authorization: Bearer {{token}}
```

**Expected:** Blank store with placeholder data

---

#### 5. Update Store Information
```http
PUT http://localhost:5000/api/ecommerce/store
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "store_name": "Toko Elektronik Jaya",
  "province": "Jawa Barat",
  "regency": "Kota Bandung",
  "district": "Coblong",
  "village": "Dago",
  "postal_code": "40135",
  "full_address": "Jl. Dago No. 123, Bandung",
  "about_store": "Toko elektronik terpercaya"
}
```

---

#### 6. Upload Store Photo
```bash
curl -X POST http://localhost:5000/api/ecommerce/store/photo \
  -H "Authorization: Bearer <token>" \
  -F "store_photo=@/path/to/store-logo.jpg"
```

---

#### 7. Get Updated Store
```http
GET http://localhost:5000/api/ecommerce/store
Authorization: Bearer {{token}}
```

---

#### 8. Delete Store Photo
```http
DELETE http://localhost:5000/api/ecommerce/store/photo
Authorization: Bearer {{token}}
```

---

### Test Accounts

| Email | Password | Role | Email Verified | Store Created |
|-------|----------|------|----------------|---------------|
| seller1@ecommerce.com | Seller123! | Seller | ✅ Yes | ✅ Yes |
| seller2@ecommerce.com | Seller123! | Seller | ✅ Yes | ✅ Yes |
| admin@ecommerce.com | Admin123! | Admin | ✅ Yes | ❌ No |

---

### Automated Tests

Run comprehensive store management tests:
```bash
node test-ecommerce-store.js
```

**Test Coverage:**
- ✅ Get store information
- ✅ Update store (full and partial)
- ✅ Upload store photo
- ✅ Delete store photo
- ✅ Email verification check
- ✅ Seller role validation
- ✅ Error scenarios

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (Validation error, incomplete data) |
| 401 | Unauthorized (Invalid/missing token) |
| 403 | Forbidden (Not seller, email not verified) |
| 404 | Not Found (Store/user not found) |
| 500 | Internal Server Error |

---

## Security Features

### Access Control
- ✅ JWT authentication required
- ✅ Seller role validation
- ✅ Email verification check
- ✅ One store per seller (enforced by DB unique constraint)

### File Upload Security
- ✅ File type validation (only images)
- ✅ File size limit (5 MB)
- ✅ Unique filename generation
- ✅ Automatic cleanup of old files
- ✅ Path traversal prevention

### Activity Logging
All store actions are logged:
- `STORE_CREATED` - Store auto-created on email verification
- `STORE_UPDATED` - Store information updated
- `STORE_PHOTO_UPDATED` - Store photo uploaded
- `STORE_PHOTO_DELETED` - Store photo deleted

---

## Database Schema

### seller_profiles Table
```sql
seller_profiles
├── seller_id (PK)
├── user_id (FK, unique) - One store per seller
├── store_name
├── store_photo
├── province
├── regency
├── district
├── village
├── postal_code
├── full_address
├── about_store
├── rating_average (read-only)
├── total_reviews (read-only)
├── total_products (read-only)
├── total_views (read-only)
├── created_at
└── updated_at
```

**Read-Only Fields:**
- `rating_average` - Calculated from product reviews
- `total_reviews` - Count of all reviews
- `total_products` - Count of seller's products
- `total_views` - Total store/product views

---

## Store Creation Workflow

### Automatic Creation on Email Verification

```
1. User registers as Seller
   └─> User created with email_verified = false
   
2. User verifies email (clicks link)
   └─> email_verified = true
   └─> Auto-create blank store:
       • store_name = "Store of {username}"
       • location fields = "-" (placeholder)
       • postal_code = "00000"
       • full_address = "-"
       • about_store = null
   
3. Seller logs in
   └─> Can access store endpoints
   
4. Seller updates store information
   └─> Store ready for products
```

---

## Indonesian Location Data

### Location Hierarchy
```
Province (Provinsi)
└── Regency/City (Kabupaten/Kota)
    └── District (Kecamatan)
        └── Village/Urban Village (Kelurahan/Desa)
            └── Postal Code (Kode Pos)
```

### Example Locations

**Jakarta:**
```json
{
  "province": "DKI Jakarta",
  "regency": "Jakarta Pusat",
  "district": "Menteng",
  "village": "Menteng",
  "postal_code": "10310"
}
```

**Bandung:**
```json
{
  "province": "Jawa Barat",
  "regency": "Kota Bandung",
  "district": "Coblong",
  "village": "Dago",
  "postal_code": "40135"
}
```

**Surabaya:**
```json
{
  "province": "Jawa Timur",
  "regency": "Kota Surabaya",
  "district": "Gubeng",
  "village": "Airlangga",
  "postal_code": "60286"
}
```

---

## API Response Format

All endpoints return consistent JSON format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Common Use Cases

### 1. Setup Store After Registration
```
Register → Verify Email (store auto-created) → Update store info → Upload photo
```

### 2. Update Store Name Only
```json
{
  "store_name": "Nama Toko Baru"
}
```

### 3. Update Location
```json
{
  "province": "Jawa Barat",
  "regency": "Kota Bandung",
  "district": "Coblong",
  "village": "Dago",
  "postal_code": "40135"
}
```

### 4. Update Description Only
```json
{
  "about_store": "Deskripsi lengkap tentang toko"
}
```

### 5. Complete Store Setup
```json
{
  "store_name": "Toko Elektronik Jaya",
  "province": "Jawa Barat",
  "regency": "Kota Bandung",
  "district": "Coblong",
  "village": "Dago",
  "postal_code": "40135",
  "full_address": "Jl. Dago No. 123, Bandung",
  "about_store": "Toko elektronik terpercaya"
}
```

---

## Validation Rules

### Store Name
- Optional in update
- Any string allowed
- Recommended: 5-100 characters

### Location Fields
- If updating location, all 5 fields required:
  - province
  - regency
  - district
  - village
  - postal_code
- Cannot partially update location

### Full Address
- Optional
- Recommended: Complete street address

### About Store
- Optional
- Can be null or empty
- Recommended: 50-500 characters

### Store Photo
- Format: JPEG, PNG
- Max size: 5 MB
- One photo per store
- Automatically replaces old photo

---

## Troubleshooting

### Common Issues

**"Email verification required":**
- Verify your email first
- Check spam folder for verification email
- Request new verification email if needed

**"Only sellers can access store information":**
- Make sure you registered as "seller" role
- Admins cannot access store endpoints

**"Store not found":**
- Contact support (should auto-create on email verification)
- Check if email is verified

**"Complete location information required":**
- When updating location, provide all 5 fields
- Use "-" as placeholder if needed

**Store photo not uploading:**
- Check file size (max 5 MB)
- Use JPEG or PNG format
- Check authorization token

---

## Best Practices

### Store Setup
1. Verify email immediately after registration
2. Update store information before adding products
3. Upload professional store photo
4. Write clear, detailed store description
5. Keep location information accurate

### Store Information
1. Use real business name
2. Provide complete address
3. Update location if you move
4. Keep about_store informative
5. Update photo periodically

### Security
1. Never share JWT token
2. Logout when done
3. Update password regularly
4. Monitor activity logs
5. Report suspicious activity

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Get store: 100 per hour
- Update store: 10 per hour
- Upload photo: 5 per hour
- Delete photo: 3 per hour

---

## Version Information

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** ✅ Production Ready  
**Auto-Create:** ✅ Enabled on Email Verification

---

## Quick Reference

### All Endpoints

| Method | Endpoint | Description | Auth | Verified Email |
|--------|----------|-------------|------|----------------|
| GET | `/store` | Get store info | ✅ | ✅ |
| PUT | `/store` | Update store | ✅ | ✅ |
| POST | `/store/photo` | Upload photo | ✅ | ✅ |
| DELETE | `/store/photo` | Delete photo | ✅ | ✅ |

---

## Example cURL Commands

### Get Store
```bash
curl http://localhost:5000/api/ecommerce/store \
  -H "Authorization: Bearer <token>"
```

### Update Store
```bash
curl -X PUT http://localhost:5000/api/ecommerce/store \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "store_name": "Toko Baru",
    "about_store": "Deskripsi toko"
  }'
```

### Upload Store Photo
```bash
curl -X POST http://localhost:5000/api/ecommerce/store/photo \
  -H "Authorization: Bearer <token>" \
  -F "store_photo=@/path/to/logo.jpg"
```

### Delete Store Photo
```bash
curl -X DELETE http://localhost:5000/api/ecommerce/store/photo \
  -H "Authorization: Bearer <token>"
```

---

## Related Documentation

- [Authentication API](./README.md) - Register, Login, Verify Email
- [Profile Management API](./Profile-Management-API.md) - User profile CRUD
- [Product Management API](./Product-Management-API.md) - Manage products (coming soon)

---

**Need help?** Check the test files in `modules/ecommerce/tests/Store-Management.rest` for more examples.

**Ready to manage your store!** 🏪
