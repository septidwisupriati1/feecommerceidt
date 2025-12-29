# BuyerNavbar Component - Dokumentasi

## Overview
BuyerNavbar adalah komponen navigasi yang konsisten untuk semua halaman buyer di aplikasi e-commerce. Komponen ini menampilkan logo, menu navigasi, dan action buttons.

## Fitur Utama

### 1. Logo & Brand
- Logo PNG dari `/images/stp.png`
- Title "E-Commerce"
- Klik untuk kembali ke home page

### 2. Navigation Links
Tiga tombol navigasi utama:
- **Beranda** (`/home`) - dengan icon Home
- **Produk** (`/produk`) - dengan icon Package
- **Pesanan Saya** (`/pesanan-saya`) - dengan icon ShoppingCart

**Active State**: Link akan otomatis ter-highlight ketika berada di halaman tersebut

### 3. Action Buttons
Tampilan berbeda berdasarkan status login:

**Belum Login:**
- Button "Masuk" → navigate ke `/login`
- Button "Daftar" → navigate ke `/register`

**Sudah Login:**
- Button "Keranjang" (dengan icon) → navigate ke `/keranjang`
- Button "Profil" → navigate ke `/profil`

## Penggunaan

```jsx
import BuyerNavbar from "../components/BuyerNavbar";

export default function MyPage() {
  return (
    <div>
      <BuyerNavbar />
      {/* Page content */}
    </div>
  );
}
```

## Halaman yang Menggunakan BuyerNavbar

✅ **Sudah Terintegrasi:**
1. HomePage-New.jsx
2. ProductPage.jsx
3. ProductDetailPage.jsx
4. CartPage.jsx
5. CheckoutPage.jsx
6. PaymentPage.jsx
7. MyOrdersPage.jsx
8. OrderDetailPage.jsx

## Styling

File CSS: `BuyerNavbar.module.css`

**Key Features:**
- Gradient background (purple theme)
- Sticky position di top
- Active state untuk current page
- Hover effects
- Fully responsive (desktop, tablet, mobile)

**Mobile Responsive:**
- Logo lebih kecil
- Navigation links hanya tampil icon
- Buttons lebih compact
- Layout menyesuaikan dengan lebar layar

## Breakpoints

```css
@media (max-width: 1024px) - Tablet
@media (max-width: 768px)  - Mobile landscape
@media (max-width: 480px)  - Mobile portrait
```

## Color Scheme

```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Text Color: white
Active Background: white
Active Text: #667eea
Hover: rgba(255, 255, 255, 0.2)
```

## Dependencies

```jsx
import { useNavigate, useLocation } from "react-router-dom"
import { ShoppingCart, Package, Home } from "lucide-react"
import { isAuthenticated } from "../utils/auth"
```

## Logo Requirements

Logo harus berada di: `public/images/stp.png`

Filter CSS yang diterapkan:
```css
filter: brightness(0) invert(1); /* Membuat logo jadi putih */
```

## Tips Development

1. **Menambah Link Baru:**
   - Tambahkan button di `.navbarLinks` section
   - Gunakan `isActive()` function untuk highlight
   - Tambahkan icon dari lucide-react

2. **Custom Styling:**
   - Edit `BuyerNavbar.module.css`
   - Gunakan CSS modules untuk scoped styling
   - Perhatikan responsive breakpoints

3. **Logo:**
   - Pastikan logo ada di folder `public/images/`
   - Ukuran optimal: 40-50px height
   - Format: PNG dengan background transparan

## Troubleshooting

**Logo tidak muncul:**
- Cek path: `/images/stp.png` di folder `public`
- Cek console untuk error 404
- Pastikan file extension benar (case-sensitive)

**Active state tidak bekerja:**
- `useLocation()` hook harus berfungsi
- Path harus exact match
- Cek route di App.jsx

**Buttons tidak navigate:**
- Pastikan routes terdaftar di App.jsx
- Cek console untuk routing errors
- Verify `useNavigate()` hook

## Maintenance Notes

- Update styling di `BuyerNavbar.module.css` untuk consistency
- Test di semua breakpoints setelah perubahan
- Pastikan logo path selalu web-compatible (bukan Windows path)
