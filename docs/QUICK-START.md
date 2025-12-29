# Quick Start Guide - E-Commerce Pages

## 🚀 Mulai Cepat

### 1. File yang Sudah Dibuat

✅ **LandingPage-New.jsx** + CSS - Halaman utama  
✅ **HomePage-New.jsx** + CSS - Dashboard produk dengan login modal  
✅ **ProductCard.jsx** + CSS - Komponen card produk (reusable)  
✅ **Folder images** - Struktur folder untuk gambar  

---

## 📝 Cara Menggunakan

### Step 1: Aktifkan Halaman Baru

File `App.jsx` sudah di-update untuk menggunakan halaman baru:

```javascript
// ✅ Sudah dilakukan
import LandingPage from './pages/LandingPage-New';
import HomePage from './pages/HomePage-New';
```

### Step 2: Akses Halaman

- **Landing Page**: `http://localhost:5173/`
- **Home/Dashboard**: `http://localhost:5173/home`

---

## 🖼️ Cara Menambahkan Gambar Produk

### Langkah-langkah:

1. **Siapkan gambar** (800x800px, format JPG/PNG)
2. **Letakkan di**: `public/images/products/`
3. **Edit data produk** di `HomePage-New.jsx`:

```javascript
const sampleProducts = [
  // ... produk yang ada
  
  // Tambah produk baru
  {
    id: 9,
    name: "Produk Baru Saya",
    price: 500000,
    image: "/images/products/produk-baru.jpg", // ← Path gambar
    rating: 4.5,
    reviews: 50,
    category: "Elektronik",
    badge: "New" // Optional: "New", "Promo", "Best Seller"
  }
];
```

4. **Refresh browser** - Produk baru muncul!

---

## 🎨 Cara Mengubah Warna/Style

### Contoh: Ubah Warna Primary (Biru → Merah)

**File**: `HomePage.module.css`

```css
/* Cari semua yang warna biru (#2563eb) */
.btnPrimary {
  background-color: #ef4444; /* Merah */
}

.btnIconPrimary {
  background-color: #ef4444; /* Merah */
}

.productPrice {
  color: #ef4444; /* Merah */
}
```

### Contoh: Ubah Hero Gradient

**File**: `LandingPage.module.css`

```css
.landingPage {
  /* Dari biru → Ubah ke warna lain */
  background: linear-gradient(to bottom, #10b981, #34d399, #ffffff);
  /* Hijau gradient */
}
```

---

## ⚙️ Fitur Login Modal

### Cara Kerja:
1. User **belum login**
2. Klik button **"Keranjang"** atau **"Chat"**
3. Modal muncul → User diminta login/daftar
4. Setelah login → Action dilanjutkan

### Cara Customize Modal:

**File**: `HomePage-New.jsx`

```javascript
// Cari bagian modal (line ~280-an)
<div className={styles.modal}>
  <h3 className={styles.modalTitle}>
    Login Diperlukan {/* ← Ubah judul */}
  </h3>
  
  <p className={styles.modalText}>
    Anda harus login terlebih dahulu untuk {loginAction}.
    {/* ← Ubah pesan */}
  </p>
  
  <button className={styles.btnModalPrimary}>
    Login {/* ← Ubah text button */}
  </button>
</div>
```

---

## 🎯 Contoh Penggunaan ProductCard

Komponen `ProductCard` bisa digunakan di halaman manapun:

```javascript
import ProductCard from '../components/ProductCard';

function MyPage() {
  const products = [...]; // Array produk
  
  const handleAddToCart = (productId) => {
    console.log("Tambah ke cart:", productId);
  };
  
  const handleChat = (productId) => {
    console.log("Buka chat:", productId);
  };
  
  const showLoginModal = (message) => {
    alert(message); // Atau tampilkan modal
  };
  
  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onCartClick={handleAddToCart}
          onChatClick={handleChat}
          onLoginRequired={showLoginModal}
        />
      ))}
    </div>
  );
}
```

---

## 📊 Struktur Data Produk

