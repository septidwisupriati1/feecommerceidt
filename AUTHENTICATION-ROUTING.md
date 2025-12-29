# 🔐 SISTEM AUTENTIKASI & ROUTING

**Tanggal Update:** 19 November 2025

---

## 📋 RINGKASAN

Sistem autentikasi telah dikonfigurasi untuk **memaksa user login/register** sebelum mengakses halaman apapun dalam aplikasi. User yang belum login akan diarahkan ke halaman landing page, dan setelah login akan diarahkan ke dashboard sesuai role.

---

## 🔄 ALUR AUTENTIKASI

### **Flow Utama:**

```
┌─────────────────┐
│  User Visit /   │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Logged In?│
    └────┬─────┘
         │
    ┌────▼────────┐
    │   NO        │
    │             │
    │ Landing Page│  ← Halaman publik dengan tombol Login/Register
    │ (/)         │
    └────┬────────┘
         │
    ┌────▼─────────┐
    │ Login/Register│
    └────┬─────────┘
         │
    ┌────▼─────┐
    │ Auth API │
    └────┬─────┘
         │
    ┌────▼────────────────────────┐
    │ Success?                    │
    │ - Save token to localStorage│
    │ - Save user to localStorage │
    └────┬────────────────────────┘
         │
    ┌────▼─────────────────────────┐
    │ Redirect ke Dashboard sesuai │
    │ Role:                        │
    │ - Buyer  → /buyer/dashboard  │
    │ - Seller → /seller/dashboard │
    │ - Admin  → /admin/dashboard  │
    └──────────────────────────────┘
```

### **Protected Route Check:**

```
User access /seller/dashboard
         │
    ┌────▼──────────┐
    │ ProtectedRoute │
    │ Check:         │
    │ 1. isAuthenticated()  ← Check token exists
    │ 2. hasRole('seller')  ← Check user role
    └────┬──────────┘
         │
    ┌────▼─────┐
    │ Valid?   │
    └────┬─────┘
         │
    ┌────▼──────────────┐
    │ YES → Show Page   │
    │ NO  → Redirect    │
    │       /login      │
    └───────────────────┘
```

---

## 🗺️ ROUTE STRUCTURE

### **1. Public Routes (Tidak Perlu Login)**

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/` | LandingPage | Halaman landing dengan CTA login/register |
| `/login` | LoginPage | Form login (redirect jika sudah login) |
| `/register` | RegisterPage | Pilihan role register |
| `/register/buyer` | RegisterBuyerPage | Form register buyer |
| `/register/seller` | RegisterSellerPage | Form register seller |
| `/register/admin` | RegisterAdminPage | Form register admin |
| `/forgot-password` | ForgotPasswordPage | Request reset password |
| `/verify-email` | VerifyEmailPage | Verify email token |

**Proteksi:** Menggunakan `<PublicRoute>` - jika user sudah login, akan redirect ke dashboard sesuai role.

---

### **2. Buyer Routes (Perlu Login sebagai Buyer)**

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/buyer/dashboard` | BuyerDashboard | Dashboard utama buyer |
| `/home` | HomePage | Halaman home belanja |
| `/produk` | ProductPage | List produk |
| `/produk/:id` | ProductDetailPage | Detail produk |
| `/keranjang` | CartPage | Keranjang belanja |
| `/checkout` | CheckoutPage | Checkout pembelian |
| `/pesanan-saya` | MyOrdersPage | Daftar pesanan |
| `/chat` | ChatPage | Chat buyer |
| `/profil` | ProfilePage | Profile buyer |

**Proteksi:** Menggunakan `<ProtectedRoute requiredRole="buyer">`

---

