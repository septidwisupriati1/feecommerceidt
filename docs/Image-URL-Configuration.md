# Image URL Configuration - Frontend

## Overview
Dokumentasi konfigurasi untuk menangani URL gambar dari backend di aplikasi e-commerce frontend.

## Struktur File

### 1. Image Helper Utility
**File:** `src/utils/imageHelper.js`

Utility untuk menangani konversi path gambar relatif dari backend menjadi URL lengkap.

### 2. Environment Configuration
**File:** `.env`

```env
# Backend URL untuk gambar dan static files
VITE_BACKEND_URL=http://localhost:5000
```

**File:** `.env.production` (untuk production)
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

## Fungsi-Fungsi di imageHelper

### 1. `getImageUrl(imagePath, fallback)`
Fungsi utama untuk membuat URL lengkap dari path relatif.

**Parameter:**
- `imagePath` (string): Path relatif gambar dari backend
- `fallback` (string, optional): URL fallback jika gambar tidak valid

**Return:** `string` - URL lengkap gambar

**Contoh:**
```javascript
import { getImageUrl } from '../utils/imageHelper';

const imageUrl = getImageUrl('uploads/products/phone.jpg');
// Result: http://localhost:5000/uploads/products/phone.jpg

const imageUrl2 = getImageUrl('/uploads/products/phone.jpg');
// Result: http://localhost:5000/uploads/products/phone.jpg

// Jika path sudah lengkap, return langsung
const imageUrl3 = getImageUrl('https://example.com/image.jpg');
// Result: https://example.com/image.jpg

// Jika path kosong, return fallback
const imageUrl4 = getImageUrl(null);
// Result: https://via.placeholder.com/400x300?text=No+Image
```

### 2. `getProductImageUrl(imagePath)`
Khusus untuk gambar produk dengan fallback sesuai konteks.

**Contoh:**
```javascript
import { getProductImageUrl } from '../utils/imageHelper';

<img 
  src={getProductImageUrl(product.image_url)} 
  alt={product.name}
/>
```

### 3. `getUserAvatarUrl(imagePath)`
Khusus untuk avatar user.

**Contoh:**
```javascript
import { getUserAvatarUrl } from '../utils/imageHelper';

<img 
  src={getUserAvatarUrl(user.avatar)} 
  alt={user.name}
  className="w-10 h-10 rounded-full"
/>
```

### 4. `getStoreLogoUrl(imagePath)`
Khusus untuk logo toko.

**Contoh:**
```javascript
import { getStoreLogoUrl } from '../utils/imageHelper';

<img 
  src={getStoreLogoUrl(store.logo)} 
  alt={store.name}
/>
```

### 5. `getCategoryIconUrl(imagePath)`
Khusus untuk icon kategori.

**Contoh:**
```javascript
import { getCategoryIconUrl } from '../utils/imageHelper';

<img 
  src={getCategoryIconUrl(category.icon)} 
  alt={category.name}
/>
```

### 6. `handleImageError(event, fallback)`
Menangani error saat gambar gagal dimuat.

**Parameter:**
- `event` (Event): Event error dari tag img
- `fallback` (string, optional): URL fallback untuk ditampilkan

**Contoh:**
```javascript
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getProductImageUrl(product.image_url)} 
  alt={product.name}
  onError={(e) => handleImageError(e)}
/>

// Dengan custom fallback
<img 
  src={getProductImageUrl(product.image_url)} 
  alt={product.name}
  onError={(e) => handleImageError(e, 'https://via.placeholder.com/200')}
/>
```

### 7. `getImageUrls(images)`
Mengkonversi array of image objects menjadi array of URLs.

**Parameter:**
- `images` (Array): Array of image objects dengan property `image_url` atau `url`

**Return:** `Array<string>` - Array of full image URLs

**Contoh:**
```javascript
import { getImageUrls } from '../utils/imageHelper';

const images = [
  { image_url: 'uploads/products/img1.jpg', is_primary: true },
  { image_url: 'uploads/products/img2.jpg', is_primary: false }
];

const imageUrls = getImageUrls(images);
// Result: [
//   'http://localhost:5000/uploads/products/img1.jpg',
//   'http://localhost:5000/uploads/products/img2.jpg'
// ]
```

### 8. `getPrimaryImageUrl(images)`
Mendapatkan URL gambar utama dari array gambar produk.

**Parameter:**
- `images` (Array): Array of image objects

**Return:** `string` - Primary image URL

**Contoh:**
```javascript
import { getPrimaryImageUrl } from '../utils/imageHelper';

const images = [
  { image_url: 'uploads/products/img1.jpg', is_primary: false },
  { image_url: 'uploads/products/img2.jpg', is_primary: true }
];

const primaryUrl = getPrimaryImageUrl(images);
// Result: http://localhost:5000/uploads/products/img2.jpg
```

## Implementasi di Komponen

### Contoh 1: Product Card
```jsx
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img 
        src={getProductImageUrl(product.images?.[0]?.image_url)} 
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => handleImageError(e)}
      />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}
```

### Contoh 2: Product Gallery
```jsx
import { getImageUrls } from '../utils/imageHelper';

function ProductGallery({ product }) {
  const imageUrls = getImageUrls(product.images);
  
  return (
    <div className="gallery">
      {imageUrls.map((url, index) => (
        <img 
          key={index}
          src={url} 
          alt={`${product.name} - ${index + 1}`}
          className="gallery-item"
          onError={(e) => handleImageError(e)}
        />
      ))}
    </div>
  );
}
```

