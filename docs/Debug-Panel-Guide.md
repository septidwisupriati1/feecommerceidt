# 🔍 Debug Panel - Panduan Lengkap

## 📋 Apa itu Debug Panel?

**Debug Panel** adalah tool development yang muncul di pojok kanan bawah browser untuk menampilkan informasi user yang sedang login. Panel ini sangat berguna untuk:

- ✅ Melihat data user yang sedang login
- ✅ Memeriksa role & permission user
- ✅ Debug masalah autentikasi
- ✅ Quick logout
- ✅ Log detail ke browser console

---

## 🎯 Fitur Debug Panel

### 1️⃣ **User Information**
Menampilkan data user:
- **User ID**: ID unik user di database
- **Username**: Nama user
- **Email**: Email user

### 2️⃣ **Role & Permissions**
Menampilkan role user:
- **Roles (array)**: Role dalam bentuk array `["buyer"]`
- **Role (string)**: Role dalam bentuk string `"buyer"`
- **Normalized Roles**: Role yang sudah dinormalisasi
- **Primary Role**: Role utama user (buyer/seller/admin)

### 3️⃣ **Navigation**
- **Dashboard Path**: Path ke dashboard user
- **Go to Dashboard**: Tombol quick access ke dashboard

### 4️⃣ **Auth Status**
Status autentikasi:
- **Authenticated**: Apakah user sudah login (✅/❌)
- **Token**: Apakah token tersedia (✅/❌)

### 5️⃣ **Action Buttons**
- **Log to Console**: Log semua info detail ke browser console
- **Minimize (➖)**: Minimize panel jadi button kecil
- **Clear & Logout**: Hapus data login dan logout

---

## 📖 Penjelasan Setiap Field

### User ID
```
User ID: 11
```
**Artinya**: User ini memiliki ID 11 di database  
**Kegunaan**: Identifikasi unik user

### Username
```
Username: zahra
```
**Artinya**: User login dengan username "zahra"  
**Kegunaan**: Display name user

### Email
```
Email: zahra@gmail.com
```
**Artinya**: Email user adalah zahra@gmail.com  
**Kegunaan**: Kontak & verifikasi

### Roles (array)
```
Roles (array): ["buyer"]
```
**Artinya**: User memiliki role "buyer" dalam bentuk array  
**Kegunaan**: Sistem menggunakan array untuk multi-role support

### Role (string)
```
Role (string): "buyer"
```
**Artinya**: Role utama user adalah "buyer"  
**Kegunaan**: Primary role untuk routing

### Normalized Roles
```
Normalized Roles: [Pembeli]
```
**Artinya**: Role yang sudah diformat untuk display  
**Kegunaan**: Menampilkan role dalam bahasa yang user-friendly

### Primary Role
```
Primary Role: buyer
```
**Artinya**: Role utama yang digunakan untuk routing  
**Kegunaan**: Menentukan dashboard mana yang akan dibuka

### Dashboard Path
```
Dashboard Path: /buyer/dashboard
```
**Artinya**: User akan diarahkan ke `/buyer/dashboard`  
**Kegunaan**: Default landing page setelah login

### Authenticated
```
Authenticated: ✅ Yes
```
**Artinya**: User sudah terautentikasi (sudah login)  
**Kegunaan**: Cek status login

### Token
```
Token: ✅ Available
```
**Artinya**: Token JWT tersedia di localStorage  
**Kegunaan**: Diperlukan untuk API calls

---

## 🎨 Tampilan Debug Panel

### Mode Normal (Expanded)
```
┌─────────────────────────────────┐
│ 🔍 Debug Info        [DEV]      │
│ [Log to Console]  [➖]          │
├─────────────────────────────────┤
│ 👤 USER INFORMATION             │
│ User ID: 11                     │
│ Username: zahra                 │
│ Email: zahra@gmail.com          │
├─────────────────────────────────┤
│ 🎭 ROLE & PERMISSIONS           │
│ Roles (array): ["buyer"]       │
│ Role (string): "buyer"          │
│ Normalized Roles: [Pembeli]    │
│ Primary Role: BUYER             │
├─────────────────────────────────┤
│ 🚪 NAVIGATION                   │
│ Dashboard Path:                 │
│ /buyer/dashboard                │
│ [Go to Dashboard →]             │
├─────────────────────────────────┤
│ 🔐 AUTH STATUS                  │
│ Authenticated: ✅ Yes           │
│ Token: ✅ Available             │
├─────────────────────────────────┤
│ [🚪 Clear & Logout]             │
│ 💡 Tip: Press F12 to open       │
│    DevTools                     │
└─────────────────────────────────┘
```

### Mode Minimized
```
  🔍  ← Button kecil di pojok kanan bawah
```

---

## 🚀 Cara Menggunakan

### 1. Melihat Info User
Panel otomatis menampilkan info user yang sedang login.

### 2. Log ke Console
Klik button **"Log to Console"** untuk melihat detail lengkap:
```javascript
🔍 FULL USER DEBUG INFO
📋 User Object: { user_id: 11, username: "zahra", ... }
📊 Roles Array: ["buyer"]
🏷️  Role String: "buyer"
✅ Normalized Roles: ["buyer"]
⭐ Primary Role: buyer
🚪 Dashboard Path: /buyer/dashboard
🔐 Token: Available
✔️  Authenticated: true
```

