# Guest Product Reviews API Documentation

## Overview
API untuk mengelola ulasan produk dari Guest (pengguna yang tidak login). Guest dapat memberikan rating (1-5 bintang) dan deskripsi ulasan untuk produk.

## Features
- ✅ Guest dapat posting ulasan tanpa login
- ✅ Rating 1-5 bintang
- ✅ Deskripsi ulasan (opsional)
- ✅ Tanggal ulasan otomatis
- ✅ Validasi email guest
- ✅ Cek duplikasi review (satu email hanya bisa review satu produk sekali)
- ✅ Status review dengan moderasi (pending/approved/rejected)
- ✅ Statistik rating produk
- ✅ Filter dan sort reviews

## Database Schema Changes

### Modified Table: `product_reviews`
```sql
-- Kolom yang diubah/ditambah:
user_id INT NULL,                    -- Sekarang opsional (NULL untuk guest)
guest_name VARCHAR(100) NULL,        -- Nama guest reviewer
guest_email VARCHAR(100) NULL,       -- Email guest reviewer
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',  -- Status moderasi

-- Index baru:
INDEX idx_review_guest_email (guest_email),
UNIQUE KEY unique_product_guest_review (product_id, guest_email)
```

## Migration Command
```bash
# Generate migration
npx prisma migrate dev --name add_guest_reviews --schema prisma/schema-ecommerce.prisma

# Apply migration
npx prisma migrate deploy --schema prisma/schema-ecommerce.prisma

# Generate client
npx prisma generate --schema prisma/schema-ecommerce.prisma
```

## API Endpoints

### 1. Create Guest Review
**POST** `/api/ecommerce/public/products/:productId/reviews`

Membuat ulasan baru untuk produk sebagai guest.

#### Request Body
```json
{
  "guest_name": "John Doe",
  "guest_email": "john.doe@example.com",
  "rating": 5,
  "review_text": "Produk sangat bagus! Kualitas premium." // Optional
}
```

