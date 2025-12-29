# Struktur Halaman E-Commerce

## Overview

Semua halaman e-commerce telah dipisahkan menjadi file JSX dan CSS terpisah untuk memudahkan maintenance dan customization.

## Struktur Folder

```
src/
├── pages/
│   ├── LandingPage-New.jsx          # Halaman utama
│   ├── LandingPage.module.css       # Style landing page
│   ├── HomePage-New.jsx             # Dashboard produk
│   ├── HomePage.module.css          # Style home page
│   └── ...
├── components/
│   ├── ProductCard.jsx              # Komponen card produk (reusable)
│   ├── ProductCard.module.css       # Style product card
│   └── ...
public/
└── images/
    ├── products/                    # Folder gambar produk
    ├── banners/                     # Folder banner
    └── README.md                    # Panduan gambar
```

## Halaman yang Telah Dibuat

### 1. LandingPage-New.jsx
**File**: `src/pages/LandingPage-New.jsx`  
**CSS**: `src/pages/LandingPage.module.css`  
**Route**: `/`

**Fitur**:
- Hero section dengan gradient background
- Animated decorative dots
- Feature cards (4 fitur utama)
- CTA buttons (Masuk & Daftar)
- Responsive design

**Cara Edit**:
```javascript
// Edit teks hero
<h1 className={styles.heroTitle}>
  Selamat Datang di E-Commerce  {/* Ubah judul di sini */}
</h1>

// Edit feature cards
<h3 className={styles.featureTitle}>Produk Berkualitas</h3>  {/* Ubah judul fitur */}
```

**Cara Edit CSS**:
```css
/* File: LandingPage.module.css */

/* Ubah warna gradient */
.landingPage {
  background: linear-gradient(to bottom, #3b82f6, #93c5fd, #ffffff);
}

/* Ubah ukuran hero title */
.heroTitle {
  font-size: 3.5rem; /* Ubah ukuran */
}
```

---

### 2. HomePage-New.jsx
**File**: `src/pages/HomePage-New.jsx`  
**CSS**: `src/pages/HomePage.module.css`  
**Route**: `/home`

**Fitur**:
- Navbar dengan auth status
- Hero banner dengan search bar
- Filter kategori produk
- Product grid dengan cards
- Login modal untuk fitur yang butuh auth
- Loading state & empty state

**Data Produk**:
```javascript
// Edit di file HomePage-New.jsx
const sampleProducts = [
  {
    id: 1,
    name: "Smartphone Gaming ROG Phone 7",
    price: 12500000,
    image: "/images/products/phone1.jpg",  // Path gambar
    rating: 4.8,
    reviews: 156,
    category: "Elektronik",
    badge: "Best Seller"  // Optional: "New", "Promo", "Best Seller"
  },
  // Tambahkan produk lainnya...
];
```

**Cara Tambah Produk Baru**:
1. Siapkan gambar produk (800x800px, format JPG/PNG)
2. Letakkan di folder `public/images/products/`
3. Tambahkan data produk di array `sampleProducts`
4. Refresh halaman

**Cara Edit Style**:
```css
/* File: HomePage.module.css */

/* Ubah warna hero banner */
.heroBanner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Ubah jumlah kolom grid */
.productsGrid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Ubah minmax */
}
```

**Login Modal**:
- Muncul otomatis saat user belum login dan menekan tombol keranjang/chat
- Menampilkan opsi Login atau Daftar
- Bisa di-customize di bagian modal

---

### 3. ProductCard.jsx (Komponen Reusable)
**File**: `src/components/ProductCard.jsx`  
**CSS**: `src/components/ProductCard.module.css`

**Props**:
```javascript
<ProductCard 
  product={productData}           // Object produk
  onCartClick={(id) => {...}}     // Callback saat klik keranjang
  onChatClick={(id) => {...}}     // Callback saat klik chat
  onLoginRequired={(msg) => {...}} // Callback saat butuh login
/>
```

**Fitur**:
- Image hover effect
- Badge (New, Promo, Best Seller)
- Rating bintang
- Format harga Rupiah
- Button keranjang & chat
- Auto-check authentication
- Responsive design

**Cara Gunakan di Halaman Lain**:
```javascript
import ProductCard from '../components/ProductCard';

// Di dalam component
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
```

---

## Cara Menambahkan Gambar

