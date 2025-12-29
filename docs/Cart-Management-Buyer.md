# 🛒 Cart Management API - COMPLETE DOCUMENTATION

## ✅ Status: SELESAI & TESTED
**Tanggal:** 4 Januari 2025  
**Developer:** Backend Team  
**API Version:** 1.0

---

## 📋 Ringkasan Fitur

✅ **CRUD Complete:**
- ✅ Create: Tambah item ke cart (dengan/tanpa variant)
- ✅ Read: Lihat isi cart (GROUPED BY SELLER_ID)
- ✅ Update: Ubah quantity item di cart
- ✅ Delete: Hapus item, hapus per seller, kosongkan cart

✅ **Fitur Tambahan:**
- ✅ Auto grouping by seller_id
- ✅ Subtotal per seller & Grand Total
- ✅ Public product browsing (tanpa auth)
- ✅ Stock validation
- ✅ Variant support

---

## 🔧 Technical Stack

```json
{
  "database": "MySQL (ecommerce_db)",
  "orm": "Prisma",
  "auth": "JWT Bearer Token",
  "framework": "Express.js",
  "port": 5000
}
```

---

## 📊 Database Schema

### Table: `carts`
```sql
CREATE TABLE carts (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Table: `cart_items`
```sql
CREATE TABLE cart_items (
  cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
  UNIQUE KEY unique_cart_product_variant (cart_id, product_id, variant_id)
);
```

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000/api/ecommerce/buyer
```

### Authentication
Semua cart endpoints **WAJIB** menggunakan JWT Token kecuali product browsing.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📖 API Documentation

### 1. 🛍️ Browse Products (Public - No Auth)

**GET** `/api/ecommerce/buyer/products`

**Description:** Lihat daftar produk tanpa login

**Query Parameters:**
- `page` (optional): Halaman (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Cari nama produk
- `category_id` (optional): Filter by kategori

**Response Success (200):**
```json
{
  "success": true,
  "message": "Produk berhasil dimuat",
  "data": {
    "products": [
      {
        "product_id": 11,
        "name": "Smartphone Samsung Galaxy",
        "price": 8000000,
        "stock": 50,
        "image": "https://example.com/smartphone.jpg",
        "seller": {
          "seller_id": 2,
          "store_name": "Toko Elektronik Jaya"
        },
        "variants": [
          {
            "variant_id": 1,
            "variant_name": "Warna",
            "variant_value": "Hitam",
            "price_adjust": 0
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 3,
      "totalPages": 1
    }
  }
}
```

---

### 2. 🛍️ Product Detail (Public - No Auth)

**GET** `/api/ecommerce/buyer/products/:product_id`

**Description:** Lihat detail produk termasuk stock & variants

**Response Success (200):**
```json
{
  "success": true,
  "message": "Detail produk berhasil dimuat",
  "data": {
    "product_id": 11,
    "name": "Smartphone Samsung Galaxy",
    "description": "Smartphone terbaru dengan kamera 108MP",
    "price": 8000000,
    "stock": 50,
    "status": "active",
    "images": [
      {
        "image_url": "https://example.com/smartphone.jpg",
        "is_primary": true
      }
    ],
    "seller": {
      "seller_id": 2,
      "store_name": "Toko Elektronik Jaya",
      "rating_average": 4.8,
      "total_reviews": 120
    },
    "variants": [
      {
        "variant_id": 1,
        "variant_name": "Warna",
        "variant_value": "Hitam",
        "price_adjust": 0,
        "stock_adjust": 0
      },
      {
        "variant_id": 2,
        "variant_name": "Warna",
        "variant_value": "Putih",
        "price_adjust": 100000,
        "stock_adjust": -5
      }
    ]
  }
}
```

---

### 3. ➕ Add Item to Cart

**POST** `/api/ecommerce/buyer/cart`

**Auth:** Required (Bearer Token)

**Description:** Tambah produk ke keranjang (seller_id otomatis dari produk)

**Request Body:**
```json
{
  "product_id": 11,
  "quantity": 2,
  "variant_id": 1  // Optional - jika produk punya variant
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan ke keranjang",
  "data": {
    "cart_item_id": 15,
    "product_id": 11,
    "product_name": "Smartphone Samsung Galaxy",
    "variant": {
      "variant_id": 1,
      "variant_name": "Warna",
      "variant_value": "Hitam"
    },
    "quantity": 2,
    "price": 8000000,
    "total_price": 16000000,
    "seller": {
      "seller_id": 2,
      "store_name": "Toko Elektronik Jaya"
    }
  }
}
```

**Error Responses:**

**400 - Product Not Found:**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan atau tidak aktif"
}
```

**400 - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Stock tidak mencukupi. Stock tersedia: 50"
}
```

