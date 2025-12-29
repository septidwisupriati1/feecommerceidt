# Buyer Registration & Role Management Implementation Guide

## 📋 Overview

Implementation lengkap sistem **Buyer Role Registration** untuk module E-Commerce dengan fitur email verification, login, dan upgrade role dari buyer ke seller.

---

## 🎯 Fitur Utama

### 1. **Buyer Registration**
- Pendaftaran khusus untuk pembeli (role: `buyer`)
- Email verification wajib sebelum login
- Password hashing dengan bcrypt
- Validasi input lengkap

### 2. **Multi-Role System**
- User dapat memiliki multiple roles (buyer, seller, admin)
- Seller dapat membeli produk (otomatis punya role buyer juga)
- Buyer dapat upgrade ke seller kapan saja
- Role-based access control (RBAC)

### 3. **Email Verification**
- Token-based verification dengan expiry
- Resend verification email
- Auto-create store profile untuk seller setelah verifikasi

### 4. **Role Upgrade**
- Buyer dapat upgrade ke seller
- Auto-create store profile saat upgrade
- Activity logs untuk tracking

---

## 🏗️ Arsitektur

### Database Schema
```prisma
enum user_role_type {
  admin
  seller
  buyer  // ✅ NEW
}

model users {
  user_id           Int       @id @default(autoincrement())
  username          String    @unique
  email             String    @unique
  password_hash     String
  full_name         String
  phone             String?
  email_verified    Boolean   @default(false)
  email_verified_at DateTime?
  // ... fields lainnya
}

model user_roles {
  role_id   Int              @id @default(autoincrement())
  user_id   Int
  role_type user_role_type
  // ... relations
}
```

### File Structure
```
modules/ecommerce/
├── controllers/
│   ├── authController.js      # ✅ Updated: tambah validasi role 'buyer'
│   └── roleController.js      # ✅ NEW: handle role management
├── routes/
│   ├── authRoutes.js          # Existing routes
│   └── roleRoutes.js          # ✅ NEW: /roles endpoints
└── middleware/
    └── authMiddleware.js      # Existing: authenticateToken, requireRole

prisma/
├── schema-ecommerce.prisma    # ✅ Updated: tambah 'buyer' enum
└── seed-ecommerce.js          # ✅ Updated: tambah buyer seed data
```

---

## 📝 API Endpoints

### Authentication Endpoints

#### 1. Register Buyer
```http
POST /api/ecommerce/auth/register
Content-Type: application/json

{
  "username": "buyer1",
  "email": "buyer1@example.com",
  "password": "Buyer123!",
  "full_name": "Buyer One",
  "phone": "081234567890",
  "role": "buyer"  ← Harus "buyer", "seller", atau "admin"
}
```

**Response 201 Created:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user_id": 123,
    "username": "buyer1",
    "email": "buyer1@example.com",
    "role": "buyer",
    "email_verified": false
  }
}
```

#### 2. Login
```http
POST /api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "buyer1@example.com",
  "password": "Buyer123!"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 123,
      "email": "buyer1@example.com",
      "username": "buyer1",
      "roles": ["buyer"]
    }
  }
}
```

**Response 403 Forbidden (Email belum diverifikasi):**
```json
{
  "success": false,
  "error": "Email not verified. Please check your inbox for verification email."
}
```

#### 3. Verify Email
```http
GET /api/ecommerce/auth/verify-email?token=abc123xyz
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

**Behavior:**
- ✅ Buyer: Email verified, siap login & belanja
- ✅ Seller: Email verified + auto-create blank store profile

#### 4. Resend Verification
```http
POST /api/ecommerce/auth/resend-verification
Content-Type: application/json

{
  "email": "buyer1@example.com"
}
```

---

### Role Management Endpoints

#### 1. Get Current User Roles
```http
GET /api/ecommerce/roles
Authorization: Bearer <token>
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "user_id": 123,
    "username": "buyer1",
    "email": "buyer1@example.com",
    "roles": ["buyer"]
  }
}
```