### 1. Siapkan Gambar
- **Ukuran**: 800x800px (rasio 1:1)
- **Format**: JPG, PNG, atau WebP
- **Ukuran file**: Maksimal 500KB
- **Kompresi**: Gunakan [TinyPNG](https://tinypng.com)

### 2. Upload ke Folder
Letakkan file di: `public/images/products/`

Contoh nama file:
```
elektronik-smartphone-samsung.jpg
fashion-kaos-polos-hitam.jpg
gadget-smartwatch-apple.jpg
```

### 3. Update Data Produk
```javascript
// Di HomePage-New.jsx
{
  id: 9,
  name: "Nama Produk",
  price: 1000000,
  image: "/images/products/nama-file.jpg", // Path relatif dari public
  rating: 4.5,
  reviews: 100,
  category: "Elektronik",
  badge: "New"
}
```

---

## Customization Guide

### Mengubah Warna Theme

**File**: Setiap `.module.css` file

```css
/* Primary Color (Biru) */
.btnPrimary {
  background-color: #2563eb; /* Ubah kode warna */
}

/* Gradient Background */
.heroBanner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Ubah warna gradient */
}
```

### Mengubah Font

**File Global**: `src/index.css`

```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### Mengubah Layout Grid

```css
/* 3 kolom di desktop */
.productsGrid {
  grid-template-columns: repeat(3, 1fr);
}

/* 4 kolom di desktop */
.productsGrid {
  grid-template-columns: repeat(4, 1fr);
}

/* Auto responsive */
.productsGrid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

### Mengubah Ukuran Card

```css
.productCard {
  /* Tambah padding */
  padding: 1.5rem;
  
  /* Ubah border radius */
  border-radius: 1rem;
  
  /* Ubah shadow */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Fitur Login Modal

### Cara Kerja
1. User klik button "Keranjang" atau "Chat" tanpa login
2. Modal login muncul otomatis
3. User bisa pilih "Login" atau "Daftar"
4. Setelah login, action dilanjutkan

### Customize Modal

```javascript
// Di HomePage-New.jsx
{showLoginModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>Login Diperlukan</h3> {/* Ubah judul */}
      <p>Anda harus login untuk {loginAction}</p> {/* Ubah pesan */}
      
      {/* Ubah button text */}
      <button onClick={...}>Daftar</button>
      <button onClick={...}>Login</button>
    </div>
  </div>
)}
```

### Customize Modal Style

```css
/* File: HomePage.module.css */

.modal {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem; /* Ubah padding */
  max-width: 400px; /* Ubah lebar */
}

.modalOverlay {
  background-color: rgba(0, 0, 0, 0.5); /* Ubah opacity */
}
```

---

## Responsive Design

Semua halaman sudah responsive. Breakpoints:

```css
/* Mobile First Approach */

/* Tablet (768px ke atas) */
@media (min-width: 768px) {
  .heroTitle {
    font-size: 2rem;
  }
}

/* Desktop (1024px ke atas) */
@media (min-width: 1024px) {
  .heroTitle {
    font-size: 3.5rem;
  }
}
```

---

## Best Practices

### 1. Naming Convention
```
- File JSX: PascalCase (HomePage.jsx)
- File CSS: match JSX name (HomePage.module.css)
- Class names: camelCase (productCard, heroTitle)
- Images: kebab-case (smartphone-gaming.jpg)
```

### 2. Import CSS Modules
```javascript
import styles from './HomePage.module.css';

// Gunakan dengan className
<div className={styles.container}>
```

### 3. Conditional Classes
```javascript
<button className={`${styles.btn} ${isActive ? styles.active : ''}`}>
```

### 4. Image Optimization
- Kompres gambar sebelum upload
- Gunakan WebP untuk ukuran lebih kecil
- Implementasi lazy loading
- Tambahkan alt text untuk SEO

---

## Troubleshooting

### Gambar Tidak Muncul
1. Pastikan path benar: `/images/products/nama-file.jpg`
2. Cek nama file tidak ada typo
3. Pastikan file ada di folder `public/images/products/`
4. Refresh browser (Ctrl + F5)

### Style Tidak Berubah
1. Pastikan import CSS module benar
2. Clear cache browser
3. Restart dev server
4. Cek nama class tidak typo

### Modal Tidak Muncul
1. Cek state `showLoginModal` ter-update
2. Cek z-index modal overlay
3. Cek function `isAuthenticated()` berjalan

---

## Next Steps

### Integrasi dengan Backend
```javascript
// Ganti sample products dengan API call
useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);
```

### Tambah Fitur
- [ ] Pagination produk
- [ ] Sort by price/rating
- [ ] Wishlist
- [ ] Quick view modal
- [ ] Product comparison
- [ ] Recently viewed

### Optimasi
- [ ] Lazy loading images
- [ ] Infinite scroll
- [ ] Virtual scrolling untuk banyak produk
- [ ] Service Worker untuk PWA
- [ ] Code splitting

---

## Support

Untuk pertanyaan atau issues:
1. Baca dokumentasi ini terlebih dahulu
2. Cek file `public/images/README.md` untuk panduan gambar
3. Lihat contoh kode di setiap file

## Changelog

### Version 1.0.0 (2025-12-01)
- ✅ Initial release
- ✅ Landing page with modular CSS
- ✅ Home page with product grid
- ✅ Reusable ProductCard component
- ✅ Login modal integration
- ✅ Responsive design
- ✅ Image folder structure
