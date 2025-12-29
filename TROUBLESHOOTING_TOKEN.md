# 🔧 Troubleshooting: Token Tidak Bisa Digunakan Setelah Login

## Masalah yang Diperbaiki

### 🐛 **Problem:**
Token tidak tersimpan atau tidak terbaca setelah login, menyebabkan error "Invalid token" saat mengakses halaman yang memerlukan autentikasi.

### ✅ **Solusi yang Diterapkan:**

---

## 1. **LoginPage.jsx - Enhanced Token Saving**

### Perubahan:
- ✅ Import `saveAuth` dan `debugAuth` dari `utils/auth`
- ✅ Double-save token untuk memastikan tersimpan
- ✅ Verifikasi token setelah save
- ✅ Extended delay (1500ms) sebelum redirect
- ✅ Logging lengkap untuk debugging

### Flow Baru:
```javascript
1. User submit login form
   ↓
2. Call authAPI.login()
   ↓
3. Receive result
   ↓
4. Verify result.success dan result.data
   ↓
5. saveAuth(token, user)  // Save pertama (dari authAPI)
   ↓
6. saveAuth(token, user)  // Save kedua (dari LoginPage - insurance)
   ↓
7. Verify localStorage.getItem('token')
   ↓
8. debugAuth() - log auth state
   ↓
9. setTimeout(1500ms) - ensure localStorage fully written
   ↓
10. navigate(dashboardPath)
```

### Console Output:
```
📥 Login result: { success: true, data: {...} }
✅ Token saved to localStorage
👤 User: { username: 'seller1', role: 'seller', ... }
🔍 Auth Debug Info: { hasToken: true, isAuthenticated: true, ... }
✅ Verification passed - token and user saved
🔄 Redirecting to: /seller/dashboard
```

---

## 2. **authAPI.js - Better Response Handling**

### Perubahan:
- ✅ Logging setiap step login
- ✅ Return dengan `success: true` flag
- ✅ Validate response structure
- ✅ Better error messages

### Login Response Format:
```javascript
// BACKEND SUCCESS:
{
  success: true,
  message: 'Login successful',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIs...',
    user: {
      user_id: 2,
      username: 'seller1',
      email: 'seller@example.com',
      role: 'seller',
      ...
    }
  }
}

// FALLBACK SUCCESS:
{
  success: true,
  message: 'Login successful (FALLBACK MODE)',
  data: {
    token: 'fallback_token_abc123',
    user: { ... }
  }
}
```

---

## 3. **PesananPage.jsx - Pre-fetch Token Check**

### Perubahan:
- ✅ Check token & user saat component mount
- ✅ Redirect to login jika tidak ada
- ✅ debugAuth() saat mount
- ✅ Small delay (100ms) sebelum fetch data
- ✅ Cleanup timer on unmount

### Flow Check:
```javascript
useEffect(() => {
  // 1. Debug current auth state
  debugAuth();
  
  // 2. Check token exists
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // 3. Redirect if not authenticated
  if (!token || !user) {
    alert('Anda belum login');
    navigate('/login');
    return;
  }
  
  // 4. Small delay for localStorage sync
  setTimeout(() => {
    fetchOrders();
  }, 100);
}, []);
```

---

## 4. **sellerOrderAPI.js - Enhanced Debugging**

### Logging yang Ditambahkan:
```javascript
✅ Token ditemukan: eyJhbGciOiJIUzI1NiIs...
👤 User info: { username: 'seller1', role: 'seller', userId: 2 }
📡 Fetching orders with params: { status: 'all', page: 1, limit: 10 }
📦 Orders response: { success: true, data: {...} }
```

### Error Handling:
```javascript
❌ 401 Unauthorized - Token invalid atau expired
📝 Response data: { error: 'Invalid token' }
❌ API Error: { status: 401, statusText: 'Unauthorized', error: '...' }
```

---

## 📋 Testing Checklist

### **Step 1: Clear All Data**
```javascript
// Buka Console (F12) dan jalankan:
localStorage.clear();
location.reload();
```

