# Product Reviews API - Authenticated Users Only

## Deskripsi

Fitur ini memungkinkan pengguna yang sudah login (pembeli/penjual) untuk memberikan ulasan produk. Setiap ulasan harus menyertakan:

- Rating (1-5 bintang) - **WAJIB**
- Deskripsi ulasan - **WAJIB**
- Gambar produk - **WAJIB**
- Tanggal ulasan (otomatis)
- **Login/Autentikasi diperlukan**

## ⚠️ Perubahan Penting

**FITUR INI SUDAH DIMODIFIKASI** - Sebelumnya fitur ini mengizinkan guest untuk posting review. Sekarang:

✅ Hanya pengguna yang sudah login (authenticated users) yang dapat posting review  
✅ Guest/visitor **TIDAK DAPAT** lagi memposting review  
✅ Reviewer_name dan reviewer_email diambil otomatis dari data user yang login  
✅ Upload gambar masih wajib untuk setiap ulasan  
✅ Validasi rating 1-5  
✅ Pencegahan duplikasi ulasan (satu user hanya bisa review satu produk sekali)  
✅ Auto-update rating produk dan seller  

## Database Schema

### Table: `product_reviews`

**Columns:**

```sql
review_id       INT AUTO_INCREMENT PRIMARY KEY
product_id      INT NOT NULL        -- FK ke products
user_id         INT NULL            -- FK ke users (NULL untuk legacy guest reviews)
reviewer_name   VARCHAR(100) NULL   -- Untuk legacy guest reviews
reviewer_email  VARCHAR(100) NULL   -- Untuk legacy guest reviews
rating          INT NOT NULL        -- Rating 1-5
review_text     TEXT                -- Deskripsi ulasan
review_image    TEXT                -- URL gambar review (WAJIB)
status          ENUM                -- approved/pending/rejected
created_at      DATETIME
updated_at      DATETIME
```

**Indexes:**

- `idx_review_email` - Index pada reviewer_email
- `idx_review_user` - Index pada user_id
- `idx_review_product` - Index pada product_id

## API Endpoints

### 1. Create Product Review (Authenticated Users Only)

**POST** `/api/ecommerce/products/:productId/reviews`

**Access:** 🔒 **Authenticated Users Only** (Pembeli/Penjual yang sudah login)

**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rating | integer | Yes | Rating 1-5 |
| review_text | string | Yes | Deskripsi ulasan |
| review_image | file | Yes | File gambar (JPG, PNG, GIF, WebP, max 5MB) |

⚠️ **CATATAN:** `reviewer_name` dan `reviewer_email` **TIDAK PERLU** dikirim lagi. Data ini akan diambil otomatis dari user yang login.

**Success Response (201):**

```json
{
  "success": true,
  "message": "Review posted successfully",
  "data": {
    "review_id": 1,
    "product_id": 1,
    "product_name": "Product Name",
    "user_id": 123,
    "reviewer_name": "John Doe",
    "reviewer_email": "john.doe@example.com",
    "rating": 5,
    "review_text": "Produk sangat bagus! Kualitas premium...",
    "review_image": "/uploads/reviews/review_1_1234567890_product-review.jpg",
    "status": "approved",
    "created_at": "2024-10-24T10:00:00.000Z"
  }
}
```

**Error Responses:**

**401 - Unauthorized (No Token):**

```json
{
  "success": false,
  "error": "Authentication required. Please login to post a review."
}
```

**401 - Unauthorized (Invalid Token):**

```json
{
  "error": "Invalid token",
  "message": "The provided token is invalid"
}
```

**401 - Unauthorized (Token Expired):**

```json
{
  "error": "Token expired",
  "message": "Your session has expired, please login again"
}
```

**400 - Missing Required Fields:**

```json
{
  "success": false,
  "error": "Rating and review text are required"
}
```

**400 - Missing Image:**

```json
{
  "success": false,
  "error": "Review image is required"
}
```

**400 - Invalid Rating:**

```json
{
  "success": false,
  "error": "Rating must be between 1 and 5"
}
```

**400 - Duplicate Review:**

```json
{
  "success": false,
  "error": "You have already reviewed this product"
}
```

**404 - Product Not Found:**

```json
{
  "success": false,
  "error": "Product not found"
}
```

**404 - User Not Found:**

```json
{
  "success": false,
  "error": "User not found"
}
```

**400 - Inactive Product:**

```json
{
  "success": false,
  "error": "Cannot review inactive product"
}
```

---

### 2. Get Product Reviews

**GET** `/api/ecommerce/products/:productId/reviews`

**Access:** Public (No authentication required)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Product reviews retrieved successfully",
  "data": {
    "product": {
      "product_id": 1,
      "name": "Product Name",
      "rating_average": 4.5,
      "total_reviews": 10
    },
    "reviews": [
      {
        "review_id": 1,
        "product_id": 1,
        "user_id": 123,
        "reviewer_name": "John Doe",
        "reviewer_email": "john.doe@example.com",
        "rating": 5,
        "review_text": "Produk sangat bagus!",
        "review_image": "/uploads/reviews/review_1.jpg",
        "status": "approved",
        "created_at": "2024-10-24T10:00:00.000Z"
      }
    ],
    "rating_distribution": {
      "5": 6,
      "4": 2,
      "3": 1,
      "2": 1,
      "1": 0
    },
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_reviews": 10,
      "has_next": false,
      "has_previous": false
    }
  }
}
```

## File Structure

```
modules/ecommerce/
├── controllers/
│   └── reviewController.js           # ✅ MODIFIED - createAuthenticatedReview
├── routes/
│   └── reviewRoutes.js               # ✅ MODIFIED - Added authenticateToken middleware
├── middleware/
│   └── reviewImageMiddleware.js      # Unchanged
└── tests/
    └── Product-Reviews.rest          # ⚠️ NEEDS UPDATE
