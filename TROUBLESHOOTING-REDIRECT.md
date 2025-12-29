# Troubleshooting: Redirect ke Dashboard yang Salah

## Masalah: "Kenapa langsung masuk admin dashboard?"

### Kemungkinan Penyebab

1. **User memiliki multiple roles**
   - User punya role `admin` DAN `seller` sekaligus
   - System prioritas admin terlebih dahulu

2. **Format role tidak konsisten**
   - Backend return `roles: ["admin", "seller"]` (array)
   - Fallback mode simpan `role: "admin"` (string)

3. **Data user corrupt**
   - LocalStorage menyimpan role yang salah
   - Session lama masih tersimpan

### Solusi yang Sudah Diterapkan

#### 1. Role Helper Utilities (`src/utils/roleHelper.js`)

Fungsi helper untuk normalize dan prioritize roles:

```javascript
// Normalize roles dari berbagai format
getUserRoles(user) // → ["seller"] atau ["admin", "seller"]

// Get primary role dengan prioritas: admin > seller > buyer
getPrimaryRole(user) // → "seller"

// Get dashboard path otomatis
getDashboardPath(user) // → "/seller/dashboard"
```

#### 2. Updated Login Logic (`LoginPage.jsx`)

Sekarang menggunakan helper function yang lebih robust:

```javascript
const user = result.data.user;
const dashboardPath = getDashboardPath(user);
navigate(dashboardPath);
```

#### 3. Debug Panel Component

Panel debug muncul di pojok kanan bawah (hanya di development mode) yang menampilkan:
- User ID
- Username & Email
- Roles (array format)
- Role (string format)
- Normalized roles
- Primary role
- Dashboard path yang akan digunakan

### Cara Debugging

#### Step 1: Lihat Debug Panel

Setelah login, akan muncul panel debug di pojok kanan bawah layar yang menampilkan:

```
User ID: 123
Username: seller1
Email: seller@example.com
Roles (array): ["seller"]
Role (string): "seller"
Normalized Roles: [Penjual]
Primary Role: seller
Dashboard Path: /seller/dashboard
```

#### Step 2: Check Browser Console

Klik tombol "Log to Console" di debug panel untuk melihat detail lengkap di console.

Atau manual check:

```javascript
// Di browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Roles:', user.roles);
console.log('Role:', user.role);
```

#### Step 3: Verify Data Structure

**Format yang BENAR untuk seller:**

```json
{
  "user_id": 123,
  "username": "seller1",
  "email": "seller@example.com",
  "role": "seller",
  "roles": ["seller"]
}
```

**Format yang SALAH:**

```json
{
  "user_id": 123,
  "username": "seller1",
  "email": "seller@example.com",
  "role": "admin",          // ❌ Salah!
  "roles": ["admin"]        // ❌ Salah!
}
```

atau

```json
{
  "user_id": 123,
  "username": "seller1",
  "email": "seller@example.com",
  "role": "seller",
  "roles": ["admin", "seller"]  // ❌ Admin di prioritas duluan!
}
```

### Quick Fix

#### Opsi 1: Clear dan Register Ulang

```javascript
// Di browser console
localStorage.clear();
window.location.href = '/register/seller';
```

Kemudian:
1. Register dengan data seller baru
2. Login
3. Check debug panel untuk verify role

#### Opsi 2: Manual Fix di LocalStorage

```javascript
// Di browser console
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'seller';
user.roles = ['seller'];
localStorage.setItem('user', JSON.stringify(user));
window.location.reload();
```

#### Opsi 3: Gunakan Clear Button

Klik tombol "Clear & Logout" di debug panel untuk:
1. Clear localStorage
2. Logout
3. Redirect ke login page

### Priority Role System

System menggunakan prioritas role sebagai berikut:

```
admin > seller > buyer
```

Artinya:
- Jika user punya role `["admin", "seller"]` → redirect ke `/admin/dashboard`
- Jika user punya role `["seller", "buyer"]` → redirect ke `/seller/dashboard`
- Jika user hanya punya `["seller"]` → redirect ke `/seller/dashboard`

**PENTING:** Saat register sebagai seller, pastikan HANYA role `seller` yang tersimpan, BUKAN `admin`.

### Verifikasi Register Seller

Check file `RegisterSellerPage.jsx`:

```javascript
const [formData, setFormData] = useState({
  ...
  role: 'seller', // ✅ Fixed as seller
});
```

Pastikan tidak ada yang mengubah role menjadi admin di proses register.

### Backend Integration

Saat backend sudah aktif, pastikan endpoint `/api/ecommerce/auth/register` mengembalikan:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "user_id": 123,
      "username": "seller1",
      "email": "seller@example.com",
      "full_name": "Seller Name",
      "phone": "081234567890",
      "role": "seller",           // ✅ Single role
      "roles": ["seller"],        // ✅ Array dengan satu role
      "email_verified": false,
      "created_at": "2025-11-19T..."
    },
    "token": "jwt_token_here"
  }
}
```

### Testing Checklist

- [ ] Register seller baru berhasil
- [ ] Debug panel muncul setelah login
- [ ] Debug panel menampilkan `Primary Role: seller`
- [ ] Debug panel menampilkan `Dashboard Path: /seller/dashboard`
- [ ] Setelah login redirect ke `/seller/dashboard` (BUKAN `/admin/dashboard`)
- [ ] Bisa akses semua menu seller
- [ ] TIDAK bisa akses menu admin (redirect ke seller dashboard)

### Common Mistakes

❌ **Salah:**
```javascript
// RegisterSellerPage.jsx
role: 'admin' // Jangan!
```

❌ **Salah:**
```javascript
// authAPI.js register function
roles: [data.role, 'admin'] // Jangan tambah admin!
```

❌ **Salah:**
```javascript
// LoginPage.jsx
if (user.roles?.includes('admin')) {
  navigate('/admin/dashboard'); // Admin selalu diprioritaskan
}
```

✅ **Benar:**
```javascript
// Gunakan helper function
const dashboardPath = getDashboardPath(user);
navigate(dashboardPath);
```

### Need Help?

Jika masih redirect ke admin dashboard:

1. Screenshot debug panel
2. Copy paste output dari browser console:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```
3. Check apakah ada custom code yang mengubah role

---

**Last Updated:** 2025-11-19
**Status:** ✅ Fixed with role helper utilities and debug panel
