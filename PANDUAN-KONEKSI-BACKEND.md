# 🔧 Panduan Menghubungkan Frontend ke Backend Laragon

## ⚠️ Masalah yang Terjadi

1. **Error "Failed to fetch"** - Backend tidak terhubung
2. **CORS Error** - Backend hanya allow `http://localhost:3000`, frontend di `http://localhost:5173`
3. **Gagal Menyimpan** - Update tidak tersimpan karena backend unavailable

---

## ✅ Solusi Lengkap

### **Langkah 1: Fix CORS di Backend Laragon**

#### **Lokasi Backend:** `C:\laragon\data\mysql-8\idt\`

Buka salah satu file ini (file utama backend):
- `server.js`
- `index.js`  
- `app.js`
- `src/server.js`
- `src/app.js`

#### **Cari kode CORS yang ada:**

```javascript
app.use(cors({
  origin: 'http://localhost:3000'  // ← INI YANG SALAH
}));
```

#### **Ganti dengan:**

**Opsi 1: Support Multiple Origins (Recommended)**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',  // Frontend Vite
    'http://localhost:3000'   // Frontend lama (jika ada)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Opsi 2: Allow All Origins (Development Only)**
```javascript
app.use(cors({
  origin: true,  // Allow semua origin
  credentials: true
}));
```

**Opsi 3: Dynamic CORS (Best Practice)**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

### **Langkah 2: Restart Backend**

Setelah edit file CORS:

**Cara 1: Via Laragon UI**
1. Buka Laragon
2. Klik **"Stop All"**
3. Tunggu 3 detik
4. Klik **"Start All"**

**Cara 2: Via Terminal**
```bash
# Buka PowerShell/CMD
cd C:\laragon\data\mysql-8\idt

# Stop backend yang sedang berjalan
# Windows: Ctrl+C di terminal yang menjalankan backend

# Start ulang backend
npm start
# atau
node server.js
# atau
npm run dev
```

**Cara 3: Paksa Kill Node Process**
```powershell
# Di PowerShell
Get-Process node | Stop-Process -Force
Start-Sleep -Seconds 2
cd C:\laragon\data\mysql-8\idt
npm start
```

---

### **Langkah 3: Verifikasi Backend Berjalan**

**Test 1: Cek Port**
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```
Output harus: `TcpTestSucceeded: True`

**Test 2: Test API Endpoint**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/ecommerce/admin/stores" -Method GET
```

Jika dapat response (bahkan error "Unauthorized"), berarti backend jalan!

**Test 3: Buka di Browser**
```
http://localhost:5000
```
Harus ada response (bukan "This site can't be reached")

---

### **Langkah 4: Refresh Frontend**

Setelah backend restart:

1. **Refresh browser** (`Ctrl+F5` atau `Cmd+Shift+R`)
2. **Buka halaman** `http://localhost:5173/admin/kelola-store`
3. **Cek Console** (`F12` → Console tab)
   - ❌ Jika masih ada error CORS → Backend belum restart atau CORS belum fix
   - ✅ Jika tidak ada error → Backend terhubung!

4. **Cek Warning Banner**
   - ❌ Jika masih ada "Mode Fallback Aktif" → Backend belum terhubung
   - ✅ Jika warning hilang → Backend berhasil terhubung!

---

### **Langkah 5: Test Koneksi**

Buka `http://localhost:5173/test-backend-connection.html` (file yang sudah saya buat):

1. Klik **"Test Backend Status"** → Harus sukses
2. Login dengan admin credentials
3. Klik **"Get Stores"** → Harus dapat data

---

## 🔍 Troubleshooting

### **Problem 1: CORS Error Masih Muncul**

**Symptom:**
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header 
has a value 'http://localhost:3000' that is not equal to the supplied origin.
```

**Artinya:**
- Backend dikonfigurasi untuk `http://localhost:3000`
- Frontend berjalan di `http://localhost:5173`
- **Origin tidak cocok** → Request ditolak

**Solusi:**