#### 2. Upgrade Buyer to Seller
```http
POST /api/ecommerce/roles/upgrade-to-seller
Authorization: Bearer <token>
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Successfully upgraded to seller. You can now start selling products!",
  "data": {
    "user_id": 123,
    "roles": ["buyer", "seller"]
  }
}
```

**Requirements:**
- ✅ User harus role `buyer`
- ✅ Email harus sudah diverifikasi
- ✅ Auto-create blank store profile
- ✅ Activity log recorded

**Response 400 Bad Request (Already Seller):**
```json
{
  "success": false,
  "message": "User is already a seller"
}
```

**Response 400 Bad Request (Email Not Verified):**
```json
{
  "success": false,
  "message": "Email must be verified before upgrading to seller"
}
```

---

## 🚀 Installation & Setup

### 1. Database Migration
```bash
cd /opt/lampp/htdocs/idt

# Generate migration dari schema changes
npx prisma migrate dev --name add_buyer_role --schema=./prisma/schema-ecommerce.prisma
```

### 2. Run Database Seed
```bash
# Seed database dengan buyer accounts
node prisma/seed-ecommerce.js
```

**Buyer Accounts Created:**
```
Buyer 1 (Verified):
- Email: buyer1@ecommerce.com
- Password: Buyer123!

Buyer 2 (Unverified):
- Email: buyer2@ecommerce.com
- Password: Buyer123!
```

### 3. Environment Variables
Ensure `.env` has:
```env
JWT_SECRET=your_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Start Server
```bash
npm start
# atau
npm run dev
```

---

## 🧪 Testing

### Using REST Client
1. Open `REST Testing/Buyer-Registration.rest`
2. Run tests secara sequential dari atas ke bawah
3. Copy token dari response login untuk test selanjutnya

### Test Cases Included

**✅ Positive Cases:**
1. Register buyer baru
2. Login buyer verified
3. Verify email
4. Resend verification
5. Get current roles
6. Get/Update buyer profile
7. Upgrade buyer to seller
8. Verify roles after upgrade
9. Access seller endpoints after upgrade

**❌ Negative Cases:**
10. Register dengan invalid role
11. Upgrade seller to seller (already seller)
12. Login dengan wrong password
13. Access protected route tanpa token
14. Register dengan existing email
15. Login buyer unverified
16. Access after logout (blacklisted token)

### Manual Testing Steps

#### Scenario 1: Buyer Registration Flow
1. ✅ Register buyer → Email sent
2. ✅ Check email inbox
3. ✅ Click verification link
4. ✅ Login dengan credentials
5. ✅ Access buyer features (browse products, add to cart, checkout)

#### Scenario 2: Upgrade to Seller Flow
1. ✅ Login sebagai buyer
2. ✅ GET `/api/ecommerce/roles` → Verify role: ["buyer"]
3. ✅ POST `/api/ecommerce/roles/upgrade-to-seller`
4. ✅ GET `/api/ecommerce/roles` → Verify role: ["buyer", "seller"]
5. ✅ GET `/api/ecommerce/store/profile` → Store auto-created
6. ✅ Access seller features (create products, manage store)

---

## 🔐 Security Features

### Password Requirements
- Minimum 8 karakter
- Harus ada uppercase letter
- Harus ada lowercase letter
- Harus ada number
- Harus ada special character
- Bcrypt hashing dengan salt rounds 10

### Email Verification
- Token valid selama 24 jam
- Token unique per user
- Token di-hash di database
- Auto-expire setelah digunakan

### JWT Authentication
- Token expires after 7 days
- Token blacklist untuk logout
- Token validation di setiap protected route

### Role-Based Access Control
```javascript
// Example: Seller-only endpoint
router.post(
  '/products',
  authenticateToken,
  requireRole('seller'),
  createProduct
);

// Example: Buyer-only endpoint (if needed)
router.post(
  '/orders',
  authenticateToken,
  requireRole('buyer', 'seller'),  // Seller bisa juga order
  createOrder
);

