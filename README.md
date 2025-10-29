# FE E-Commerce (React + Vite)

Proyek frontend e-commerce sederhana menggunakan React, Vite, dan React Router. Termasuk keranjang belanja dengan penyimpanan di localStorage dan data produk dummy.

## Fitur
- Routing: Home, Products, Product Detail, Cart, Checkout
- Keranjang belanja (add/remove/update/clear) tersimpan di localStorage
- Komponen UI sederhana (Navbar, ProductCard)
- Data produk dummy di `src/shared/data/products.js`
 - Seller area: Dasbor, Produk, Pesanan (untuk penjual)

## Jalankan di lokal (Windows PowerShell)
1. Install dependencies
```powershell
npm install
```
2. Jalankan server dev
```powershell
npm run dev
```
3. Build produksi
```powershell
npm run build
npm run preview
```

## Struktur Folder
- `src/App.jsx` - Routing dan shell aplikasi
- `src/context/CartContext.jsx` - State keranjang
- `src/context/ProductsContext.jsx` - State produk + CRUD
- `src/pages/*` - Halaman
- `src/components/*` - Komponen UI
- `src/shared/data/products.js` - Data dummy
 - `src/seller/*` - Halaman area penjual

## Catatan
- Ganti data produk dengan API asli ketika siap. Buat service di `src/shared/services` dan panggil di halaman Products/ProductDetail.
- Tambahkan styling/komponen sesuai kebutuhan (Tailwind, Chakra UI, dsb).

### Seller
 - URL: `/seller`
 - Orders muncul setelah melakukan checkout; tersimpan di `localStorage` (`orders:v1`).