### 3. Minimize Panel
Klik **➖** untuk minimize jika panel mengganggu view.

### 4. Quick Logout
Klik **"Clear & Logout"** untuk:
- Hapus data user dari localStorage
- Hapus token
- Redirect ke halaman login

---

## ⚙️ Kapan Debug Panel Muncul?

### ✅ Muncul saat:
- Development mode (`npm run dev`)
- User sudah login
- Browser sedang aktif

### ❌ Tidak muncul saat:
- Production build (`npm run build`)
- User belum login (menampilkan warning)
- Panel di-minimize manual

---

## 🔧 Troubleshooting

### Panel Tidak Muncul
**Penyebab**: User belum login  
**Solusi**: Login terlebih dahulu

**Penyebab**: Production mode  
**Solusi**: Gunakan development mode (`npm run dev`)

### Menampilkan "No User Logged In"
```
⚠️ No User Logged In
Please login to see debug info
Token: ❌ Missing
```
**Artinya**: Tidak ada user yang login  
**Solusi**: Login melalui halaman `/login`

### Token Missing
```
Token: ❌ Missing
```
**Artinya**: Token tidak tersimpan di localStorage  
**Solusi**: Login ulang

---

## 🎯 Use Cases

### 1. Cek Role User
**Scenario**: Mau tahu user ini buyer atau seller?  
**Cara**: Lihat field **Primary Role**

### 2. Debug Redirect Issue
**Scenario**: User tidak redirect ke dashboard yang benar  
**Cara**: Lihat **Dashboard Path** dan cek apakah sesuai

### 3. Debug Login Issue
**Scenario**: User tidak bisa access fitur tertentu  
**Cara**: Cek **Authenticated** dan **Token** status

### 4. Multi-Role Testing
**Scenario**: Test user dengan multiple roles  
**Cara**: Lihat **Roles (array)** dan **Normalized Roles**

---

## 🛠️ Customization

### Menonaktifkan Debug Panel

**Cara 1**: Hapus komponen dari layout
```jsx
// Hapus atau comment line ini
import DebugPanel from './components/DebugPanel';
<DebugPanel />
```

**Cara 2**: Conditional rendering
```jsx
{process.env.NODE_ENV === 'development' && <DebugPanel />}
```

### Mengubah Posisi Panel

**File**: `DebugPanel.jsx`

```jsx
// Default: bottom-right
className="fixed bottom-4 right-4 ..."

// Bottom-left
className="fixed bottom-4 left-4 ..."

// Top-right
className="fixed top-4 right-4 ..."

// Top-left
className="fixed top-4 left-4 ..."
```

### Mengubah Warna

```jsx
// Default: Dark theme
className="bg-gray-900 text-white ..."

// Light theme
className="bg-white text-gray-900 border border-gray-200 ..."

// Blue theme
className="bg-blue-900 text-white ..."
```

---

## 🔐 Security Note

⚠️ **PENTING**: Debug Panel **HANYA untuk development**!

Panel ini menampilkan informasi sensitif seperti:
- User ID
- Email
- Role & permissions
- Token status

**Jangan aktifkan di production!**

Panel sudah otomatis disabled di production build:
```javascript
if (import.meta.env.PROD) {
  return null; // Auto hide di production
}
```

---

## 📊 Data Flow

```
User Login
    ↓
Save to localStorage
    ↓
DebugPanel reads data
    ↓
Display in UI
    ↓
User can:
- View info
- Log to console
- Quick logout
- Go to dashboard
```

---

## 🎓 Tips & Best Practices

### ✅ DO:
- Gunakan untuk debug masalah auth
- Log to console untuk detail lengkap
- Minimize saat tidak digunakan
- Gunakan Go to Dashboard untuk quick navigation

### ❌ DON'T:
- Jangan aktifkan di production
- Jangan simpan sensitive data di panel
- Jangan lupa logout setelah testing

---

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Added minimize feature
- ✅ Added auth status section
- ✅ Added quick dashboard link
- ✅ Better UI/UX
- ✅ Improved console logging
- ✅ Confirmation dialog for logout

### Version 1.0
- Basic debug info display
- Simple logout button

---

## 🔗 Related Files

- **Component**: `src/components/DebugPanel.jsx`
- **Utils**: `src/utils/auth.js`
- **Utils**: `src/utils/roleHelper.js`
- **API**: `src/services/authAPI.js`

---

## 📞 FAQ

### Q: Apakah Debug Panel aman?
**A**: Ya, untuk development. Otomatis disabled di production.

### Q: Bisa customize tampilan?
**A**: Ya, edit file `DebugPanel.jsx` sesuai kebutuhan.

### Q: Kenapa panel tidak muncul setelah login?
**A**: Pastikan import DebugPanel di file layout/main component.

### Q: Bisa menampilkan info tambahan?
**A**: Ya, tambahkan field baru di component DebugPanel.

---

**💡 Pro Tip**: Gunakan **F12** (DevTools) bersamaan dengan Debug Panel untuk debugging maksimal!