// Example: Admin-only endpoint
router.delete(
  '/users/:id',
  authenticateToken,
  requireRole('admin'),
  deleteUser
);
```

---

## 📊 Database Queries

### Check User Roles
```sql
SELECT 
  u.user_id,
  u.username,
  u.email,
  u.email_verified,
  GROUP_CONCAT(ur.role_type) as roles
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
WHERE u.email = 'buyer1@ecommerce.com'
GROUP BY u.user_id;
```

### Check Store Creation
```sql
SELECT 
  sp.seller_id,
  sp.store_name,
  sp.created_at,
  u.username,
  u.email
FROM seller_profiles sp
JOIN users u ON sp.user_id = u.user_id
WHERE u.email = 'buyer1@ecommerce.com';
```

### Check Activity Logs
```sql
SELECT 
  al.action,
  al.description,
  al.created_at,
  u.username
FROM activity_logs al
JOIN users u ON al.user_id = u.user_id
WHERE u.email = 'buyer1@ecommerce.com'
ORDER BY al.created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Issue: "Email already registered"
**Solution:** Email sudah digunakan user lain, gunakan email berbeda.

### Issue: "Email not verified"
**Solution:** 
1. Check spam folder untuk verification email
2. Gunakan resend verification endpoint
3. Manual update di database (dev only):
   ```sql
   UPDATE users 
   SET email_verified = true, email_verified_at = NOW() 
   WHERE email = 'buyer1@ecommerce.com';
   ```

### Issue: "User is already a seller"
**Solution:** User sudah punya role seller, tidak perlu upgrade lagi.

### Issue: "Token has been revoked"
**Solution:** Token sudah di-logout, login ulang untuk dapatkan token baru.

### Issue: Migration Error
**Solution:**
```bash
# Reset migration (WARNING: Data loss!)
npx prisma migrate reset --schema=./prisma/schema-ecommerce.prisma

# Re-run seed
node prisma/seed-ecommerce.js
```

---

## 📈 Future Enhancements

### Planned Features
1. **Social Authentication**: Login dengan Google/Facebook
2. **Two-Factor Authentication (2FA)**: Extra security layer
3. **Role Permissions Granular**: Fine-grained permissions per role
4. **Buyer Tiers**: Bronze, Silver, Gold buyer levels with benefits
5. **Seller Verification Badge**: Verified seller status
6. **Auto-upgrade Incentives**: Promosi untuk upgrade buyer ke seller

### Performance Optimizations
1. Cache user roles di Redis
2. Rate limiting untuk registration endpoint
3. Email queue dengan Bull/Redis
4. Optimize database queries dengan indexes

---

## 📞 Support

### Documentation Files
- **REST Tests**: `REST Testing/Buyer-Registration.rest`
- **This Guide**: `Panduan API/Buyer-Registration-README.md`
- **Main Documentation**: `Panduan API/ECOMMERCE-MODULE-DOCUMENTATION.md`

### Contact
Jika ada issues atau pertanyaan, buat issue di repository atau kontak development team.

---

## ✅ Checklist Implementation

### Schema & Database
- [x] Update `schema-ecommerce.prisma` - Tambah 'buyer' enum
- [x] Update `seed-ecommerce.js` - Tambah buyer seed data
- [x] Run database migration
- [x] Run seed data

### Controllers
- [x] Update `authController.js` - Validasi role tambah 'buyer'
- [x] Update `authController.js` - verifyEmail handle buyer (no store)
- [x] Create `roleController.js` - getRoles & upgradeBuyerToSeller

### Routes
- [x] Create `roleRoutes.js` - GET /roles & POST /upgrade-to-seller
- [x] Register routes di `index.js`

### Testing
- [x] Create `Buyer-Registration.rest` - Full test cases
- [x] Create `Buyer-Registration-README.md` - Complete guide
- [x] Manual testing semua scenarios

### Documentation
- [x] API endpoint documentation
- [x] Architecture explanation
- [x] Security features documentation
- [x] Troubleshooting guide

---

**🎉 Implementation Complete! Buyer registration system ready to use.**

Last Updated: 2025-01-20
Version: 1.0.0