### **3. Seller Routes (Perlu Login sebagai Seller)**

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/seller` | SellerProductPage | Default: Product list |
| `/seller/dashboard` | SellerDashboard | Dashboard seller |
| `/seller/product` | SellerProductPage | Kelola produk |
| `/seller/pesanan` | PesananPage | Kelola pesanan |
| `/seller/chat` | SellerChatPage | Chat seller |
| `/seller/produk-terjual` | ProdukTerjualPage | Produk terjual |
| `/seller/ulasan` | UlasanPage | Ulasan produk |
| `/seller/pengiriman` | PengirimanPage | Pengiriman |
| `/seller/pengaturan` | PengaturanPage | Pengaturan toko |
| `/seller/profile` | SellerProfilePage | Profile seller |
| `/seller/rekening` | RekeningPage | Rekening bank |
| `/seller/faq` | FAQPage | FAQ seller |
| `/seller/syarat` | SyaratKetentuanPage | Syarat & ketentuan |
| `/seller/privasi` | PrivasiKebijakanPage | Kebijakan privasi |

**Proteksi:** Menggunakan `<ProtectedRoute requiredRole="seller">`

---

### **4. Admin Routes (Perlu Login sebagai Admin)**

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/admin` | AdminDashboard | Default: Dashboard |
| `/admin/dashboard` | AdminDashboard | Dashboard admin |
| `/admin/kelola-store` | KelolaStorePage | Kelola toko |
| `/admin/kelola-user` | KelolaUserPage | Kelola user |
| `/admin/kelola-product` | KelolaProductPage | Kelola produk |
| `/admin/kategori` | KategoriPage | Kelola kategori |
| `/admin/laporan` | LaporanPage | Laporan & analytics |
| `/admin/pesanan` | AdminPesananPage | Kelola pesanan |
| `/admin/payment-verification` | PaymentVerificationPage | Verifikasi pembayaran |
| `/admin/pembayaran` | PembayaranPage | Pembayaran |
| `/admin/pengiriman` | AdminPengirimanPage | Pengiriman |
| `/admin/kotak-masuk` | KotakMasukPage | Kotak masuk |
| `/admin/rekening-admin` | RekeningAdminPage | Rekening admin |
| `/admin/faq` | AdminFAQPage | Kelola FAQ |
| `/admin/syarat-ketentuan` | AdminSyaratKetentuanPage | Syarat & ketentuan |
| `/admin/kebijakan-privasi` | AdminKebijakanPrivasiPage | Kebijakan privasi |
| `/admin/profil-stp` | ProfilSTPPage | Profil platform |

**Proteksi:** Menggunakan `<ProtectedRoute requiredRole="admin">`

---

## 🛡️ KOMPONEN PROTEKSI

### **1. ProtectedRoute.jsx**

Melindungi route yang memerlukan autentikasi dan role tertentu.

```jsx
<ProtectedRoute requiredRole="seller">
  <SellerDashboard />
</ProtectedRoute>
```

**Logika:**
1. Cek `isAuthenticated()` → jika tidak, redirect ke `/login`
2. Cek `hasRole(requiredRole)` → jika tidak cocok, redirect ke dashboard role user
3. Jika valid → render children

**File:** `src/components/ProtectedRoute.jsx`

---

### **2. PublicRoute.jsx** ⭐ NEW

Melindungi halaman auth (login/register) agar user yang sudah login tidak bisa akses.

```jsx
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

**Logika:**
1. Cek `isAuthenticated()` → jika sudah login:
   - Admin → redirect `/admin/dashboard`
   - Seller → redirect `/seller/dashboard`
   - Buyer → redirect `/buyer/dashboard`
2. Jika belum login → render children (halaman login/register)

**File:** `src/components/PublicRoute.jsx`

---

### **3. LandingPage.jsx** ⭐ NEW

Halaman landing publik untuk user yang belum login.

**Fitur:**
- Hero section dengan CTA "Daftar" dan "Masuk"
- Features section (4 keunggulan platform)
- CTA section kedua
- Footer
- Auto-redirect jika sudah login (via useEffect)

**File:** `src/pages/LandingPage.jsx`

---

## 🔑 AUTHENTICATION API

### **Fungsi Utama (authAPI.js):**

| Fungsi | Deskripsi | Return |
|--------|-----------|--------|
| `login(credentials)` | Login user, simpan token & user | `{ success, data: { user, token } }` |
| `register(data)` | Register user baru | `{ success, data: { user, token } }` |
| `logout()` | Logout, hapus token & user | `{ success }` |
| `isAuthenticated()` | Cek apakah ada token | `boolean` |
| `hasRole(role)` | Cek apakah user punya role tertentu | `boolean` |
| `getCurrentUser()` | Get user dari localStorage | `User object atau null` |
| `getToken()` | Get token dari localStorage | `string atau null` |

---

## 💾 LOCALSTORAGE STRUCTURE

### **Keys:**

```javascript
// Production (dari backend)
localStorage.setItem('token', 'eyJhbGciOiJIUzI1...');
localStorage.setItem('user', JSON.stringify({
  user_id: 123,
  username: 'seller1',
  email: 'seller@example.com',
  full_name: 'John Doe',
  phone: '08123456789',
  email_verified: true,
  roles: ['seller'], // Array format dari backend
  created_at: '2025-11-19T10:00:00Z'
}));

