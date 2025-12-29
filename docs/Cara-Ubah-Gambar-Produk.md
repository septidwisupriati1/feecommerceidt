# 📸 Cara Mengubah Gambar Produk di Card

## 🎯 Lokasi File

Gambar produk ditampilkan di:
- **File**: `src/pages/ProductPage.jsx`
- **Line**: 252-265
- **Komponen**: Product Card Grid

---

## 📍 Cara Mengubah Gambar

### **1️⃣ Cara Normal (dari Backend)**

Ini cara yang direkomendasikan untuk production:

1. **Login** sebagai Seller
2. Pergi ke **Dashboard Seller** → **Kelola Produk**
3. Klik **Edit** pada produk yang ingin diubah
4. **Upload gambar baru** di form edit
5. Klik **Simpan**
6. Gambar otomatis update di katalog produk

**Path gambar di database**: 
```
product.primary_image = "http://localhost:5000/uploads/products/nama-file.jpg"
```

---

### **2️⃣ Ubah Icon Default (📦 → 🛍️)**

Jika tidak ada gambar, muncul icon default. Untuk mengubahnya:

**File**: `src/pages/ProductPage.jsx`

**Cari baris ini** (sekitar line 261):
```jsx
<div className="text-6xl">🛍️</div>
```

**Ganti dengan icon lain**:
```jsx
<div className="text-6xl">🎁</div>  // Hadiah
<div className="text-6xl">📦</div>  // Paket
<div className="text-6xl">🛒</div>  // Keranjang
<div className="text-6xl">🏪</div>  // Toko
<div className="text-6xl">📱</div>  // Elektronik
<div className="text-6xl">👕</div>  // Fashion
```

---

### **3️⃣ Ganti Placeholder Error Image**

Jika gambar gagal dimuat, akan muncul placeholder. Untuk mengubahnya:

**File**: `src/pages/ProductPage.jsx`

**Cari baris ini** (sekitar line 257):
```jsx
onError={(e) => {
  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
}}
```

**Opsi lain**:
```jsx
// Placeholder dengan teks custom
e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=Gambar+Tidak+Tersedia';

// Atau gunakan gambar lokal
e.target.src = '/images/placeholder-product.png';
```

---

### **4️⃣ Ganti dengan Gambar Lokal (untuk Testing)**

Untuk testing dengan gambar lokal tanpa backend:

**Langkah**:
1. Letakkan gambar di: `public/images/products/test-product.jpg`
2. Edit `ProductPage.jsx`:

```jsx
{product.primary_image ? (
  <img 
    // Ganti dengan path lokal untuk testing
    src="/images/products/test-product.jpg"
    // src={product.primary_image}  // Komen dulu yang asli
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
) : (
  <div className="text-6xl">🛍️</div>
)}
```

⚠️ **Ingat**: Kembalikan ke `src={product.primary_image}` setelah testing!

---

### **5️⃣ Ubah Gradient Background (saat loading)**

Background gradient di belakang gambar:

**File**: `src/pages/ProductPage.jsx` (line 251)

```jsx
<div className={`aspect-square bg-gradient-to-br ${getCategoryGradient(product.category.name)} ...`}>
```

**Fungsi `getCategoryGradient()`** (line 96-109):
```javascript
const getCategoryGradient = (category) => {
  const gradients = {
    'Elektronik': 'from-blue-400 to-blue-600',
    'Fashion': 'from-pink-400 to-pink-600',
    'Makanan': 'from-orange-400 to-orange-600',
    'Olahraga': 'from-green-400 to-green-600',
    'Kesehatan': 'from-purple-400 to-purple-600',
    'default': 'from-gray-400 to-gray-600'
  };
  return gradients[category] || gradients['default'];
};
```

**Cara ubah warna**:
```javascript
'Elektronik': 'from-red-400 to-red-600',      // Merah
'Fashion': 'from-yellow-400 to-yellow-600',   // Kuning
'Makanan': 'from-teal-400 to-teal-600',       // Teal
```

---

## 🖼️ Format Gambar yang Direkomendasikan

### **Spesifikasi**:
- **Ukuran**: 800x800px (rasio 1:1)
- **Format**: JPG, PNG, WebP
- **Ukuran File**: Max 500KB
- **Aspect Ratio**: Square (1:1)

### **Optimasi**:
- Kompres dengan [TinyPNG](https://tinypng.com)
- Convert ke WebP untuk ukuran lebih kecil
- Gunakan lazy loading untuk performa

---

## 🎨 Customization Lanjutan

### **Ubah Style Image Hover**

**File**: `src/pages/ProductPage.jsx` (line 258)

```jsx
className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
```

**Opsi lain**:
```jsx
// Zoom lebih besar
className="... group-hover:scale-110 ..."

// Rotasi sedikit
className="... group-hover:rotate-2 ..."

// Blur saat hover
className="... group-hover:brightness-90 ..."
```

### **Tambah Overlay**

Tambah overlay gelap saat hover:

```jsx
<div className="relative">
  <img src={...} />
  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
</div>
```

---

## 🔧 Troubleshooting

### ❌ Gambar tidak muncul
**Solusi**:
1. Cek console browser untuk error
2. Pastikan URL gambar benar
3. Cek CORS settings di backend
4. Pastikan gambar sudah ter-upload

### ❌ Gambar terpotong/tidak proporsional
**Solusi**:
```jsx
// Ganti object-cover dengan object-contain
className="... object-contain ..."
```

### ❌ Gambar loading lambat
**Solusi**:
1. Kompres gambar
2. Gunakan WebP format
3. Implementasi lazy loading
4. Tambah CDN

---

## 📝 Contoh Lengkap

**Ganti icon default + placeholder + style**:

```jsx
{product.primary_image ? (
  <img 
    src={product.primary_image} 
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
    onError={(e) => {
      e.target.src = '/images/placeholder-product.png';
    }}
    loading="lazy"
  />
) : (
  <div className="text-6xl text-gray-400">
    🏪
  </div>
)}
```

---

## 📚 Referensi Cepat

| Yang Diubah | File | Line | Tujuan |
|------------|------|------|--------|
| Gambar produk | ProductPage.jsx | 252-265 | Tampilan utama |
| Icon default | ProductPage.jsx | 261 | Saat tidak ada gambar |
| Placeholder error | ProductPage.jsx | 257 | Saat gambar error |
| Gradient background | ProductPage.jsx | 96-109 | Background kategori |
| Hover effect | ProductPage.jsx | 258 | Animasi hover |

---

**💡 Tip**: Untuk production, selalu gunakan cara #1 (upload via backend) agar gambar tersimpan permanen di database!