1. **Edit CORS di backend:**
   - Lokasi: `C:\laragon\data\mysql-8\idt\`
   - File: `server.js`, `app.js`, atau `index.js`
   - Cari: `app.use(cors({`
   - Ganti `origin: 'http://localhost:3000'` 
   - Jadi: `origin: ['http://localhost:5173', 'http://localhost:3000']`

2. **Restart backend** (WAJIB!):
   - Laragon: Stop All → Start All
   - Terminal: Ctrl+C → npm start

3. **Clear browser cache:**
   - `Ctrl+Shift+Delete`
   - Pilih "Cached images and files"
   - Clear

4. **Hard refresh browser:**
   - `Ctrl+F5` atau `Ctrl+Shift+R`

5. **Coba incognito mode:**
   - `Ctrl+Shift+N`
   - Buka `http://localhost:5173/admin/kelola-store`

---

### **Problem 2: Backend Not Running**

**Symptom:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solusi:**
1. Cek apakah backend berjalan:
   ```powershell
   netstat -ano | findstr :5000
   ```
   Jika ada output → backend jalan
   Jika kosong → backend tidak jalan

2. Start backend manual:
   ```bash
   cd C:\laragon\data\mysql-8\idt
   npm start
   ```

3. Cek error di terminal backend

---

### **Problem 3: Port 5000 Already in Use**

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solusi:**

**Opsi A: Kill process di port 5000**
```powershell
# Cari process ID
netstat -ano | findstr :5000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <PID> /F

# Contoh:
taskkill /PID 12345 /F
```

**Opsi B: Ganti port backend**

Edit file backend (biasanya `server.js`):
```javascript
const PORT = process.env.PORT || 5001;  // Ganti ke 5001
```

Lalu update frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:5001
```

Restart frontend:
```powershell
npm run dev
```

---

### **Problem 4: 404 Not Found**

**Symptom:**
```
GET http://localhost:5000/api/ecommerce/admin/stores 404 (Not Found)
```

**Solusi:**
- Backend jalan, tapi endpoint belum dibuat
- Lihat dokumentasi endpoint yang perlu dibuat di:
  - `docs/Admin-Store-Management-API.md`
  - `docs/Admin-Store-Report-README.md`
  - `docs/Admin-Store-Buyer-Management-Yang-Perlu-Ditambahkan.md`

---

### **Problem 5: 401 Unauthorized**

**Symptom:**
```
{"success": false, "message": "Unauthorized"}
```

**Solusi:**
- Token JWT tidak valid
- Login ulang di frontend
- Cek apakah token tersimpan di localStorage:
  ```javascript
  // Di browser console (F12)
  localStorage.getItem('token')
  ```

---

### **Problem 6: Unexpected token '<', "<!DOCTYPE "... is not valid JSON**

**Symptom:**
```
Gagal mengubah status: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Artinya:**
- Backend mengembalikan **HTML error page** bukan JSON
- Biasanya terjadi karena:
  - Endpoint tidak ditemukan (404)
  - Backend error (500)
  - Route salah
  - Backend mengembalikan halaman error HTML

**Solusi:**

1. **Cek endpoint di browser:**
   ```
   http://localhost:5000/api/ecommerce/admin/stores
   ```
   - Jika muncul halaman HTML → endpoint salah/tidak ada
   - Jika muncul JSON → endpoint benar

2. **Cek response di Network tab:**
   - Buka DevTools (`F12`) → Tab **Network**
   - Klik request yang error
   - Lihat tab **Response**
   - Jika HTML → endpoint belum dibuat di backend

3. **Endpoint belum dibuat:**
   - Backend Anda belum implement endpoint ini
   - Lihat dokumentasi di `docs/Admin-Store-Buyer-Management-Yang-Perlu-Ditambahkan.md`
   - Endpoint yang perlu dibuat:
     ```
     GET  /api/ecommerce/admin/stores
     GET  /api/ecommerce/admin/stores/:sellerId
     PUT  /api/ecommerce/admin/stores/:sellerId/status
     GET  /api/ecommerce/admin/store-reports
     GET  /api/ecommerce/admin/store-reports/statistics
     PUT  /api/ecommerce/admin/store-reports/:reportId/status
     ```

4. **Gunakan Fallback Mode sementara:**
   - Frontend sudah support fallback mode
   - Data akan tersimpan di local state
   - Tunggu backend implement endpoint, baru data tersimpan permanent

---

## 📋 Checklist Koneksi Backend

Gunakan checklist ini untuk memastikan semua sudah benar:

### **Backend (Laragon)**
- [ ] Backend folder ada di `C:\laragon\data\mysql-8\idt\`
- [ ] File `server.js` atau `app.js` ada
- [ ] CORS sudah dikonfigurasi untuk `http://localhost:5173`
- [ ] Backend sudah di-restart setelah edit CORS
- [ ] Backend berjalan di port 5000 (cek dengan `netstat -ano | findstr :5000`)
- [ ] MySQL/Database sudah berjalan di Laragon
- [ ] Test endpoint dengan Postman/browser berhasil

### **Frontend (fecommerce)**
- [ ] File `.env` berisi `VITE_API_BASE_URL=http://localhost:5000`
- [ ] Frontend berjalan di `http://localhost:5173`
- [ ] Browser console tidak ada error CORS
- [ ] Warning "Mode Fallback" TIDAK muncul
- [ ] Login berhasil dan dapat token
- [ ] Data toko/laporan muncul dari backend (bukan fallback)

---

## 🎯 Quick Fix (Paling Cepat)

Jika bingung dengan langkah di atas, lakukan ini:

1. **Buka backend di VSCode:**
   ```powershell
   code C:\laragon\data\mysql-8\idt
   ```

2. **Cari file yang ada `app.use(cors(`**
   - Tekan `Ctrl+Shift+F`
   - Cari: `cors(`
   - Edit file yang muncul

3. **Ganti jadi ini:**
   ```javascript
   app.use(cors({
     origin: true,
     credentials: true
   }));
   ```

4. **Restart Laragon:**
   - Klik Stop All
   - Klik Start All

5. **Refresh Browser:**
   - `Ctrl+F5` di halaman kelola-store

6. **Cek:** Warning "Mode Fallback" harus HILANG

---

## 📞 Bantuan Lebih Lanjut

Jika masih bermasalah, beri tahu saya:

1. **Error message** di browser console (F12)
2. **Error message** di terminal backend
3. **Screenshot** halaman yang error
4. **Hasil command:**
   ```powershell
   netstat -ano | findstr :5000
   Test-NetConnection localhost -Port 5000
   ```

Saya akan bantu debug lebih detail! 🚀