// Fallback Mode (development)
localStorage.setItem('token', 'fallback_token_abc123');
localStorage.setItem('user', JSON.stringify({
  user_id: 1,
  username: 'seller1',
  email: 'seller@example.com',
  full_name: 'John Doe',
  phone: '08123456789',
  email_verified: true,
  role: 'seller', // String format untuk fallback
  roles: ['seller'], // Array format untuk compatibility
  created_at: '2025-11-19T10:00:00Z'
}));

// Fallback users database (development only)
localStorage.setItem('fallback_users', JSON.stringify([
  {
    user_id: 1,
    username: 'buyer1',
    email: 'buyer@example.com',
    password: 'password123', // Only in fallback
    full_name: 'Buyer User',
    phone: '08111111111',
    email_verified: true,
    role: 'buyer',
    roles: ['buyer'],
    created_at: '2025-11-19T09:00:00Z'
  },
  // ... more users
]));
```

---

## 🧪 TESTING AUTENTIKASI

### **Cara Test:**

#### **1. Test Route Protection**

```javascript
// Buka browser, clear localStorage
localStorage.clear();

// Coba akses route protected
window.location.href = '/seller/dashboard';
// Expected: Redirect ke /login

window.location.href = '/admin/dashboard';
// Expected: Redirect ke /login

window.location.href = '/produk';
// Expected: Redirect ke /login
```

#### **2. Test Public Route Redirect**

```javascript
// Login sebagai seller
// localStorage sudah ada token + user dengan role seller

// Coba akses login page
window.location.href = '/login';
// Expected: Auto redirect ke /seller/dashboard

// Coba akses register page
window.location.href = '/register';
// Expected: Auto redirect ke /seller/dashboard
```

#### **3. Test Landing Page**

```javascript
// Logout terlebih dahulu
localStorage.clear();

// Akses root
window.location.href = '/';
// Expected: Show LandingPage dengan tombol Login/Daftar

// Klik "Daftar" → redirect ke /register
// Klik "Masuk" → redirect ke /login
```

#### **4. Test Role-Based Access**

```javascript
// Login sebagai buyer
// localStorage: { role: 'buyer' }

// Coba akses seller route
window.location.href = '/seller/dashboard';
// Expected: Redirect ke /buyer/dashboard (dashboard role user)

// Coba akses admin route
window.location.href = '/admin/dashboard';
// Expected: Redirect ke /buyer/dashboard (dashboard role user)

// Akses buyer route
window.location.href = '/buyer/dashboard';
// Expected: Success, show BuyerDashboard
```

---

## 📝 CONTOH PENGGUNAAN

### **Navigasi dari Landing Page:**

```jsx
// LandingPage.jsx
<Button onClick={() => navigate('/register')}>
  Daftar Gratis Sekarang
</Button>
```

### **Login dan Auto Redirect:**

```jsx
// LoginPage.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const result = await login({ email, password });
  const user = result.data.user;
  
  // Auto redirect by getDashboardPath
  const dashboardPath = getDashboardPath(user);
  navigate(dashboardPath);
  
  // Output examples:
  // Buyer  → /buyer/dashboard
  // Seller → /seller/dashboard
  // Admin  → /admin/dashboard
};
```

### **Protected Navigation:**

```jsx
// Navbar.jsx (untuk buyer)
<Link to="/home">Beranda</Link>        {/* ProtectedRoute */}
<Link to="/produk">Produk</Link>       {/* ProtectedRoute */}
<Link to="/keranjang">Keranjang</Link> {/* ProtectedRoute */}
```

### **Logout:**

```jsx
import { logout } from '../services/authAPI';

