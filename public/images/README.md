# Panduan Gambar Produk

## Struktur Folder Gambar

```
public/
└── images/
    ├── products/         # Gambar produk
    │   ├── phone1.jpg
    │   ├── laptop1.jpg
    │   ├── shirt1.jpg
    │   └── ...
    ├── banners/          # Banner promosi
    ├── categories/       # Icon kategori
    └── users/            # Avatar user
```

## Spesifikasi Gambar Produk

### Ukuran yang Disarankan
- **Gambar Produk**: 800x800px (rasio 1:1)
- **Banner Hero**: 1920x600px
- **Icon Kategori**: 200x200px
- **Avatar User**: 200x200px

### Format File
- **Format**: JPG, PNG, WebP
- **Ukuran File**: Maksimal 500KB per gambar
- **Kompresi**: Gunakan TinyPNG atau ImageOptim

## Cara Menambahkan Gambar

### 1. Gambar Produk Baru

Letakkan file gambar di folder `public/images/products/`

Contoh:
```
public/images/products/smartphone-gaming.jpg
public/images/products/laptop-asus.jpg
```

### 2. Update Data Produk

Edit file `HomePage-New.jsx` pada bagian `sampleProducts`:

```javascript
{
  id: 9,
  name: "Nama Produk Baru",
  price: 1000000,
  image: "/images/products/nama-file-gambar.jpg", // Path relatif dari public
  rating: 4.5,
  reviews: 100,
  category: "Elektronik",
  badge: "New"
}
```

### 3. Fallback Gambar

Jika gambar tidak tersedia, sistem akan otomatis menampilkan placeholder:
- URL placeholder: `https://via.placeholder.com/300x300?text=Produk`

## Tips Optimasi Gambar

1. **Kompres gambar** sebelum upload
2. **Gunakan WebP** untuk ukuran lebih kecil
3. **Buat thumbnail** untuk listing produk
4. **Lazy loading** untuk performa lebih baik

## Contoh Gambar Gratis

Sumber gambar produk gratis:
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

## Struktur Nama File

Gunakan naming convention yang konsisten:
```
kategori-nama-produk-varian.jpg

Contoh:
- elektronik-smartphone-samsung-black.jpg
- fashion-kaos-polos-white.jpg
- gadget-smartwatch-series8.jpg
```
