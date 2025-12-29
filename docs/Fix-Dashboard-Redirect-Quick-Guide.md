# 🔧 Fix Dashboard Redirect Issue - Quick Guide

## Masalah
User dengan role "buyer" setelah login redirect kembali ke `/login` saat mengakses `/buyer/dashboard`.

---

## ✅ **SOLUSI CEPAT (Recommended)**

### Option 1: Quick Login dengan Test User

1. **Buka browser DevTools** (tekan F12)
2. **Buka tab Console**
3. **Jalankan command berikut:**

```javascript
// Setup test users (one time only)
setupTestUsers();

// Login langsung sebagai buyer
loginAsTestBuyer();
```

4. **Otomatis redirect** ke `/buyer/dashboard` ✅

#### Alternative Test Logins:
```javascript
loginAsTestSeller();  // Login sebagai seller
loginAsTestAdmin();   // Login sebagai admin
```

---

### Option 2: Fix Existing User Data

Jika sudah punya account tapi tidak bisa akses dashboard:

```javascript
// 1. Cek auth state dulu
checkAuth();

// 2. Jika role tidak ada/salah, fix manual:
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'buyer';      // Set role
user.roles = ['buyer'];   // Set roles array
localStorage.setItem('user', JSON.stringify(user));

// 3. Reload page
location.reload();
```

---

### Option 3: Reset Complete (Nuclear Option)

Jika semua tidak berhasil:

```javascript
// Clear everything
clearAuthData();

// Setup test users
setupTestUsers();

// Login sebagai buyer
loginAsTestBuyer();
```

---

## 🔍 **DEBUGGING**

### Step 1: Cek Auth Status

Di browser console:
```javascript
checkAuth()
```

**Expected Output:**
```javascript
{
  authenticated: true,
  role: "buyer",
  dashboard: "/buyer/dashboard",
  hasToken: true,
  hasUser: true
}
```

### Step 2: Lihat Console Messages

Saat login atau akses dashboard, perhatikan messages:

**✅ SUKSES - Should see:**
```
✅ Login successful
✅ Token saved to localStorage
✅ [ProtectedRoute] Access granted
✅ [BuyerDashboard] User authenticated
```

**❌ ERROR - Might see:**
```
❌ [ProtectedRoute] Not authenticated, redirecting to login
❌ [ProtectedRoute] User does not have required role: buyer
❌ [BuyerDashboard] No auth, redirecting to login
```

### Step 3: Manual LocalStorage Check

Di DevTools → Application → LocalStorage → `http://localhost:5173`

**Required items:**

1. **`token`**
   ```
   Value: "fallback_token_..." or "eyJhbGc..."
   ✅ Must exist
   ```

2. **`user`**
   ```json
   {
     "user_id": 1,
     "username": "buyer1",
     "email": "buyer@test.com",
     "role": "buyer",        // ← CRITICAL
     "roles": ["buyer"],     // ← CRITICAL
     "email_verified": true
   }
   ```
   ✅ Must have `role` OR `roles`

---

## 📝 **TEST CREDENTIALS**

Setelah run `setupTestUsers()`:

### 🛒 Buyer Account
```
Email: buyer@test.com
Password: buyer123
Dashboard: /buyer/dashboard
```

### 🏪 Seller Account
```
Email: seller@test.com
Password: seller123
Dashboard: /seller/dashboard
```

### 👨‍💼 Admin Account
```
Email: admin@test.com
Password: admin123
Dashboard: /admin/dashboard
```

---

## 🛠️ **DEVELOPMENT TOOLS**

### Available Console Commands:

| Command | Description |
|---------|-------------|
| `checkAuth()` | Check current auth status |
| `setupTestUsers()` | Create test users (buyer/seller/admin) |
| `loginAsTestBuyer()` | Instant login as buyer + redirect |
| `loginAsTestSeller()` | Instant login as seller + redirect |
| `loginAsTestAdmin()` | Instant login as admin + redirect |
| `clearAuthData()` | Logout + clear all auth data |

### URL Parameters:

- `?debug=auth` - Auto-run checkAuth() on page load
- `?setup=users` - Auto-setup test users on page load

**Example:**
```
http://localhost:5173/?debug=auth&setup=users
```

---

## 🔧 **COMMON FIXES**

### Fix 1: Role is Undefined
```javascript
const user = JSON.parse(localStorage.getItem('user'));
if (!user.role && !user.roles) {
  user.role = 'buyer';
  user.roles = ['buyer'];
  localStorage.setItem('user', JSON.stringify(user));
  location.reload();
}
```

### Fix 2: Token Missing
```javascript
if (!localStorage.getItem('token')) {
  localStorage.setItem('token', 'fallback_token_manual');
  location.reload();
}
```

### Fix 3: User Data Corrupt
```javascript
// Remove corrupt data
localStorage.removeItem('user');
localStorage.removeItem('token');

// Login again or use loginAsTestBuyer()
loginAsTestBuyer();
```

---

## 📋 **TESTING CHECKLIST**

Sebelum melaporkan bug, test dulu:

- [ ] Run `checkAuth()` - apakah authenticated: true?
- [ ] Check localStorage - apakah token & user ada?
- [ ] Check user.role atau user.roles - apakah "buyer"?
- [ ] Coba `loginAsTestBuyer()` - apakah berhasil?
- [ ] Clear cache browser - masih error?
- [ ] Check console messages - ada error apa?

---

## 🐛 **TROUBLESHOOTING FLOWCHART**

```
Start: Cannot access /buyer/dashboard
│
├─> Run checkAuth()
│   │
│   ├─> authenticated: false
│   │   └─> Run: loginAsTestBuyer()
│   │       └─> ✅ FIXED
│   │
│   └─> authenticated: true, role: undefined
│       └─> Fix role (see Fix 1 above)
│           └─> ✅ FIXED
│
└─> Still not working?
    └─> Run: clearAuthData() + setupTestUsers() + loginAsTestBuyer()
        └─> ✅ FIXED
```

---

## 📚 **ADDITIONAL RESOURCES**

- **Full Troubleshooting Guide**: `docs/Troubleshooting-Buyer-Dashboard-Redirect.md`
- **Auth Debug Script**: `public/auth-debug.js`
- **Test Users Script**: `public/test-users.js`

---

## 🚀 **QUICK START**

**Cara tercepat untuk testing:**

1. Open browser → http://localhost:5173
2. Press F12 (DevTools)
3. Console tab
4. Run:
   ```javascript
   setupTestUsers();
   loginAsTestBuyer();
   ```
5. Enjoy! ✅

---

## ⚡ **ONE-LINER SOLUTIONS**

Copy-paste di console:

```javascript
// Quick buyer login
setupTestUsers();loginAsTestBuyer();

// Quick seller login
setupTestUsers();loginAsTestSeller();

// Quick admin login
setupTestUsers();loginAsTestAdmin();

// Debug current state
checkAuth();

// Nuclear reset
clearAuthData();setupTestUsers();loginAsTestBuyer();
```

---

**Created:** ${new Date().toISOString()}
**Last Updated:** ${new Date().toISOString()}

Need more help? Check the full troubleshooting guide! 🎯
