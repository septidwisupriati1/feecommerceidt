# 🔧 Troubleshooting: Dashboard Buyer Redirect ke Login

## Masalah
User dengan role "buyer" setelah login malah redirect kembali ke halaman login saat mengakses `/buyer/dashboard`.

## Penyebab Umum

### 1. **Data User Tidak Tersimpan dengan Benar**
- Token atau user data hilang dari localStorage
- Format user data tidak sesuai

### 2. **Role Tidak Sesuai**
- User tidak memiliki role "buyer"
- Format role tidak sesuai (string vs array)

### 3. **ProtectedRoute Menolak Akses**
- Role check gagal
- Token expired atau invalid

## Cara Debug

### Step 1: Cek Console Browser
1. Buka browser DevTools (F12)
2. Lihat tab Console
3. Cari pesan error atau warning dengan emoji:
   - 🔒 ProtectedRoute messages
   - 🏠 BuyerDashboard messages
   - 🔐 Auth check messages

### Step 2: Gunakan Auth Debug Utility
Di browser console, ketik:
```javascript
checkAuth()
```

Ini akan menampilkan:
- Status autentikasi
- Role user
- Dashboard yang seharusnya
- Access permissions

### Step 3: Cek LocalStorage Manual
Di browser DevTools → Application/Storage → LocalStorage:

Cek ada 2 item:
1. **`token`** → harus ada nilai (JWT atau fallback_token_...)
2. **`user`** → harus ada JSON object dengan:
   ```json
   {
     "user_id": 1,
     "username": "...",
     "email": "...",
     "role": "buyer",  // ATAU
     "roles": ["buyer"] // Salah satu harus ada
   }
   ```

## Solusi Berdasarkan Masalah

### ❌ **Masalah: Token Tidak Ada**

**Gejala:**
```
❌ [ProtectedRoute] Not authenticated, redirecting to login
hasToken: false
```

**Solusi:**
1. Logout dan login ulang
2. Clear browser cache
3. Cek network tab saat login - pastikan API response sukses

**Code Fix (jika perlu):**
```javascript
// Di LoginPage.jsx - pastikan saveAuth dipanggil
if (result.data?.token && result.data?.user) {
  saveAuth(result.data.token, result.data.user);
}
```

---

### ❌ **Masalah: User Data Tidak Ada/Invalid**

**Gejala:**
```
❌ [ProtectedRoute] Not authenticated
hasToken: true
hasUser: false
```

**Solusi:**
```javascript
// Manual fix di console:
localStorage.setItem('user', JSON.stringify({
  user_id: 1,
  username: "buyer1",
  email: "buyer@example.com",
  role: "buyer",
  roles: ["buyer"]
}));
```

Kemudian refresh page.

---

### ❌ **Masalah: Role Tidak Sesuai**

**Gejala:**
```
❌ [ProtectedRoute] User does not have required role: buyer
userRole: undefined atau "seller" atau "admin"
```

**Solusi 1: Update Role di LocalStorage**
```javascript
// Di console
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'buyer';
user.roles = ['buyer'];
localStorage.setItem('user', JSON.stringify(user));
location.reload();
```

**Solusi 2: Re-register sebagai Buyer**
1. Logout
2. Klik "Register"
3. Pilih "Register sebagai Buyer" (`/register/buyer`)
4. Login kembali

---

### ❌ **Masalah: Format Role Tidak Dikenali**

**Gejala:**
```
⚠️ [hasRole] No valid role format found
userRole: undefined
userRoles: undefined
```

**Solusi:**
User object harus punya salah satu:
- `role: "buyer"` (string), ATAU
- `roles: ["buyer"]` (array)

```javascript
// Fix di console:
const user = JSON.parse(localStorage.getItem('user'));
if (!user.role && !user.roles) {
  user.role = 'buyer';
  user.roles = ['buyer'];
  localStorage.setItem('user', JSON.stringify(user));
  console.log('✅ Role fixed');
  location.reload();
}
```