```javascript
{
  id: 1,                              // Required: Unique ID
  name: "Nama Produk",                // Required: Nama produk
  price: 1000000,                     // Required: Harga (number)
  image: "/images/products/img.jpg",  // Required: Path gambar
  rating: 4.5,                        // Required: Rating (0-5)
  reviews: 100,                       // Required: Jumlah review
  category: "Elektronik",             // Required: Kategori
  badge: "New",                       // Optional: Badge (New/Promo/Best Seller)
  originalPrice: 1500000,             // Optional: Harga asli (untuk diskon)
  discount: 33,                       // Optional: Persentase diskon
  sold: 250                           // Optional: Jumlah terjual
}
```

---

## 🔧 Troubleshooting

### ❌ Gambar tidak muncul
```
✅ Solusi:
1. Cek path: /images/products/nama-file.jpg
2. Pastikan file ada di folder public/images/products/
3. Refresh browser (Ctrl + F5)
4. Lihat console untuk error
```

### ❌ Modal tidak muncul
```
✅ Solusi:
1. Pastikan belum login (localStorage kosong)
2. Cek state showLoginModal di React DevTools
3. Cek console untuk error
```

### ❌ Style tidak berubah
```
✅ Solusi:
1. Pastikan edit file .module.css yang benar
2. Clear cache browser
3. Restart dev server (npm run dev)
4. Cek typo di nama class
```

---

## 📱 Responsive Breakpoints

Semua halaman sudah responsive dengan breakpoints:

```css
/* Mobile: < 768px */
- 1-2 kolom grid
- Font lebih kecil
- Padding minimal

/* Tablet: 768px - 1024px */
- 2-3 kolom grid
- Font sedang

/* Desktop: > 1024px */
- 4 kolom grid
- Font penuh
- Padding optimal
```

---

## 🎁 Bonus: Kategori Produk

Kategori yang sudah ada:
- ✅ Semua
- ✅ Elektronik
- ✅ Fashion
- ✅ Olahraga
- ✅ Makanan
- ✅ Kesehatan

**Cara tambah kategori**:

**File**: `HomePage-New.jsx`

```javascript
// Cari line ~75
const categories = [
  "Semua", 
  "Elektronik", 
  "Fashion", 
  "Olahraga", 
  "Makanan", 
  "Kesehatan",
  "Kecantikan", // ← Tambah di sini
  "Furniture"   // ← Tambah di sini
];
```

---

## 📚 Dokumentasi Lengkap

Baca dokumentasi lengkap di:
📄 `docs/E-Commerce-Pages-Structure.md`

Yang mencakup:
- ✅ Penjelasan semua file
- ✅ Cara customization lengkap
- ✅ Best practices
- ✅ Optimasi tips
- ✅ Integration guide

---

## ✨ Next Steps

### Rekomendasi pengembangan:

1. **Tambahkan gambar produk real**
   - Download dari Unsplash/Pexels
   - Letakkan di `public/images/products/`
   - Update data produk

2. **Customize warna theme**
   - Edit file `.module.css`
   - Sesuaikan dengan brand

3. **Integrasi dengan backend**
   - Ganti `sampleProducts` dengan API call
   - Implementasi add to cart real
   - Connect dengan database

4. **Tambah fitur**
   - Pagination
   - Sort & filter
   - Wishlist
   - Quick view

---

## 💡 Tips

### ✅ DO:
- Kompres gambar sebelum upload (max 500KB)
- Gunakan CSS modules untuk isolasi style
- Buat komponen reusable seperti ProductCard
- Test responsive di berbagai device

### ❌ DON'T:
- Jangan upload gambar terlalu besar (> 1MB)
- Jangan edit file langsung di production
- Jangan hardcode warna di JSX
- Jangan lupa alt text pada image

---

## 📞 Support

Jika ada pertanyaan:
1. Baca dokumentasi lengkap
2. Cek contoh kode di file
3. Lihat console browser untuk error
4. Gunakan React DevTools untuk debugging

---

**Happy Coding! 🚀**