### Contoh 3: User Profile
```jsx
import { getUserAvatarUrl, handleImageError } from '../utils/imageHelper';

function UserProfile({ user }) {
  return (
    <div className="profile">
      <img 
        src={getUserAvatarUrl(user.avatar)} 
        alt={user.name}
        className="w-20 h-20 rounded-full"
        onError={(e) => handleImageError(e, 'https://ui-avatars.com/api/?name=' + user.name)}
      />
      <h2>{user.name}</h2>
    </div>
  );
}
```

### Contoh 4: Store Banner
```jsx
import { getStoreLogoUrl, getImageUrl, handleImageError } from '../utils/imageHelper';

function StoreHeader({ store }) {
  return (
    <div className="store-header">
      {/* Banner */}
      <div 
        className="banner h-48 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getImageUrl(store.banner_url, 'https://via.placeholder.com/1200x300')})` 
        }}
      />
      
      {/* Logo */}
      <img 
        src={getStoreLogoUrl(store.logo)} 
        alt={store.name}
        className="w-24 h-24 rounded-full border-4 border-white -mt-12"
        onError={(e) => handleImageError(e)}
      />
      
      <h1>{store.name}</h1>
    </div>
  );
}
```

## Backend Requirements

### 1. Struktur Response API
Backend harus mengembalikan path relatif untuk gambar:

```json
{
  "product_id": 1,
  "name": "Smartphone",
  "images": [
    {
      "image_id": 1,
      "image_url": "uploads/products/phone1.jpg",
      "is_primary": true
    },
    {
      "image_id": 2,
      "image_url": "uploads/products/phone2.jpg",
      "is_primary": false
    }
  ]
}
```

### 2. Static File Serving
Backend harus melayani file statis dari folder uploads:

**Express.js Example:**
```javascript
// Serve static files
app.use('/uploads', express.static('uploads'));
```

### 3. Folder Structure Backend
```
backend/
├── uploads/
│   ├── products/
│   │   ├── phone1.jpg
│   │   ├── phone2.jpg
│   │   └── ...
│   ├── users/
│   │   ├── avatar1.jpg
│   │   └── ...
│   ├── stores/
│   │   ├── logo1.jpg
│   │   └── ...
│   └── categories/
│       ├── icon1.png
│       └── ...
```

## Testing

### 1. Test dengan Gambar Lokal
```bash
# Jalankan backend di port 5000
cd backend
npm start

# Jalankan frontend di port 5173
cd frontend
npm run dev
```

### 2. Test dengan Gambar Eksternal
Gunakan URL lengkap untuk testing:
```javascript
const product = {
  images: [
    { 
      image_url: 'https://via.placeholder.com/400x300',
      is_primary: true 
    }
  ]
};
```

### 3. Test Error Handling
```javascript
// Test dengan path kosong
<img 
  src={getProductImageUrl(null)} 
  onError={(e) => handleImageError(e)}
/>

// Test dengan path invalid
<img 
  src={getProductImageUrl('invalid/path.jpg')} 
  onError={(e) => handleImageError(e)}
/>
```

## Production Deployment

### 1. Update Environment Variables
```env
# .env.production
VITE_BACKEND_URL=https://api.yourdomain.com
```

### 2. CDN Integration (Optional)
Jika menggunakan CDN untuk gambar:

```javascript
// src/utils/imageHelper.js
const CDN_URL = import.meta.env.VITE_CDN_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath, fallback = '...') => {
  if (!imagePath) return fallback;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Use CDN if available, otherwise use backend
  const baseUrl = CDN_URL || BACKEND_URL;
  return `${baseUrl}/${cleanPath}`;
};
```

```env
# .env.production
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_CDN_URL=https://cdn.yourdomain.com
```

## Troubleshooting

### 1. Gambar Tidak Muncul
- Cek apakah backend sudah running
- Cek apakah folder uploads sudah ada dan accessible
- Cek CORS configuration di backend
- Cek console browser untuk error

### 2. CORS Error
Backend perlu konfigurasi CORS:

```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

### 3. Path Tidak Sesuai
- Pastikan backend mengembalikan path relatif (bukan absolute path)
- Cek VITE_BACKEND_URL di file .env
- Restart Vite dev server setelah update .env

### 4. Fallback Tidak Muncul
- Pastikan menggunakan `onError` handler
- Pastikan `handleImageError` dipanggil dengan benar
- Cek network tab untuk melihat request gambar

## Best Practices

1. **Selalu gunakan helper functions** untuk konsistensi
2. **Selalu tambahkan error handler** dengan `onError`
3. **Gunakan fungsi spesifik** (`getProductImageUrl`, `getUserAvatarUrl`, dll) untuk readability
4. **Test dengan berbagai kondisi**: path kosong, invalid, eksternal URL
5. **Optimalkan gambar** di backend sebelum upload (resize, compress)
6. **Gunakan lazy loading** untuk performa lebih baik:
   ```jsx
   <img 
     src={getProductImageUrl(product.image_url)} 
     loading="lazy"
     alt={product.name}
   />
   ```

## Migration Guide

Jika ada kode lama yang masih hardcode URL:

### Before:
```jsx
<img src={`http://localhost:5000/${product.image_url}`} />
```

### After:
```jsx
import { getProductImageUrl, handleImageError } from '../utils/imageHelper';

<img 
  src={getProductImageUrl(product.image_url)} 
  onError={(e) => handleImageError(e)}
/>
```

## Summary

- ✅ Gunakan `imageHelper.js` untuk semua URL gambar
- ✅ Konfigurasi `VITE_BACKEND_URL` di `.env`
- ✅ Backend serve static files dari `/uploads`
- ✅ Backend return path relatif (bukan URL lengkap)
- ✅ Tambahkan error handling di setiap `<img>` tag
- ✅ Test dengan berbagai kondisi (valid, invalid, kosong)