#### Validation Rules
- `guest_name`: Required, string
- `guest_email`: Required, valid email format
- `rating`: Required, integer 1-5
- `review_text`: Optional, string

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Review submitted successfully. It will be visible after moderation.",
  "data": {
    "review_id": 1,
    "product_id": 1,
    "product_name": "Product Name",
    "guest_name": "John Doe",
    "rating": 5,
    "review_text": "Produk sangat bagus! Kualitas premium.",
    "status": "pending",
    "created_at": "2025-10-21T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
  "success": false,
  "message": "Name, email, and rating are required"
}
```

**400 Bad Request - Invalid Email**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**400 Bad Request - Invalid Rating**
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

**400 Bad Request - Duplicate Review**
```json
{
  "success": false,
  "message": "You have already reviewed this product"
}
```

**404 Not Found - Product Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 2. Get Product Reviews
**GET** `/api/ecommerce/public/products/:productId/reviews`

Mendapatkan semua review yang sudah disetujui untuk sebuah produk.

#### Query Parameters
- `page`: Number, default 1
- `limit`: Number, default 10
- `rating`: Number (1-5), filter by rating
- `sort`: String, options:
  - `latest` (default): Terbaru duluan
  - `oldest`: Terlama duluan
  - `highest`: Rating tertinggi duluan
  - `lowest`: Rating terendah duluan

#### Example Request
```
GET /api/ecommerce/public/products/1/reviews?page=1&limit=10&rating=5&sort=latest
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "review_id": 1,
        "reviewer_name": "John Doe",
        "reviewer_type": "guest",
        "rating": 5,
        "review_text": "Produk sangat bagus!",
        "review_date": "2025-10-21T10:30:00.000Z"
      },
      {
        "review_id": 2,
        "reviewer_name": "Jane Smith",
        "reviewer_type": "registered",
        "rating": 4,
        "review_text": "Bagus, sesuai deskripsi.",
        "review_date": "2025-10-20T15:20:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_reviews": 48,
      "limit": 10
    },
    "rating_summary": {
      "average_rating": 4.5,
      "total_reviews": 48,
      "rating_breakdown": {
        "5": 25,
        "4": 15,
        "3": 5,
        "2": 2,
        "1": 1
      }
    }
  }
}
```

---

### 3. Get Review Statistics
**GET** `/api/ecommerce/public/products/:productId/reviews/stats`

Mendapatkan statistik rating untuk sebuah produk.

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Product Name",
    "average_rating": 4.5,
    "total_reviews": 48,
    "rating_breakdown": {
      "5": 25,
      "4": 15,
      "3": 5,
      "2": 2,
      "1": 1
    },
    "rating_percentages": {
      "5": "52.1",
      "4": "31.3",
      "3": "10.4",
      "2": "4.2",
      "1": "2.1"
    }
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 4. Check Guest Review
**POST** `/api/ecommerce/public/products/:productId/reviews/check`

Mengecek apakah email guest sudah pernah review produk tertentu.

#### Request Body
```json
{
  "guest_email": "john.doe@example.com"
}
```

#### Success Response (200 OK) - Has Reviewed
```json
{
  "success": true,
  "data": {
    "has_reviewed": true,
    "review": {
      "review_id": 1,
      "rating": 5,
      "review_text": "Produk sangat bagus!",
      "status": "approved",
      "created_at": "2025-10-21T10:30:00.000Z"
    }
  }
}
```

#### Success Response (200 OK) - Not Reviewed
```json
{
  "success": true,
  "data": {
    "has_reviewed": false,
    "review": null
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Email is required"
}
```

---

## Business Logic

### Review Status Flow
1. **Guest submits review** → Status: `pending`
2. **Admin reviews** → 
   - Approve → Status: `approved` (visible to public)
   - Reject → Status: `rejected` (not visible)

### Duplicate Prevention
- Satu email guest hanya bisa review satu produk sekali
- Check dilakukan via unique constraint: `unique_product_guest_review (product_id, guest_email)`
- Email disimpan dalam lowercase untuk case-insensitive comparison

### Rating Validation
- Must be integer between 1-5
- Invalid values return 400 error

### Email Validation
- Must be valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Automatically converted to lowercase

---

## Frontend Integration Examples

### Submit Review Form
```javascript
async function submitGuestReview(productId, reviewData) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ecommerce/public/products/${productId}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_name: reviewData.name,
          guest_email: reviewData.email,
          rating: reviewData.rating,
          review_text: reviewData.text,
        }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      alert('Review submitted! It will be visible after moderation.');
      return data.data;
    } else {
      alert(data.message);
      return null;
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review');
    return null;
  }
}
```

### Check if Guest Already Reviewed
```javascript
async function checkGuestReview(productId, email) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ecommerce/public/products/${productId}/reviews/check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guest_email: email }),
      }
    );

    const data = await response.json();
    return data.data.has_reviewed;
  } catch (error) {
    console.error('Error checking review:', error);
    return false;
  }
}
```

### Load Product Reviews
```javascript
async function loadProductReviews(productId, page = 1, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: page,
      limit: 10,
      ...filters, // { rating: 5, sort: 'latest' }
    });

    const response = await fetch(
      `http://localhost:5000/api/ecommerce/public/products/${productId}/reviews?${params}`
    );

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error loading reviews:', error);
    return null;
  }
}
```

### Display Rating Statistics
```javascript
async function loadReviewStats(productId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ecommerce/public/products/${productId}/reviews/stats`
    );

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error loading stats:', error);
    return null;
  }
}
```

---

## Admin Features (To Be Implemented)

### Endpoints yang perlu ditambahkan di `adminRoutes.js`:

1. **GET** `/api/ecommerce/admin/reviews` - List all reviews (with filters)
2. **PUT** `/api/ecommerce/admin/reviews/:reviewId/approve` - Approve review
3. **PUT** `/api/ecommerce/admin/reviews/:reviewId/reject` - Reject review
4. **DELETE** `/api/ecommerce/admin/reviews/:reviewId` - Delete review
5. **GET** `/api/ecommerce/admin/reviews/pending` - Get pending reviews

---

## Testing

### Using REST Client (VS Code Extension)
File testing tersedia di: `modules/ecommerce/tests/Guest-Reviews-API.rest`

### Using cURL

#### Create Review
```bash
curl -X POST http://localhost:5000/api/ecommerce/public/products/1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "guest_name": "John Doe",
    "guest_email": "john.doe@example.com",
    "rating": 5,
    "review_text": "Produk sangat bagus!"
  }'
```

#### Get Reviews
```bash
curl http://localhost:5000/api/ecommerce/public/products/1/reviews
```

#### Get Stats
```bash
curl http://localhost:5000/api/ecommerce/public/products/1/reviews/stats
```

### Using Postman
Import collection dari file `Guest-Reviews-API.rest` atau buat manual sesuai dokumentasi.

---

## Security Considerations

1. **Rate Limiting**: Implementasikan rate limiting untuk mencegah spam reviews
2. **Email Verification**: Pertimbangkan untuk mengirim email konfirmasi sebelum review dipublish
3. **Content Moderation**: Review guest harus di-moderate sebelum visible
4. **Spam Detection**: Implementasi deteksi spam/bot reviews
5. **Sanitization**: Input text harus di-sanitize untuk mencegah XSS

---

## Future Enhancements

1. **Image Upload**: Guest dapat upload foto produk dalam review
2. **Helpful Votes**: User lain dapat vote review sebagai "helpful"
3. **Reply System**: Seller dapat reply ke review
4. **Review Verification**: Badge "Verified Purchase" untuk review dari pembeli aktual
5. **AI Moderation**: Auto-detect spam/inappropriate content
6. **Email Notifications**: Notifikasi ke seller saat ada review baru
7. **Review Analytics**: Dashboard analytics untuk seller

---

## Troubleshooting

### Common Issues

**Q: Review tidak muncul setelah submit?**
A: Review guest memiliki status "pending" dan perlu approval admin terlebih dahulu.

**Q: Error "You have already reviewed this product"?**
A: Satu email hanya bisa review satu produk sekali. Gunakan email berbeda atau hubungi admin.

**Q: Error "Invalid email format"?**
A: Pastikan format email valid (contoh: user@domain.com)

**Q: Rating tidak tersimpan dengan benar?**
A: Pastikan rating adalah integer antara 1-5.

---

## Support

Untuk pertanyaan atau issue, silakan hubungi tim development atau buat issue di repository.

**Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Author:** Development Team