### **Step 2: Login**
1. Buka http://localhost:5173/login
2. Masukkan credentials
3. **Perhatikan Console Log:**
   ```
   🔐 Attempting login for: seller@example.com
   📥 Login response: { status: 200, ok: true, result: {...} }
   ✅ Login successful: { username: 'seller1', role: 'seller', userId: 2 }
   ✅ Auth data saved: { token: '...', user: {...} }
   📥 Login result: { success: true, data: {...} }
   ✅ Token saved to localStorage
   👤 User: { username: 'seller1', ... }
   🔍 Auth Debug Info: { hasToken: true, isAuthenticated: true }
   ✅ Verification passed - token and user saved
   🔄 Redirecting to: /seller/dashboard
   ```

### **Step 3: Check localStorage**
```javascript
// Setelah login, cek di Console:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**Expected Output:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User: {"user_id":2,"username":"seller1","email":"seller@example.com","role":"seller"...}
```

### **Step 4: Navigate to PesananPage**
1. Klik menu "Pesanan"
2. **Perhatikan Console:**
   ```
   🔍 PesananPage mounted - checking auth state...
   🔍 Auth Debug Info: { hasToken: true, isAuthenticated: true, ... }
   ✅ Auth check passed - fetching orders...
   ✅ Token ditemukan: eyJhbGciOiJIUzI1NiIs...
   👤 User info: { username: 'seller1', role: 'seller', userId: 2 }
   📡 Fetching orders with params: { status: 'all', page: 1, limit: 10 }
   ```

### **Step 5: Check Network Tab**
1. Buka DevTools > Network
2. Filter: Fetch/XHR
3. Click request ke `/seller/orders`
4. **Check Request Headers:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Content-Type: application/json
   ```

---

## 🔍 Debug dengan AuthDebugPanel

Tambahkan ke halaman untuk debugging visual:

```jsx
// Di src/pages/seller/PesananPage.jsx
import AuthDebugPanel from '../../components/AuthDebugPanel';

// Di return JSX, tambahkan:
{import.meta.env.DEV && <AuthDebugPanel />}
```

Panel akan muncul di kanan bawah dengan info:
- ✅/❌ Authenticated status
- ✅/❌ Has token
- ✅/❌ Token expired
- 📋 Token preview
- 👤 User info lengkap

---

## ⚠️ Common Issues & Solutions

### **Issue 1: Token hilang setelah redirect**
**Penyebab:** LocalStorage belum selesai write sebelum navigate  
**Solusi:** ✅ Sudah ditambahkan delay 1500ms di LoginPage

### **Issue 2: Token ada tapi masih error 401**
**Penyebab:** Token format salah atau backend tidak recognize  
**Solusi:** 
- Check format: `Bearer {token}` bukan `{token}`
- Check token di Network tab
- Verify backend API endpoint

### **Issue 3: "UNAUTHORIZED" error loop**
**Penyebab:** Token expired atau invalid  
**Solusi:**
- Clear localStorage: `localStorage.clear()`
- Login ulang
- Check token expiry time

### **Issue 4: Fallback mode terus menerus**
**Penyebab:** Backend tidak berjalan  
**Solusi:**
- Start backend: `npm run dev` (di folder backend)
- Check backend URL: `http://localhost:5000`
- Verify API endpoint di Network tab

---

## 🎯 Expected Behavior Sekarang

### ✅ **Login Flow:**
1. User login → Token saved (double-save)
2. Verify token saved → Success
3. Debug log → All green
4. Wait 1.5s → Redirect
5. Dashboard load → Token ready

### ✅ **API Call Flow:**
1. Page mount → Check token
2. Token exists → Continue
3. validateAuth() → Pass
4. getAuthHeaders() → Include token
5. API call → Success
6. Data rendered → Done

### ✅ **Error Handling:**
1. Token invalid → 401 caught
2. clearAuth() → Clean localStorage
3. Alert user → "Sesi berakhir"
4. Redirect → /login

---

## 📞 Support

Jika masih ada masalah:

1. **Cek Console Log** - Semua step ter-log dengan emoji
2. **Cek Network Tab** - Lihat request/response
3. **Gunakan AuthDebugPanel** - Visual debugging
4. **Clear & Retry** - localStorage.clear() + login ulang

---

**Last Updated:** November 21, 2025  
**Version:** 2.0 - Enhanced Token Management
