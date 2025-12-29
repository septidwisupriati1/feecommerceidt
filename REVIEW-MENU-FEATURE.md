# Fitur Three-Dot Menu pada Halaman Ulasan

## Deskripsi
Fitur ini menambahkan menu tiga titik (three-dot menu) pada setiap bubble ulasan di halaman Ulasan Seller, memberikan opsi untuk:
- **Blokir Pengguna**: Memblokir pengguna yang memberikan ulasan
- **Hapus Ulasan**: Menghapus ulasan yang tidak sesuai
- **Laporkan**: Melaporkan ulasan yang bermasalah ke admin

## Lokasi File
`src/pages/seller/UlasanPage.jsx`

## Fitur Utama

### 1. Three-Dot Menu Button
- Icon tiga titik vertikal pada pojok kanan atas setiap bubble ulasan
- Hover effect untuk memberikan feedback visual
- Tombol dapat diklik untuk membuka/menutup dropdown menu

### 2. Dropdown Menu
Berisi 3 opsi dengan icon dan warna yang berbeda:

#### Blokir Pengguna (Merah)
- Icon: `NoSymbolIcon`
- Warna: Merah (`text-red-600`, `hover:bg-red-50`)
- Fungsi: Memblokir pengguna agar tidak bisa memberikan ulasan lagi
- Konfirmasi: Alert konfirmasi sebelum eksekusi

#### Hapus Ulasan (Orange)
- Icon: `TrashIcon`
- Warna: Orange (`text-orange-600`, `hover:bg-orange-50`)
- Fungsi: Menghapus ulasan dari sistem
- Konfirmasi: Alert konfirmasi dengan peringatan bahwa tindakan tidak dapat dibatalkan

#### Laporkan (Kuning)
- Icon: `ExclamationTriangleIcon`
- Warna: Kuning (`text-yellow-600`, `hover:bg-yellow-50`)
- Fungsi: Melaporkan ulasan ke admin dengan pilihan alasan:
  1. Spam atau iklan
  2. Konten tidak pantas
  3. Bahasa kasar atau ofensif
  4. Review palsu atau tidak valid
  5. Ujaran kebencian
  6. Lainnya (dengan input detail tambahan)
- Proses: 
  - Pilih alasan dengan memasukkan nomor (1-6)
  - Jika pilih "Lainnya", diminta input detail
  - Konfirmasi sebelum mengirim laporan

### 3. Close on Click Outside
- Dropdown menu akan otomatis tertutup saat user klik di area lain
- Menggunakan event listener untuk mendeteksi klik di luar dropdown

## Cara Penggunaan

### Untuk Seller:
1. Buka halaman **Ulasan Produk**
2. Pada setiap bubble ulasan, klik icon **tiga titik** di pojok kanan atas
3. Pilih salah satu opsi:
   - **Blokir Pengguna**: Jika ingin memblokir pengguna tersebut
   - **Hapus Ulasan**: Jika ingin menghapus ulasan
   - **Laporkan**: Jika ingin melaporkan ulasan ke admin
4. Ikuti dialog konfirmasi yang muncul

### Catatan Penting:
- Semua aksi memerlukan konfirmasi sebelum dieksekusi
- Setelah aksi berhasil, halaman akan refresh otomatis
- Hapus ulasan bersifat permanen dan tidak dapat dibatalkan
- Laporan akan ditinjau oleh admin dalam 1-2 hari kerja

## Kode Utama

### State Management
```jsx
const [openDropdownId, setOpenDropdownId] = useState(null);
```

### Handler Functions
```jsx
// Toggle dropdown
const toggleDropdown = (reviewId) => {
  setOpenDropdownId(openDropdownId === reviewId ? null : reviewId);
};

// Handle block user
const handleBlockUser = async (reviewId, customerName) => { ... }

// Handle delete review
const handleDeleteReview = async (reviewId, customerName) => { ... }

// Handle report review
const handleReportReview = async (reviewId, customerName) => { ... }
```

### UI Component
```jsx
<div className="relative ml-2 dropdown-menu-container">
  <button onClick={() => toggleDropdown(review.id)}>
    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
  </button>
  
  {openDropdownId === review.id && (
    <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg">
      {/* Menu items */}
    </div>
  )}
</div>
```

## Dependencies
- `@heroicons/react` - untuk icon
- React hooks: `useState`, `useEffect`
- UI Components: Button, Card dari komponen UI

## Styling
- Menggunakan Tailwind CSS
- Shadow dan border untuk dropdown
- Hover effects untuk setiap menu item
- Warna berbeda untuk setiap opsi (merah, orange, kuning)

## Future Improvements
- Integrasi dengan backend API untuk blokir, hapus, dan lapor
- Tambahkan animasi slide/fade untuk dropdown
- Implementasi undo untuk hapus ulasan
- Dashboard admin untuk melihat laporan

## Testing
Untuk menguji fitur:
1. Jalankan aplikasi: `npm run dev`
2. Login sebagai seller
3. Navigasi ke halaman Ulasan Produk
4. Klik icon tiga titik pada salah satu ulasan
5. Coba setiap opsi menu

---
*Dibuat pada: 19 Desember 2025*
*Update terakhir: 19 Desember 2025*
