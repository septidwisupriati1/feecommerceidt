# Halaman Notifikasi Buyer

## Deskripsi
Halaman notifikasi untuk buyer yang menampilkan semua notifikasi terkait aktivitas buyer seperti pesanan, pembayaran, pengiriman, promo, dan lainnya.

## Fitur Utama

### 1. **Daftar Notifikasi**
   - Menampilkan semua notifikasi dengan paginasi
   - Notifikasi yang belum dibaca ditandai dengan border biru dan badge
   - Setiap notifikasi menampilkan:
     - Icon sesuai kategori
     - Badge kategori (Pesanan, Pembayaran, Pengiriman, Promo, dll)
     - Badge prioritas (Penting, Sedang, Rendah)
     - Judul dan pesan notifikasi
     - Timestamp (waktu relatif)
     - Metadata tambahan (Order ID, jumlah, dll)

### 2. **Filter Notifikasi**
   - **Filter Status**: Semua / Belum Dibaca / Sudah Dibaca
   - **Filter Kategori**: 
     - Semua Kategori
     - Pesanan
     - Pembayaran
     - Pengiriman
     - Promo
     - Ulasan
     - Sistem

### 3. **Bulk Actions**
   - Pilih semua notifikasi
   - Hapus notifikasi yang dipilih (bulk delete)
   - Checkbox selection untuk setiap notifikasi

### 4. **Actions per Notifikasi**
   - **Tandai sudah dibaca**: Menandai notifikasi sebagai sudah dibaca
   - **Hapus**: Menghapus notifikasi individual
   - **Klik notifikasi**: Navigasi ke halaman terkait (jika ada link)

### 5. **Header Actions**
   - **Tandai Semua Dibaca**: Menandai semua notifikasi sebagai sudah dibaca
   - **Hapus Terpilih**: Menghapus notifikasi yang dipilih
   - Menampilkan jumlah notifikasi belum dibaca

### 6. **Load More**
   - Infinite scroll dengan tombol "Muat Lebih Banyak"
   - Loading indicator saat memuat data

### 7. **Empty States**
   - Tampilan ketika tidak ada notifikasi
   - Pesan berbeda untuk filter yang berbeda

## Cara Mengakses

1. **Dari Navbar**:
   - Klik icon bell (🔔) di navbar
   - Atau navigasi langsung ke `/notifikasi`

2. **URL**: `http://localhost:5173/notifikasi`

## Integrasi Backend

Halaman ini menggunakan API notifikasi dari `src/services/notificationAPI.js`:

```javascript
// Get notifications
getNotifications({ unread: true, type: 'order', page: 1, pageSize: 20 })

// Get unread count
getUnreadCount()

// Mark as read
markAsRead(notificationId)

// Mark all as read
markAllAsRead()

// Delete notification
deleteNotification(notificationId)
```

## Tipe Notifikasi

1. **order** - Notifikasi pesanan (order status update)
2. **payment** - Notifikasi pembayaran
3. **shipping** - Notifikasi pengiriman
4. **promo** - Notifikasi promosi dan diskon
5. **review** - Notifikasi review dan rating
6. **system** - Notifikasi sistem

## Priority Levels

1. **high** - Prioritas tinggi (merah)
2. **medium** - Prioritas sedang (kuning)
3. **low** - Prioritas rendah (abu-abu)

## UI/UX Features

### Visual Indicators
- **Unread**: Border biru kiri, background icon biru, animated dot
- **Read**: Border transparan, background icon abu-abu
- **Badge kategori**: Warna berbeda untuk setiap tipe
- **Badge prioritas**: Border dan warna sesuai level

### Interactions
- Hover effect pada card notifikasi
- Click notifikasi untuk navigasi
- Responsive design untuk mobile dan desktop
- Loading states dan empty states

### Auto-refresh
- Polling setiap 30 detik untuk unread count (di NotificationDropdown)
- Manual refresh saat membuka halaman

## Styling

Menggunakan CSS Module: `NotificationPage.module.css`
- Responsive design
- Clean dan modern UI
- Consistent dengan design system

## Contoh Usage

### Navigasi ke halaman terkait
```javascript
// Jika notifikasi memiliki link
if (notification.link) {
  navigate(notification.link);
}

// Contoh link:
// - /pesanan-saya - Untuk notifikasi pesanan
// - /pesanan/:id - Untuk detail pesanan
// - /profil - Untuk notifikasi profil
```

### Filter notifikasi belum dibaca
```javascript
setFilter('unread');
```

### Filter by category
```javascript
setTypeFilter('order');
```

## Testing

Untuk testing, pastikan:
1. Backend API notifikasi berjalan
2. Token autentikasi valid
3. Ada data notifikasi di database

## Notes

- Halaman ini menggunakan `BuyerNavbar` component
- Terintegrasi dengan sistem notifikasi global
- Support untuk real-time notifications (bisa ditambahkan WebSocket)
- Kompatibel dengan fallback data jika backend tidak tersedia

## Future Enhancements

1. **Real-time notifications** dengan WebSocket
2. **Push notifications** browser
3. **Sound notifications** untuk notifikasi penting
4. **Mark as unread** feature
5. **Archive notifications** instead of delete
6. **Search/filter** notifications
7. **Export notifications** history