**400 - Invalid Quantity:**
```json
{
  "success": false,
  "message": "Quantity harus minimal 1"
}
```

---

### 4. 👁️ View Cart (Grouped by Seller)

**GET** `/api/ecommerce/buyer/cart`

**Auth:** Required (Bearer Token)

**Description:** Lihat isi keranjang yang OTOMATIS dikelompokkan per seller

**Response Success (200):**
```json
{
  "success": true,
  "message": "Keranjang berhasil dimuat",
  "data": {
    "cart_id": 1,
    "user_id": 5,
    "items_by_seller": [
      {
        "seller_id": 2,
        "seller_name": "Toko Elektronik Jaya",
        "seller_location": "Jakarta Pusat, DKI Jakarta",
        "items": [
          {
            "cart_item_id": 15,
            "product_id": 11,
            "product_name": "Smartphone Samsung Galaxy",
            "product_image": "https://example.com/smartphone.jpg",
            "variant": {
              "variant_id": 1,
              "variant_name": "Warna",
              "variant_value": "Hitam"
            },
            "quantity": 2,
            "price": 8000000,
            "subtotal": 16000000
          },
          {
            "cart_item_id": 16,
            "product_id": 12,
            "product_name": "Laptop ASUS ROG",
            "product_image": "https://example.com/laptop.jpg",
            "variant": null,
            "quantity": 1,
            "price": 15000000,
            "subtotal": 15000000
          }
        ],
        "seller_subtotal": 31000000
      },
      {
        "seller_id": 3,
        "seller_name": "Fashion Store Indonesia",
        "seller_location": "Bandung, Jawa Barat",
        "items": [
          {
            "cart_item_id": 17,
            "product_id": 13,
            "product_name": "Kemeja Formal Pria",
            "product_image": "https://example.com/kemeja.jpg",
            "variant": null,
            "quantity": 3,
            "price": 250000,
            "subtotal": 750000
          }
        ],
        "seller_subtotal": 750000
      }
    ],
    "summary": {
      "total_items": 3,
      "total_sellers": 2,
      "grand_total": 31750000
    },
    "created_at": "2025-01-04T10:30:00.000Z",
    "updated_at": "2025-01-04T10:35:00.000Z"
  }
}
```

**Empty Cart (200):**
```json
{
  "success": true,
  "message": "Keranjang kosong",
  "data": {
    "cart_id": 1,
    "user_id": 5,
    "items_by_seller": [],
    "summary": {
      "total_items": 0,
      "total_sellers": 0,
      "grand_total": 0
    }
  }
}
```

---

### 5. ✏️ Update Cart Item Quantity

**PUT** `/api/ecommerce/buyer/cart/:cart_item_id`

**Auth:** Required (Bearer Token)

**Description:** Ubah quantity item di keranjang

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Quantity berhasil diupdate",
  "data": {
    "cart_item_id": 15,
    "product_name": "Smartphone Samsung Galaxy",
    "old_quantity": 2,
    "new_quantity": 5,
    "price": 8000000,
    "new_total": 40000000
  }
}
```

**Error Responses:**

**404 - Item Not Found:**
```json
{
  "success": false,
  "message": "Item tidak ditemukan di keranjang"
}
```

**400 - Insufficient Stock:**
```json
{
  "success": false,
  "message": "Stock tidak mencukupi. Stock tersedia: 50"
}
```

---

### 6. ❌ Delete Single Cart Item

**DELETE** `/api/ecommerce/buyer/cart/:cart_item_id`

**Auth:** Required (Bearer Token)

**Description:** Hapus 1 item dari keranjang

**Response Success (200):**
```json
{
  "success": true,
  "message": "Item berhasil dihapus dari keranjang",
  "data": {
    "cart_item_id": 15,
    "product_name": "Smartphone Samsung Galaxy"
  }
}
```

**Error Response:**

**404 - Item Not Found:**
```json
{
  "success": false,
  "message": "Item tidak ditemukan di keranjang"
}
```

---

### 7. 🗑️ Delete All Items from Seller

**DELETE** `/api/ecommerce/buyer/cart/seller/:seller_id`

**Auth:** Required (Bearer Token)

**Description:** Hapus semua item dari seller tertentu

**Response Success (200):**
```json
{
  "success": true,
  "message": "Semua item dari seller berhasil dihapus",
  "data": {
    "seller_id": 2,
    "seller_name": "Toko Elektronik Jaya",
    "deleted_count": 2
  }
}
```

**Error Response:**

**404 - No Items from Seller:**
```json
{
  "success": false,
  "message": "Tidak ada item dari seller ini di keranjang"
}
```

---

### 8. 🧹 Clear Cart

**DELETE** `/api/ecommerce/buyer/cart/clear`

**Auth:** Required (Bearer Token)

**Description:** Kosongkan seluruh keranjang

**Response Success (200):**
```json
{
  "success": true,
  "message": "Keranjang berhasil dikosongkan",
  "data": {
    "deleted_count": 5
  }
}
```

**Empty Cart (200):**
```json
{
  "success": true,
  "message": "Keranjang sudah kosong"
}
```

---

## 🧪 Testing Guide

### Prerequisites
1. Install **REST Client** extension di VS Code
2. Server running di `http://localhost:5000`
3. Database MySQL ready dengan seed data