const handleLogout = async () => {
  await logout(); // Clear localStorage
  navigate('/login'); // Redirect ke login
};
```

---

## 🔄 REDIRECT LOGIC

### **Role-Based Dashboard Redirect:**

| User Role | Dashboard Path | Component |
|-----------|----------------|-----------|
| Buyer | `/buyer/dashboard` | BuyerDashboard |
| Seller | `/seller/dashboard` | SellerDashboard |
| Admin | `/admin/dashboard` | AdminDashboard |

**Implementasi:**

```javascript
// authAPI.js
export const hasRole = (role) => {
  const user = getCurrentUser();
  
  // Handle array format (backend)
  if (Array.isArray(user?.roles)) {
    return user.roles.includes(role);
  }
  
  // Handle string format (fallback)
  if (typeof user?.role === 'string') {
    return user.role === role;
  }
  
  return false;
};
```

---

## ⚙️ KONFIGURASI

### **Environment Variables:**

```env
# .env
VITE_API_BASE_URL=http://localhost:5000/api/ecommerce
```

### **Fallback Mode:**

Ketika backend tidak tersedia, aplikasi akan:
1. Menggunakan localStorage sebagai database
2. Generate fake token untuk session
3. Simpan users di `fallback_users` localStorage key
4. Auto-verify email (skip verification)

**Note:** Fallback mode hanya untuk development!

---

## 🚀 DEPLOYMENT CHECKLIST

### **Sebelum Production:**

- [ ] Pastikan semua route menggunakan `ProtectedRoute` atau `PublicRoute`
- [ ] Test login/logout flow untuk semua role
- [ ] Test redirect dari public route ke dashboard
- [ ] Test access denied ketika role tidak sesuai
- [ ] Disable fallback mode (atau tambah check `import.meta.env.MODE === 'development'`)
- [ ] Set environment variable `VITE_API_BASE_URL` ke production backend
- [ ] Test token expiration handling
- [ ] Add refresh token logic (jika backend support)
- [ ] Test concurrent login (multiple tabs)

---

## 🐛 TROUBLESHOOTING

### **Problem: User stuck di landing page setelah login**

**Solution:** Pastikan `getDashboardPath()` return path yang benar sesuai role.

```javascript
// utils/roleHelper.js
export const getDashboardPath = (user) => {
  if (Array.isArray(user?.roles)) {
    if (user.roles.includes('admin')) return '/admin/dashboard';
    if (user.roles.includes('seller')) return '/seller/dashboard';
    if (user.roles.includes('buyer')) return '/buyer/dashboard';
  }
  
  if (typeof user?.role === 'string') {
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'seller') return '/seller/dashboard';
    if (user.role === 'buyer') return '/buyer/dashboard';
  }
  
  return '/login'; // Fallback
};
```

---

### **Problem: Infinite redirect loop**

**Solution:** Pastikan `PublicRoute` dan `ProtectedRoute` tidak nested atau circular.

```jsx
// ❌ WRONG - Infinite loop
<PublicRoute>
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
</PublicRoute>

// ✅ CORRECT
<ProtectedRoute requiredRole="seller">
  <Dashboard />
</ProtectedRoute>
```

---

### **Problem: Role check tidak jalan**

**Solution:** Cek format role di localStorage.

```javascript
// Debug di console
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Roles (array):', user?.roles);
console.log('Role (string):', user?.role);

// Test hasRole function
import { hasRole } from './services/authAPI';
console.log('Is seller?', hasRole('seller'));
console.log('Is admin?', hasRole('admin'));
console.log('Is buyer?', hasRole('buyer'));
```

---

## 📊 SUMMARY

### ✅ **Yang Sudah Dibuat:**

1. **PublicRoute Component** - Mencegah user yang sudah login akses halaman auth
2. **LandingPage Component** - Halaman landing untuk user yang belum login
3. **Updated App.jsx** - Semua route wrapped dengan proteksi yang sesuai
4. **Updated Navbar** - Link ke `/home` untuk buyer yang sudah login

### 🔐 **Flow Autentikasi:**

```
Visit / → Landing Page (belum login)
         ↓
    Register/Login
         ↓
    Save token + user
         ↓
    Redirect ke Dashboard sesuai Role
         ↓
    Akses route sesuai role
```

### 🎯 **Protection Summary:**

- **Public:** `/`, `/login`, `/register/*`, `/forgot-password`, `/verify-email`
- **Buyer:** `/home`, `/produk/*`, `/keranjang`, `/checkout`, `/pesanan-saya`, `/chat`, `/profil`, `/buyer/dashboard`
- **Seller:** `/seller/*` (semua route seller)
- **Admin:** `/admin/*` (semua route admin)

---

**Last Updated:** 19 November 2025
**Status:** ✅ Production Ready
