# Logo E-Commerce

## 📁 File Logo Tersedia

Folder ini berisi logo untuk aplikasi E-Commerce:

- **logo.svg** - Logo SVG (Recommended)
- **logo.png** - Logo PNG (siapkan sendiri)

## 🎨 Cara Mengganti Logo

### 1. Ganti File Logo
Letakkan file logo baru dengan nama:
- `logo.png` (format PNG, 64x64px atau 128x128px)
- `logo.svg` (format SVG, scalable)

### 2. Update Path di Code
File yang menggunakan logo:
- `src/pages/LandingPage-New.jsx`
- `src/pages/HomePage-New.jsx`

Path yang digunakan:
```jsx
<img src="/images/logo.png" alt="Logo" />
```

## 📐 Spesifikasi Logo

### Format PNG
- **Ukuran**: 64x64px, 128x128px, atau 256x256px
- **Background**: Transparan (PNG-24)
- **Format**: PNG
- **Max size**: 50KB

### Format SVG (Recommended)
- **Format**: SVG
- **Scalable**: Ya (tidak pecah di ukuran apapun)
- **Size**: Biasanya < 5KB
- **Warna**: Bisa diubah via CSS

## 🖼️ Placeholder Logo

File `logo.svg` adalah contoh logo placeholder dengan:
- Icon shopping bag
- Background biru (#2563eb)
- Letter "E" di tengah
- Ukuran 64x64px

**Ganti dengan logo asli Anda!**

## 🔧 Tools untuk Membuat Logo

- [Canva](https://canva.com) - Design logo online
- [Figma](https://figma.com) - Professional design
- [LogoMakr](https://logomakr.com) - Simple logo maker
- [Flaticon](https://flaticon.com) - Download icons

## 📝 Cara Export Logo

### Dari Canva/Figma:
1. Export as PNG (transparent background)
2. Ukuran: 128x128px atau 256x256px
3. Format: PNG atau SVG
4. Save ke folder ini dengan nama `logo.png` atau `logo.svg`

### Kompres Logo:
- PNG: [TinyPNG](https://tinypng.com)
- SVG: [SVGOMG](https://jakearchibald.github.io/svgomg/)

## 🎯 Implementasi

Logo sudah diterapkan di:
- ✅ Landing Page (LandingPage-New.jsx)
- ✅ Home/Dashboard (HomePage-New.jsx)

Cukup ganti file `logo.png` atau `logo.svg` di folder ini!