### Testing Steps

#### 1. Login & Get Token
```http
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "user1@ecommerce.com",
  "password": "User123!"
}
```

Copy `token` dari response, simpan di variable `@token`.

#### 2. Browse Products (No Auth)
```http
GET http://localhost:5000/api/ecommerce/buyer/products
```

Catat `product_id` yang tersedia (11, 12, 13).

#### 3. Add Items to Cart
```http
POST http://localhost:5000/api/ecommerce/buyer/cart
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "product_id": 11,
  "quantity": 2
}
```

Catat `cart_item_id` dari response.

#### 4. View Cart (Check Grouping)
```http
GET http://localhost:5000/api/ecommerce/buyer/cart
Authorization: Bearer {{token}}
```

Verify items dikelompokkan per `seller_id`.

#### 5. Update Quantity
```http
PUT http://localhost:5000/api/ecommerce/buyer/cart/15
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "quantity": 5
}
```

#### 6. Delete Single Item
```http
DELETE http://localhost:5000/api/ecommerce/buyer/cart/15
Authorization: Bearer {{token}}
```

#### 7. Clear Entire Cart
```http
DELETE http://localhost:5000/api/ecommerce/buyer/cart/clear
Authorization: Bearer {{token}}
```

---

## 🐛 Troubleshooting

### Issue 1: "Produk tidak ditemukan"
**Cause:** Product ID tidak valid atau status bukan 'active'

**Solution:**
```bash
# Check products di database
node scripts/check-products.js
```

---

### Issue 2: "Token expired"
**Cause:** JWT token sudah kadaluarsa (7 hari)

**Solution:** Login ulang untuk mendapat token baru.

---

### Issue 3: "Cannot read properties of undefined (reading 'findUnique')"
**Cause:** Prisma client belum di-generate atau schema belum sync

**Solution:**
```bash
npx prisma generate --schema=prisma/schema-ecommerce.prisma
npx prisma db push --schema=prisma/schema-ecommerce.prisma
```

---

### Issue 4: Route Collision (DELETE /:cartItemId tidak jalan)
**Cause:** Route order salah - generic routes matching sebelum parameterized routes

**Solution:** ✅ FIXED - Reorder routes:
```javascript
// CORRECT ORDER (Specific routes first)
router.delete("/clear", authMiddleware, clearCart);
router.delete("/seller/:sellerId", authMiddleware, removeCartItemsBySeller);
router.delete("/:cartItemId", authMiddleware, removeCartItem);  // Last
```

---

## 📊 Database Indexes

```sql
-- Performance optimization
CREATE INDEX idx_cart_user ON carts(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);
```

---

## 🔐 Security Features

1. **JWT Authentication:** Semua cart endpoints memerlukan valid JWT token
2. **User Isolation:** User hanya bisa akses cart milik sendiri
3. **Stock Validation:** Prevent overselling
4. **SQL Injection Protection:** Prisma ORM dengan parameterized queries
5. **Rate Limiting:** (TODO - implement di production)

---

## 📈 Performance Considerations

1. **Eager Loading:** Product, variant, seller data di-load sekaligus
2. **Database Indexes:** Optimized untuk query cart items
3. **Response Grouping:** Grouping dilakukan di application layer
4. **Caching:** (TODO - implement Redis untuk cart data)

---

## 🚀 Next Steps / Future Enhancements

- [ ] Add to cart from wishlist
- [ ] Save for later feature
- [ ] Cart expiration (auto-clear after X days)
- [ ] Cart sharing (generate shareable link)
- [ ] Bulk add to cart (multiple items)
- [ ] Cart recommendations
- [ ] Price alerts on cart items
- [ ] Redis caching for better performance

---

## 📞 Support

**Developer Contact:**
- Email: backend@ecommerce.com
- Slack: #backend-team

**Documentation Updated:** 4 Januari 2025  
**Status:** ✅ Production Ready