```

## Testing dengan Postman/REST Client

### 1. Login Terlebih Dahulu

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 123,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Simpan token** dari response untuk digunakan di request berikutnya.

---

### 2. Create Review dengan Token

**POST** `/api/ecommerce/products/1/reviews`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Body (form-data):**
- `rating`: 5
- `review_text`: Produk sangat bagus! Kualitas premium, pengiriman cepat
- `review_image`: (pilih file gambar)

⚠️ **JANGAN kirim** `reviewer_name` dan `reviewer_email` lagi!

---

### 3. Testing Scenarios

#### ✅ Scenario 1: Berhasil Post Review

**Request:**
```
POST /api/ecommerce/products/1/reviews
Authorization: Bearer <valid_token>

Form data:
- rating: 5
- review_text: Produk bagus
- review_image: [file]
```

**Expected:** Status 201, review berhasil dibuat

---

#### ❌ Scenario 2: Tanpa Token (Guest)

**Request:**
```
POST /api/ecommerce/products/1/reviews

Form data:
- rating: 5
- review_text: Produk bagus
- review_image: [file]
```

**Expected:** Status 401, "Access token required"

---

#### ❌ Scenario 3: Token Expired

**Request:**
```
POST /api/ecommerce/products/1/reviews
Authorization: Bearer <expired_token>

Form data:
- rating: 5
- review_text: Produk bagus
- review_image: [file]
```

**Expected:** Status 401, "Token expired"

---

#### ❌ Scenario 4: Duplikasi Review

**Request:**
```
POST /api/ecommerce/products/1/reviews
Authorization: Bearer <valid_token>

User sudah pernah review produk ini sebelumnya
```

**Expected:** Status 400, "You have already reviewed this product"

---

#### ❌ Scenario 5: Tanpa Gambar

**Request:**
```
POST /api/ecommerce/products/1/reviews
Authorization: Bearer <valid_token>

Form data:
- rating: 5
- review_text: Produk bagus
(tidak ada review_image)
```

**Expected:** Status 400, "Review image is required"

---

## Migration Notes

### Untuk Developer

Jika Anda memiliki data review guest yang lama:

1. **Data guest reviews yang lama tetap aman** - Kolom `reviewer_name` dan `reviewer_email` masih ada di database
2. **Review baru** akan menggunakan `user_id` dan mengambil data dari tabel `users`
3. **Tidak perlu migrasi data** - Kedua format review dapat coexist

### Database Query Example

**Menampilkan semua review (guest + authenticated):**

```sql
SELECT 
  r.review_id,
  r.product_id,
  COALESCE(u.full_name, r.reviewer_name) as reviewer_name,
  COALESCE(u.email, r.reviewer_email) as reviewer_email,
  r.rating,
  r.review_text,
  r.review_image,
  r.status,
  r.created_at
FROM product_reviews r
LEFT JOIN users u ON r.user_id = u.user_id
WHERE r.product_id = 1 AND r.status = 'approved'
ORDER BY r.created_at DESC;
```

## Security Considerations

✅ **Authentication Required** - Hanya user yang login dapat post review  
✅ **Token Validation** - JWT token divalidasi setiap request  
✅ **User Validation** - Memastikan user_id valid dan ada di database  
✅ **Duplicate Prevention** - Satu user hanya bisa review satu produk sekali  
✅ **File Upload Security** - File type dan size validation  
✅ **SQL Injection Prevention** - Menggunakan Prisma ORM  

## Troubleshooting

### Problem: "Access token required"

**Solution:** Pastikan Anda mengirim Authorization header:
```
Authorization: Bearer <your_token>
```

### Problem: "Token expired"

**Solution:** Login ulang untuk mendapatkan token baru

### Problem: "User not found"

**Solution:** 
- Pastikan user_id di token valid
- Pastikan user belum dihapus dari database

### Problem: "You have already reviewed this product"

**Solution:** 
- Satu user hanya bisa review produk sekali
- Gunakan user/akun lain untuk testing
- Atau hapus review sebelumnya dari database

## Summary

| Aspek | Sebelum Modifikasi | Setelah Modifikasi |
|-------|-------------------|-------------------|
| **Access** | Public (Guest) | 🔒 Authenticated Only |
| **Required Fields** | rating, review_text, review_image, reviewer_name, reviewer_email | rating, review_text, review_image |
| **User Data** | Manual input | Auto dari token |
| **Middleware** | None | authenticateToken |
| **Function Name** | createGuestReview | createAuthenticatedReview |
| **Duplicate Check** | By email | By user_id |

## Changelog

### Version 2.0 (Authenticated Reviews)

**Modified:**
- ✅ Controller: `createGuestReview` → `createAuthenticatedReview`
- ✅ Route: Added `authenticateToken` middleware
- ✅ Validation: Removed email validation, added user validation
- ✅ Logic: Changed from guest_email to user_id for duplicate check
- ✅ Response: Returns user data from database instead of manual input

**Backward Compatibility:**
- ✅ Old guest reviews data still accessible
- ✅ GET endpoint still works without authentication
- ✅ Database schema supports both types

---

**Last Updated:** 2024-11-11  
**Status:** ✅ Production Ready  
**Breaking Changes:** ⚠️ Yes - POST endpoint now requires authentication