---

## Quick Fix: Reset Complete Auth

Jika semua solusi di atas tidak berhasil, reset complete:

```javascript
// Di browser console:
// 1. Clear auth
localStorage.removeItem('token');
localStorage.removeItem('user');

// 2. Set test user (fallback mode)
const testUser = {
  user_id: 999,
  username: "testbuyer",
  email: "buyer@test.com",
  full_name: "Test Buyer",
  role: "buyer",
  roles: ["buyer"],
  email_verified: true
};
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('token', 'fallback_token_test123');

// 3. Verify
checkAuth();

// 4. Navigate
window.location.href = '/buyer/dashboard';
```

---

## Testing Flow

### Test Login Complete Flow:

1. **Logout** (jika sudah login)
   ```
   Navigate to: any page
   Click: Logout button
   Verify: Redirected to /login
   ```

2. **Login sebagai Buyer**
   ```
   Email: buyer@example.com
   Password: password123
   Click: Login
   ```

3. **Check Console**
   ```
   Harus muncul:
   ✅ Login successful
   ✅ Token saved to localStorage
   ✅ Verification passed
   🔄 Redirecting to: /buyer/dashboard
   ```

4. **Check Dashboard Loads**
   ```
   Harus muncul:
   🏠 [BuyerDashboard] Component mounted
   ✅ [BuyerDashboard] User authenticated
   ```

5. **Verify di Console**
   ```javascript
   checkAuth()
   // Output harus:
   // authenticated: true
   // role: "buyer"
   // dashboard: "/buyer/dashboard"
   ```

---

## Preventive Measures

### Untuk Developer:

1. **Selalu gunakan saveAuth() saat login**
   ```javascript
   import { saveAuth } from '../utils/auth';
   saveAuth(token, user);
   ```

2. **Verify setelah save**
   ```javascript
   const savedToken = localStorage.getItem('token');
   const savedUser = localStorage.getItem('user');
   if (!savedToken || !savedUser) {
     throw new Error('Failed to save auth');
   }
   ```

3. **Tambahkan logging**
   ```javascript
   console.log('✅ Auth saved:', {
     hasToken: !!token,
     username: user.username,
     role: user.role || user.roles?.[0]
   });
   ```

### Untuk Testing:

1. **Test berbagai role**
   - Buyer: `/buyer/dashboard`
   - Seller: `/seller/dashboard`
   - Admin: `/admin/dashboard`

2. **Test edge cases**
   - Login tanpa role
   - Login dengan multiple roles
   - Token expired
   - User data corrupt

---

## Backend Requirements

Backend harus return format ini saat login:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "user_id": 1,
      "username": "buyer1",
      "email": "buyer@example.com",
      "full_name": "Buyer Name",
      "phone": "08123456789",
      "role": "buyer",       // ← PENTING: String role
      "roles": ["buyer"],    // ← ATAU: Array roles
      "email_verified": true
    }
  }
}
```

**Minimal requirement:** User object HARUS punya salah satu:
- `role` (string), ATAU
- `roles` (array)

---

## Summary Checklist

Saat debugging dashboard redirect issue:

- [ ] Cek console untuk error messages
- [ ] Run `checkAuth()` di browser console
- [ ] Verify token ada di localStorage
- [ ] Verify user object ada dan valid
- [ ] Verify user punya role "buyer"
- [ ] Verify format role (string atau array)
- [ ] Test dengan test user (quick fix script)
- [ ] Cek network tab saat login
- [ ] Clear cache dan coba lagi
- [ ] Re-register jika perlu

---

## Contact Developer

Jika masih gagal setelah semua langkah di atas:
1. Screenshot console messages
2. Screenshot localStorage (token & user)
3. Screenshot network tab (login request/response)
4. Kirimkan ke developer

---

**Last Updated:** ${new Date().toISOString()}
