# Test Users untuk Development

## Default Test Accounts

### Admin Account
```
Email: admin@ecommerce.com
Password: admin123
Role: admin
```

### Seller Account
```
Email: seller@ecommerce.com
Password: seller123
Role: seller
```

### Buyer Account
```
Email: buyer@ecommerce.com
Password: buyer123
Role: buyer
```

## Cara Menggunakan (Fallback Mode)

Jika backend tidak tersedia, sistem akan otomatis masuk ke **fallback mode**.

### Untuk Register Baru:
1. Kunjungi halaman register sesuai role:
   - Admin: `/register/admin`
   - Seller: `/register/seller`
   - Buyer: `/register/buyer` (jika ada)

2. Isi form registrasi dengan data valid

3. Sistem akan menyimpan user di localStorage dengan struktur:
```json
{
  "user_id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "phone": "081234567890",
  "email_verified": true,
  "role": "seller",
  "roles": ["seller"],
  "created_at": "2025-11-19T00:00:00.000Z"
}
```

### Untuk Login:
1. Gunakan email dan password yang sudah diregister
2. Sistem akan generate token fallback
3. User akan diredirect ke dashboard sesuai role:
   - Admin → `/admin/dashboard`
   - Seller → `/seller/dashboard`
   - Buyer → `/` (home)

## Debugging Login Issues

### Masalah: "Tidak bisa masuk ke dashboard seller"

**Penyebab yang mungkin:**
1. ✅ **FIXED**: Role format tidak konsisten (string vs array)
2. User belum register sebagai seller
3. Token atau user data di localStorage corrupt

**Solusi:**
1. Clear localStorage browser:
```javascript
// Di browser console
localStorage.clear()
```

2. Register ulang sebagai seller di `/register/seller`

3. Login dengan credentials yang baru

4. Periksa data user di browser console:
```javascript
// Di browser console
JSON.parse(localStorage.getItem('user'))
```

Output yang benar untuk seller:
```json
{
  "role": "seller",
  "roles": ["seller"],
  ...
}
```

### Verifikasi Role Check

Fungsi `hasRole()` di `authAPI.js` sekarang sudah support:
- ✅ Format array: `roles: ["seller"]` (dari backend)
- ✅ Format string: `role: "seller"` (dari fallback)

## Protected Routes

Setiap role memiliki route yang dilindungi:

### Admin Routes (`requiredRole="admin"`)
- `/admin/dashboard`
- `/admin/kelola-store`
- `/admin/kelola-user`
- `/admin/kelola-product`
- dll...

### Seller Routes (`requiredRole="seller"`)
- `/seller/dashboard`
- `/seller/produk-terjual`
- `/seller/pesanan`
- `/seller/ulasan`
- dll...

### Buyer Routes (no required role atau `requiredRole="buyer"`)
- `/`
- `/products`
- `/cart`
- `/checkout`
- dll...

## Testing Checklist

- [ ] Register sebagai seller berhasil
- [ ] Login sebagai seller berhasil
- [ ] Redirect ke `/seller/dashboard` berhasil
- [ ] SellerSidebar muncul dengan benar
- [ ] Menu sidebar berfungsi
- [ ] Data user tersimpan di localStorage
- [ ] hasRole('seller') return true
- [ ] Protected route berfungsi

## Notes

- Fallback mode hanya untuk development
- Production harus menggunakan backend API
- Token fallback tidak expire (tidak aman untuk production)
- Password disimpan plain text di localStorage fallback (TIDAK AMAN)
